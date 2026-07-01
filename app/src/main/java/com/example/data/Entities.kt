package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "assets")
data class AssetEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val category: String, // MicroApps, Skills, AI Agents, Automations, Templates
    val imageUrl: String, // Placeholder description or system icon
    val timeToCustomize: String, // ex: "2 mins"
    val level: String, // Beginner, Intermediate, Advanced
    val compatibility: String, // iOS, Android, Web, API
    val skillIncluded: String, // ex: "NLU Parsing, Vector Search"
    val masterPrompt: String, // editable Master Prompt
    val documentation: String,
    val tutorial: String,
    val isDeployReady: Boolean = false,
    val isRemixReady: Boolean = true,
    val version: String = "1.0.0",
    val downloadsCount: Int = 124,
    val rating: Float = 4.8f,
    val lastUpdated: String = "Just now",
    val isFavorite: Boolean = false,
    val isDownloaded: Boolean = false,
    val isCustom: Boolean = false // If created or remixed by user
)

@Entity(tableName = "activities")
data class ActivityEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val assetId: String,
    val assetTitle: String,
    val actionType: String, // REMIX, DEPLOY, FAVORITE, DOWNLOAD
    val timestamp: Long = System.currentTimeMillis()
)
