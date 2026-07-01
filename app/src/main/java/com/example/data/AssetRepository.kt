package com.example.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first

class AssetRepository(private val assetDao: AssetDao) {

    val allAssets: Flow<List<AssetEntity>> = assetDao.getAllAssets()
    val allActivities: Flow<List<ActivityEntity>> = assetDao.getAllActivities()

    fun getAssetByIdFlow(id: String): Flow<AssetEntity?> {
        return assetDao.getAssetByIdFlow(id)
    }

    suspend fun getAssetById(id: String): AssetEntity? {
        return assetDao.getAssetById(id)
    }

    suspend fun insertAsset(asset: AssetEntity) {
        assetDao.insertAsset(asset)
    }

    suspend fun updateAsset(asset: AssetEntity) {
        assetDao.updateAsset(asset)
    }

    suspend fun insertActivity(assetId: String, assetTitle: String, actionType: String) {
        val activity = ActivityEntity(
            assetId = assetId,
            assetTitle = assetTitle,
            actionType = actionType
        )
        assetDao.insertActivity(activity)
    }

    suspend fun checkAndSeedDatabase() {
        val currentAssets = allAssets.first()
        if (currentAssets.isEmpty()) {
            val seedAssets = listOf(
                AssetEntity(
                    id = "fintech-advisor",
                    title = "Fintech Advisor Pro",
                    description = "Enterprise conversational AI agent for Brazilian tax structure optimizing, investment rebalancing, and treasury planning.",
                    category = "AI Agents",
                    imageUrl = "ai_agent_fintech",
                    timeToCustomize = "3 mins",
                    level = "Advanced",
                    compatibility = "API, Web, Webhook",
                    skillIncluded = "Financial NLU & Tax Rules engine",
                    masterPrompt = """
                        You are Fintech Advisor Pro, an elite corporate financial consultant.
                        Your objective is to optimize tax plans under Brazilian laws (Lucro Real, Lucro Presumido, Simples Nacional).
                        Analyze balance sheets, identify municipal/state tax exemptions, and suggest optimized treasury yields.
                        Format responses in high-contrast corporate Markdown with explicit mathematical proofing tables.
                    """.trimIndent(),
                    documentation = """
                        ### Fintech Advisor Pro Documentation
                        This high-performance AI Agent uses direct embeddings mapped to updated corporate tax tables.
                        
                        #### Setup
                        1. Connect your ERP webhook endpoint.
                        2. Send serialized billing records to `/v1/analyze-tax`.
                        3. Prompt Fintech Advisor with the desired Brazilian taxation frame.
                    """.trimIndent(),
                    tutorial = """
                        1. Click **Remix** to append company-specific rules to the master prompt.
                        2. Deploy the agent with 1-click to get a public URL webhook.
                        3. Query via cURL or any standard REST client.
                    """.trimIndent(),
                    version = "1.2.4",
                    downloadsCount = 1432,
                    rating = 4.9f,
                    lastUpdated = "2 hours ago",
                    isFavorite = true,
                    isDeployReady = true
                ),
                AssetEntity(
                    id = "supabase-schema",
                    title = "Supabase Visual Schema",
                    description = "Interactive visualization engine that parses active Postgres databases, maps foreign relationships, and exports layout graphs.",
                    category = "MicroApps",
                    imageUrl = "microapp_supabase",
                    timeToCustomize = "1 min",
                    level = "Intermediate",
                    compatibility = "Supabase, Postgres, Web",
                    skillIncluded = "SQL AST Parser & Schema Mapper",
                    masterPrompt = """
                        You are the Schema Parser. Given raw SQL definitions (CREATE TABLE) or schema representations,
                        parse all foreign key relationships, identify cascade behaviors, and output a structured JSON:
                        {
                          "tables": [{ "name": "...", "columns": [{"name": "...", "type": "...", "isPk": true}] }],
                          "relations": [{ "fromTable": "...", "toTable": "...", "fromColumn": "...", "toColumn": "..." }]
                        }
                    """.trimIndent(),
                    documentation = """
                        ### Supabase Visual Schema Documentation
                        Generate instant visual representations of Postgres SQL configurations without leaving your workspace.
                        
                        #### API Integrations
                        - Integrates natively with `supabase-js` client wrapper.
                        - Supports custom DB connectors using standard secure SSH tunneling.
                    """.trimIndent(),
                    tutorial = """
                        1. Paste your raw Postgres DDL or CREATE TABLE script.
                        2. Tap the **Parse Schema** button.
                        3. Review generated relations card-by-card in real-time.
                    """.trimIndent(),
                    version = "2.0.1",
                    downloadsCount = 890,
                    rating = 4.8f,
                    lastUpdated = "1 day ago",
                    isFavorite = false,
                    isDeployReady = false
                ),
                AssetEntity(
                    id = "sentiment-intent",
                    title = "Sentiment & Intent Engine",
                    description = "Enterprise Natural Language Understanding (NLU) skill that categorizes tickets, gauges urgency levels, and crafts rapid responses.",
                    category = "Skills",
                    imageUrl = "skill_sentiment",
                    timeToCustomize = "2 mins",
                    level = "Beginner",
                    compatibility = "REST API, Zapier, Make",
                    skillIncluded = "Multi-label NLU Classifier",
                    masterPrompt = """
                        Analyze incoming customer support tickets. Extract sentiment score (-1 to +1),
                        urgency category (HIGH, MEDIUM, LOW), departments (billing, engineering, security),
                        and draft a highly formal rapid-reply starting with 'Prezado Cliente, agradecemos...'
                        Output ONLY valid JSON matches:
                        {
                          "sentiment": 0.2,
                          "urgency": "HIGH",
                          "department": "billing",
                          "suggestedReply": "..."
                        }
                    """.trimIndent(),
                    documentation = """
                        ### Sentiment & Intent Classifier
                        Deploy a robust triage mechanism that handles thousands of concurrent tickets in milliseconds.
                        
                        #### Capabilities
                        - Supports English, Portuguese, Spanish, and French naturally.
                        - Generates fully sanitized replies with sensitive user information redaction.
                    """.trimIndent(),
                    tutorial = """
                        1. Connect with HubSpot or Zendesk Webhook pipelines.
                        2. Map input string to the NLU parameter body.
                        3. Process triage response dynamically.
                    """.trimIndent(),
                    version = "1.0.2",
                    downloadsCount = 2105,
                    rating = 4.7f,
                    lastUpdated = "5 mins ago",
                    isFavorite = true,
                    isDeployReady = true
                ),
                AssetEntity(
                    id = "hubspot-enricher",
                    title = "Hubspot Lead Enricher",
                    description = "Automated sales pipeline engine that extracts LinkedIn profiles, maps funding series, and synthesizes email icebreakers.",
                    category = "Automations",
                    imageUrl = "automation_hubspot",
                    timeToCustomize = "5 mins",
                    level = "Advanced",
                    compatibility = "HubSpot, LinkedIn, API",
                    skillIncluded = "SaaS Leads Crawler & Personalization Generator",
                    masterPrompt = """
                        You are the Enterprise Lead Enricher. Take raw LinkedIn bio data, current job titles, and funding round press releases.
                        Extract current capital status, pinpoint active corporate bottlenecks, and write 3 highly persuasive sales pitch icebreakers
                        focusing on ROI and tech integration metrics.
                    """.trimIndent(),
                    documentation = """
                        ### HubSpot Lead Enricher
                        Scale outbound sales efforts with bespoke personalizing prompts generated instantly per lead.
                        
                        #### API Setup
                        Ensure your HubSpot Developer Portal token is defined in variables under `HUBSPOT_CLIENT_KEY`.
                    """.trimIndent(),
                    tutorial = """
                        1. Paste the target LinkedIn Profile HTML or raw bio dump.
                        2. Define product pitch parameters (value prop, pricing).
                        3. Generate tailored outreach emails ready to export.
                    """.trimIndent(),
                    version = "3.1.0",
                    downloadsCount = 540,
                    rating = 4.9f,
                    lastUpdated = "3 days ago",
                    isFavorite = false,
                    isDeployReady = false
                ),
                AssetEntity(
                    id = "saas-landing-template",
                    title = "SaaS Dark Landing",
                    description = "Minimalist, sleek, dark-premium landing page template with high contrast widgets, live waitlist counters, and linear gradients.",
                    category = "Templates",
                    imageUrl = "template_saas",
                    timeToCustomize = "2 mins",
                    level = "Beginner",
                    compatibility = "React, Tailwind, HTML",
                    skillIncluded = "Tailwind Styling generator",
                    masterPrompt = """
                        Generate clean, responsive Tailwind CSS layouts with deep black canvases (#030712),
                        subtle card structures with fine light gray borders, elegant font styles, and responsive CSS elements.
                        Ensure the overall look matches high-fidelity SaaS platforms like Vercel and Linear.
                    """.trimIndent(),
                    documentation = """
                        ### SaaS Dark Landing Page Template
                        Speed up your startup launch using pre-styled landing templates.
                        
                        #### Stack
                        - Next.js (Pages / App Router)
                        - Tailwind CSS v4.0
                        - Lucio/Radix UI Elements
                    """.trimIndent(),
                    tutorial = """
                        1. Open the Asset customizer.
                        2. Tailor hero text, feature highlights, and subscription fields.
                        3. Click deploy to host instant static mock previews on Vercel.
                    """.trimIndent(),
                    version = "1.0.5",
                    downloadsCount = 3120,
                    rating = 4.9f,
                    lastUpdated = "1 week ago",
                    isFavorite = true,
                    isDeployReady = true
                )
            )
            assetDao.insertAssets(seedAssets)
        }
    }
}
