package com.example.data

import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Query
import java.util.concurrent.TimeUnit
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

// --- Moshi/Retrofit Data Models ---

data class Part(val text: String? = null)
data class Content(val parts: List<Part>)

data class GenerateContentRequest(
    val contents: List<Content>,
    val systemInstruction: Content? = null
)

data class Candidate(val content: Content)
data class GenerateContentResponse(val candidates: List<Candidate>?)

// --- Retrofit API Service ---

interface GeminiApiService {
    @POST("v1beta/models/gemini-3.5-flash:generateContent")
    suspend fun generateContent(
        @Query("key") apiKey: String,
        @Body request: GenerateContentRequest
    ): GenerateContentResponse
}

object RetrofitClient {
    private const val BASE_URL = "https://generativelanguage.googleapis.com/"

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    private val moshi = Moshi.Builder()
        .addLast(KotlinJsonAdapterFactory())
        .build()

    val service: GeminiApiService by lazy {
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
        retrofit.create(GeminiApiService::class.java)
    }
}

// --- Gemini Content Generator Helper ---

object GeminiContentGenerator {
    suspend fun remixPrompt(originalPrompt: String, remixInstructions: String): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            // Graceful fallback if API key is not configured in secrets yet
            return@withContext """
                // [FALLBACK REMIXED PROMPT - KEY MISSING]
                // Below is a client-side simulated remix of: "$originalPrompt"
                // Instructions applied: "$remixInstructions"
                
                System: Optimized for specialized SaaS logic.
                $originalPrompt
                
                // Personalized user addition:
                Custom Rule: $remixInstructions
            """.trimIndent()
        }

        val prompt = """
            You are ForgeHub AI Prompt Architect, specializing in high-performance prompt engineering.
            I will give you a "Master Prompt" and a set of "Remix Instructions" to customize it.
            You must outputs a newly optimized, comprehensive, professional Master Prompt that merges both seamlessly, preserving the core structure but perfectly embedding the user's specific customizations.
            
            MASTER PROMPT TO CUSTOMIZE:
            "$originalPrompt"
            
            REMIX INSTRUCTIONS:
            "$remixInstructions"
            
            Your response must consist ONLY of the newly generated Master Prompt itself. Do not include introductory text, conversational chatter, markdown codeblock wraps (like ```), or explanations. Just output the clean prompt.
        """.trimIndent()

        val request = GenerateContentRequest(
            contents = listOf(Content(parts = listOf(Part(text = prompt))))
        )

        try {
            val response = RetrofitClient.service.generateContent(apiKey, request)
            val output = response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
            output ?: "Error: Failed to extract remixed prompt text."
        } catch (e: Exception) {
            "Error: ${e.localizedMessage ?: "Unknown error occurred"}"
        }
    }
}
