package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class ForgeHubViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getDatabase(application)
    private val repository = AssetRepository(db.assetDao())

    // All available assets & activities directly from DB
    val allAssets: StateFlow<List<AssetEntity>> = repository.allAssets
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val activities: StateFlow<List<ActivityEntity>> = repository.allActivities
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // UI state states
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _activeCategory = MutableStateFlow("Todos")
    val activeCategory: StateFlow<String> = _activeCategory.asStateFlow()

    private val _selectedAssetId = MutableStateFlow<String?>(null)
    val selectedAsset: StateFlow<AssetEntity?> = _selectedAssetId
        .flatMapLatest { id ->
            if (id != null) repository.getAssetByIdFlow(id) else flowOf(null)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // SaaS state
    private val _workspaceName = MutableStateFlow("ForgeHub Core")
    val workspaceName: StateFlow<String> = _workspaceName.asStateFlow()

    private val _userName = MutableStateFlow("Cris Suboy")
    val userName: StateFlow<String> = _userName.asStateFlow()

    private val _userEmail = MutableStateFlow("cris.suboy@gmail.com")
    val userEmail: StateFlow<String> = _userEmail.asStateFlow()

    private val _apiKeyCreated = MutableStateFlow<String?>("fh_live_8f3a9d2c1e7b4c8d")
    val apiKeyCreated: StateFlow<String?> = _apiKeyCreated.asStateFlow()

    // Status states
    private val _isRemixing = MutableStateFlow(false)
    val isRemixing: StateFlow<Boolean> = _isRemixing.asStateFlow()

    private val _isDeploying = MutableStateFlow(false)
    val isDeploying: StateFlow<Boolean> = _isDeploying.asStateFlow()

    // Notification list state
    private val _notifications = MutableStateFlow<List<String>>(
        listOf(
            "Bem-vindo ao ForgeHub AI! Seu workspace corporativo está configurado.",
            "Fintech Advisor Pro atualizado para a versão 1.2.4 com regras tributárias atualizadas.",
            "Deploy realizado com sucesso: SaaS Dark Landing no cluster Vercel edge."
        )
    )
    val notifications: StateFlow<List<String>> = _notifications.asStateFlow()

    init {
        viewModelScope.launch {
            repository.checkAndSeedDatabase()
        }
    }

    fun selectAsset(id: String?) {
        _selectedAssetId.value = id
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setActiveCategory(category: String) {
        _activeCategory.value = category
    }

    fun setWorkspaceName(name: String) {
        _workspaceName.value = name
    }

    fun setUserName(name: String) {
        _userName.value = name
    }

    fun toggleFavorite(id: String) {
        viewModelScope.launch {
            val asset = repository.getAssetById(id) ?: return@launch
            val updated = asset.copy(isFavorite = !asset.isFavorite)
            repository.updateAsset(updated)
            repository.insertActivity(
                assetId = asset.id,
                assetTitle = asset.title,
                actionType = if (updated.isFavorite) "FAVORITE" else "UNFAVORITE"
            )
        }
    }

    fun downloadAsset(id: String) {
        viewModelScope.launch {
            val asset = repository.getAssetById(id) ?: return@launch
            val updated = asset.copy(
                isDownloaded = true,
                downloadsCount = asset.downloadsCount + 1
            )
            repository.updateAsset(updated)
            repository.insertActivity(
                assetId = asset.id,
                assetTitle = asset.title,
                actionType = "DOWNLOAD"
            )
        }
    }

    fun deployAsset(id: String) {
        viewModelScope.launch {
            _isDeploying.value = true
            delay(1800) // premium animation delay
            val asset = repository.getAssetById(id) ?: return@launch
            val updated = asset.copy(isDeployReady = true)
            repository.updateAsset(updated)
            repository.insertActivity(
                assetId = asset.id,
                assetTitle = asset.title,
                actionType = "DEPLOY"
            )
            _notifications.update { current ->
                listOf("Asset '${asset.title}' deploy realizado em produção!", *current.toTypedArray())
            }
            _isDeploying.value = false
        }
    }

    fun remixAsset(id: String, instructions: String, onFinished: (String) -> Unit) {
        viewModelScope.launch {
            _isRemixing.value = true
            val asset = repository.getAssetById(id) ?: return@launch
            
            // Call actual Gemini API to remix the Master Prompt!
            val newPrompt = GeminiContentGenerator.remixPrompt(asset.masterPrompt, instructions)
            
            val remixedId = "${asset.id}-remix-${System.currentTimeMillis() % 10000}"
            val remixedAsset = AssetEntity(
                id = remixedId,
                title = "Remix: ${asset.title}",
                description = "Customizado: $instructions",
                category = asset.category,
                imageUrl = asset.imageUrl,
                timeToCustomize = "1 min",
                level = asset.level,
                compatibility = asset.compatibility,
                skillIncluded = asset.skillIncluded,
                masterPrompt = newPrompt,
                documentation = "### Remixed Documentation\nGenerated based on: ${asset.title}\n\n$instructions",
                tutorial = asset.tutorial,
                isDeployReady = false,
                isRemixReady = true,
                version = "v1.0.0-remix",
                downloadsCount = 1,
                rating = 5.0f,
                lastUpdated = "Just now",
                isFavorite = false,
                isDownloaded = true,
                isCustom = true
            )
            
            repository.insertAsset(remixedAsset)
            repository.insertActivity(
                assetId = remixedId,
                assetTitle = remixedAsset.title,
                actionType = "REMIX"
            )
            _isRemixing.value = false
            onFinished(remixedId)
        }
    }

    fun updateMasterPrompt(id: String, newPrompt: String) {
        viewModelScope.launch {
            val asset = repository.getAssetById(id) ?: return@launch
            val updated = asset.copy(masterPrompt = newPrompt)
            repository.updateAsset(updated)
        }
    }

    fun createApiKey() {
        val chars = "abcdef0123456789"
        val randomStr = (1..16).map { chars.random() }.joinToString("")
        _apiKeyCreated.value = "fh_live_$randomStr"
    }

    fun clearNotifications() {
        _notifications.value = emptyList()
    }
}
