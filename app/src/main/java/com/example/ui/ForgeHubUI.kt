package com.example.ui

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.theme.*
import kotlinx.coroutines.launch

// Navigation Destination Representation
sealed class Screen(val title: String, val icon: ImageVector) {
    object Dashboard : Screen("Dashboard", Icons.Default.Home)
    object Biblioteca : Screen("Biblioteca", Icons.Default.List)
    object MicroApps : Screen("MicroApps", Icons.Default.Build)
    object Skills : Screen("Skills", Icons.Default.Refresh)
    object AiAgents : Screen("AI Agents", Icons.Default.Person)
    object Automations : Screen("Automations", Icons.Default.Build)
    object Templates : Screen("Templates", Icons.Default.List)
    object Academy : Screen("Academy", Icons.Default.Info)
    object Settings : Screen("Configurações", Icons.Default.Settings)
}

@Composable
fun ForgeHubMainContainer(
    viewModel: ForgeHubViewModel,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Dashboard) }
    var selectedAssetIdForDetail by remember { mutableStateOf<String?>(null) }
    var isEditingAsset by remember { mutableStateOf<String?>(null) }
    
    // Sidebar open/close state on compact devices
    var isSidebarOpen by remember { mutableStateOf(false) }
    
    // Top Bar popups
    var isNotificationsOpen by remember { mutableStateOf(false) }
    var isWorkspaceMenuOpen by remember { mutableStateOf(false) }
    var isProfileMenuOpen by remember { mutableStateOf(false) }

    val searchQuery by viewModel.searchQuery.collectAsState()
    val activeCategory by viewModel.activeCategory.collectAsState()
    val assets by viewModel.allAssets.collectAsState()
    val activities by viewModel.activities.collectAsState()
    val notifications by viewModel.notifications.collectAsState()
    val workspaceName by viewModel.workspaceName.collectAsState()
    val userName by viewModel.userName.collectAsState()
    val userEmail by viewModel.userEmail.collectAsState()

    val selectedAsset by viewModel.selectedAsset.collectAsState()

    // Root layout: Sidebar (Drawer) + Main Content Panel
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(BackgroundDark)
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            // Sidebar for wide screens (persistent) or drawer (overlay)
            // On standard mobile, we will show a beautifully responsive Left Drawer
            ForgeHubSidebar(
                activeScreen = currentScreen,
                onScreenSelected = { screen ->
                    currentScreen = screen
                    selectedAssetIdForDetail = null
                    isEditingAsset = null
                    isSidebarOpen = false
                },
                onCategorySelected = { categoryName, screen ->
                    viewModel.setActiveCategory(categoryName)
                    currentScreen = screen
                    selectedAssetIdForDetail = null
                    isEditingAsset = null
                    isSidebarOpen = false
                },
                userName = userName,
                workspaceName = workspaceName,
                modifier = Modifier
                    .width(260.dp)
                    .fillMaxHeight()
                    .background(SurfaceDark)
                    .border(1.dp, Color(0xFF2E3A4E))
            )

            // Main Core Display
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
            ) {
                // Top Action Deck
                ForgeHubTopBar(
                    workspaceName = workspaceName,
                    searchQuery = searchQuery,
                    onSearchQueryChange = { viewModel.setSearchQuery(it) },
                    onMenuToggle = { isSidebarOpen = !isSidebarOpen },
                    notificationsCount = notifications.size,
                    onNotificationsClick = { isNotificationsOpen = !isNotificationsOpen },
                    onWorkspaceClick = { isWorkspaceMenuOpen = !isWorkspaceMenuOpen },
                    onProfileClick = { isProfileMenuOpen = !isProfileMenuOpen }
                )

                // Render screens inside a smooth crossfade transition
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                ) {
                    when {
                        // Render Asset Editor / Remix Panel
                        isEditingAsset != null -> {
                            AssetEditorScreen(
                                assetId = isEditingAsset!!,
                                viewModel = viewModel,
                                onBack = { isEditingAsset = null }
                            )
                        }
                        // Render Asset Detailed specifications
                        selectedAssetIdForDetail != null -> {
                            AssetDetailScreen(
                                assetId = selectedAssetIdForDetail!!,
                                viewModel = viewModel,
                                onBack = { selectedAssetIdForDetail = null },
                                onOpenCustomize = { isEditingAsset = selectedAssetIdForDetail }
                            )
                        }
                        // Render Tab Views
                        else -> {
                            when (currentScreen) {
                                Screen.Dashboard -> {
                                    DashboardScreen(
                                        viewModel = viewModel,
                                        assets = assets,
                                        activities = activities,
                                        onSelectAsset = { selectedAssetIdForDetail = it },
                                        onCustomizeAsset = { isEditingAsset = it }
                                    )
                                }
                                Screen.Biblioteca -> {
                                    BibliotecaScreen(
                                        viewModel = viewModel,
                                        assets = assets,
                                        onSelectAsset = { selectedAssetIdForDetail = it }
                                    )
                                }
                                Screen.MicroApps, Screen.Skills, Screen.AiAgents, Screen.Automations, Screen.Templates -> {
                                    ExploreCatalogScreen(
                                        viewModel = viewModel,
                                        assets = assets,
                                        onSelectAsset = { selectedAssetIdForDetail = it }
                                    )
                                }
                                Screen.Academy -> {
                                    AcademyScreen()
                                }
                                Screen.Settings -> {
                                    SettingsScreen(viewModel = viewModel)
                                }
                            }
                        }
                    }

                    // --- Overlay Notification Panel Dropdown ---
                    if (isNotificationsOpen) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color.Black.copy(alpha = 0.4f))
                                .clickable { isNotificationsOpen = false }
                        ) {
                            Card(
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .padding(top = 8.dp, end = 16.dp)
                                    .width(340.dp)
                                    .testTag("notifications_card"),
                                colors = CardDefaults.cardColors(containerColor = CardDark),
                                border = BorderStroke(1.dp, BorderDark),
                                elevation = CardDefaults.cardElevation(8.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            "Notificações",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 16.sp,
                                            color = TextPrimary
                                        )
                                        if (notifications.isNotEmpty()) {
                                            TextButton(onClick = { viewModel.clearNotifications() }) {
                                                Text("Limpar tudo", color = ForgeSecondary, fontSize = 12.sp)
                                            }
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(8.dp))
                                    if (notifications.isEmpty()) {
                                        Text(
                                            "Sem notificações pendentes.",
                                            color = TextSecondary,
                                            fontSize = 13.sp,
                                            modifier = Modifier.padding(vertical = 16.dp)
                                        )
                                    } else {
                                        LazyColumn(modifier = Modifier.heightIn(max = 250.dp)) {
                                            items(notifications) { alert ->
                                                Row(
                                                    modifier = Modifier
                                                        .fillMaxWidth()
                                                        .padding(vertical = 8.dp),
                                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                                ) {
                                                    Icon(
                                                        Icons.Default.Info,
                                                        contentDescription = "Alert",
                                                        tint = ForgePrimary,
                                                        modifier = Modifier.size(16.dp)
                                                    )
                                                    Text(
                                                        alert,
                                                        fontSize = 13.sp,
                                                        color = TextPrimary
                                                    )
                                                }
                                                Divider(color = DividerDark)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // --- Workspace Switcher Dropdown Menu ---
                    if (isWorkspaceMenuOpen) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color.Black.copy(alpha = 0.1f))
                                .clickable { isWorkspaceMenuOpen = false }
                        ) {
                            Card(
                                modifier = Modifier
                                    .align(Alignment.TopStart)
                                    .padding(top = 8.dp, start = 16.dp)
                                    .width(220.dp),
                                colors = CardDefaults.cardColors(containerColor = CardDark),
                                border = BorderStroke(1.dp, BorderDark)
                            ) {
                                Column(modifier = Modifier.padding(8.dp)) {
                                    Text(
                                        "Workspaces",
                                        fontWeight = FontWeight.SemiBold,
                                        fontSize = 12.sp,
                                        color = TextSecondary,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                    DropdownMenuItem(
                                        text = { Text("ForgeHub Core (Ativo)", color = TextPrimary) },
                                        onClick = {
                                            viewModel.setWorkspaceName("ForgeHub Core")
                                            isWorkspaceMenuOpen = false
                                        },
                                        leadingIcon = { Icon(Icons.Default.Home, "Workspace", tint = ForgePrimary) }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("SaaS Sandbox", color = TextPrimary) },
                                        onClick = {
                                            viewModel.setWorkspaceName("SaaS Sandbox")
                                            isWorkspaceMenuOpen = false
                                        },
                                        leadingIcon = { Icon(Icons.Default.List, "Workspace", tint = TextSecondary) }
                                    )
                                    Divider(color = DividerDark)
                                    DropdownMenuItem(
                                        text = { Text("Criar Workspace", color = ForgeSecondary) },
                                        onClick = {
                                            viewModel.setWorkspaceName("Novo Workspace Dev")
                                            isWorkspaceMenuOpen = false
                                        },
                                        leadingIcon = { Icon(Icons.Default.Add, "New", tint = ForgeSecondary) }
                                    )
                                }
                            }
                        }
                    }

                    // --- Profile Quick Menu ---
                    if (isProfileMenuOpen) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color.Black.copy(alpha = 0.1f))
                                .clickable { isProfileMenuOpen = false }
                        ) {
                            Card(
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .padding(top = 8.dp, end = 16.dp)
                                    .width(240.dp),
                                colors = CardDefaults.cardColors(containerColor = CardDark),
                                border = BorderStroke(1.dp, BorderDark)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(36.dp)
                                                .clip(CircleShape)
                                                .background(ForgePrimary),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                userName.take(2).uppercase(),
                                                color = Color.White,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Column {
                                            Text(userName, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                            Text(userEmail, color = TextSecondary, fontSize = 11.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(12.dp))
                                    Divider(color = DividerDark)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    DropdownMenuItem(
                                        text = { Text("Meu Perfil", color = TextPrimary) },
                                        onClick = {
                                            currentScreen = Screen.Settings
                                            isProfileMenuOpen = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Faturamento / Billing", color = TextPrimary) },
                                        onClick = {
                                            currentScreen = Screen.Settings
                                            isProfileMenuOpen = false
                                        }
                                    )
                                    Divider(color = DividerDark)
                                    DropdownMenuItem(
                                        text = { Text("Terminar Sessão", color = ForgeDanger) },
                                        onClick = { isProfileMenuOpen = false }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // --- Mobile Overlay Slide Drawer Sidebar ---
        if (isSidebarOpen) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.6f))
                    .clickable { isSidebarOpen = false }
            ) {
                Box(
                    modifier = Modifier
                        .width(280.dp)
                        .fillMaxHeight()
                        .background(SurfaceDark)
                        .clickable(enabled = false) {}
                        .align(Alignment.TopStart)
                ) {
                    ForgeHubSidebar(
                        activeScreen = currentScreen,
                        onScreenSelected = { screen ->
                            currentScreen = screen
                            selectedAssetIdForDetail = null
                            isEditingAsset = null
                            isSidebarOpen = false
                        },
                        onCategorySelected = { categoryName, screen ->
                            viewModel.setActiveCategory(categoryName)
                            currentScreen = screen
                            selectedAssetIdForDetail = null
                            isEditingAsset = null
                            isSidebarOpen = false
                        },
                        userName = userName,
                        workspaceName = workspaceName,
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }
        }
    }
}

// ==========================================
// COMPONENT: Left Sidebar Drawer
// ==========================================
@Composable
fun ForgeHubSidebar(
    activeScreen: Screen,
    onScreenSelected: (Screen) -> Unit,
    onCategorySelected: (String, Screen) -> Unit,
    userName: String,
    workspaceName: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .padding(14.dp)
            .fillMaxHeight(),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            modifier = Modifier.weight(1f, fill = false)
        ) {
            // Header Brand Identity
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 20.dp, start = 4.dp, top = 4.dp)
            ) {
                // Neon glowing brand mark
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(Color(0xFF3B82F6), Color(0xFF8B5CF6))
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Build,
                        contentDescription = "ForgeHub Logo",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    "ForgeHub AI",
                    fontFamily = FontFamily.SansSerif,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary,
                    fontSize = 17.sp,
                    letterSpacing = (-0.5).sp
                )
            }

            // Navigation Items List
            Column(
                modifier = Modifier.verticalScroll(rememberScrollState())
            ) {
                SidebarNavItem(
                    title = "Dashboard",
                    icon = Icons.Default.Home,
                    isActive = activeScreen == Screen.Dashboard,
                    onClick = { onScreenSelected(Screen.Dashboard) }
                )

                SidebarNavItem(
                    title = "Biblioteca",
                    icon = Icons.Default.List,
                    isActive = activeScreen == Screen.Biblioteca,
                    onClick = { onScreenSelected(Screen.Biblioteca) }
                )

                SidebarNavItem(
                    title = "MicroApps",
                    icon = Icons.Default.Build,
                    isActive = activeScreen == Screen.MicroApps,
                    onClick = { onCategorySelected("MicroApps", Screen.MicroApps) }
                )

                SidebarNavItem(
                    title = "Skills",
                    icon = Icons.Default.Refresh,
                    isActive = activeScreen == Screen.Skills,
                    onClick = { onCategorySelected("Skills", Screen.Skills) }
                )

                SidebarNavItem(
                    title = "AI Agents",
                    icon = Icons.Default.Person,
                    isActive = activeScreen == Screen.AiAgents,
                    onClick = { onCategorySelected("AI Agents", Screen.AiAgents) }
                )

                SidebarNavItem(
                    title = "Automations",
                    icon = Icons.Default.Build,
                    isActive = activeScreen == Screen.Automations,
                    onClick = { onCategorySelected("Automations", Screen.Automations) }
                )

                SidebarNavItem(
                    title = "Templates",
                    icon = Icons.Default.List,
                    isActive = activeScreen == Screen.Templates,
                    onClick = { onCategorySelected("Templates", Screen.Templates) }
                )

                SidebarNavItem(
                    title = "Academy",
                    icon = Icons.Default.Info,
                    isActive = activeScreen == Screen.Academy,
                    onClick = { onScreenSelected(Screen.Academy) }
                )

                SidebarNavItem(
                    title = "Favoritos",
                    icon = Icons.Default.Star,
                    isActive = false,
                    onClick = { /* Simulated navigation */ }
                )

                SidebarNavItem(
                    title = "Novidades",
                    icon = Icons.Default.Notifications,
                    isActive = false,
                    onClick = { /* Simulated navigation */ }
                )

                Spacer(modifier = Modifier.height(16.dp))

                // WORKSPACE Section
                Text(
                    "WORKSPACE",
                    color = TextSecondary,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)
                )

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 4.dp, vertical = 4.dp),
                    shape = RoundedCornerShape(8.dp),
                    colors = CardDefaults.cardColors(containerColor = CardDark),
                    border = BorderStroke(1.dp, BorderDark)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(Color(0xFF1E293B)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.AccountBox, "WS", tint = TextSecondary, modifier = Modifier.size(14.dp))
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    "Meu Workspace",
                                    color = TextPrimary,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    "Plano Pro",
                                    color = Color(0xFF8B5CF6),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                        Icon(
                            Icons.Default.KeyboardArrowDown,
                            contentDescription = "Dropdown",
                            tint = TextSecondary,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Upgrade Banner Card
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 4.dp, vertical = 4.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF131A24)),
                    border = BorderStroke(1.dp, Color(0xFF2E3A4E))
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.Star,
                                contentDescription = "Star",
                                tint = Color(0xFFF59E0B),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                "Upgrade para Pro",
                                color = TextPrimary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            "Acesse todos os assets premium e recursos avançados.",
                            color = TextSecondary,
                            fontSize = 11.sp,
                            lineHeight = 14.sp
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Button(
                            onClick = { /* Upgrade Flow */ },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(34.dp),
                            shape = RoundedCornerShape(6.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF6D28D9)
                            ),
                            contentPadding = PaddingValues(0.dp)
                        ) {
                            Text(
                                "Fazer Upgrade",
                                color = Color.White,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }

        // Bottom profile deck
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            shape = RoundedCornerShape(10.dp),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, BorderDark)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color(0xFFEC4899)), // Pink/Avatar color from image
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "C",
                            color = Color.White,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            "Cristiane Silva",
                            color = TextPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Text(
                            "Plano Pro",
                            color = TextSecondary,
                            fontSize = 10.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
                Icon(
                    Icons.Default.MoreVert,
                    contentDescription = "Options",
                    tint = TextSecondary,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

@Composable
fun SidebarNavItem(
    title: String,
    icon: ImageVector,
    isActive: Boolean,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp)
            .height(40.dp)
            .clip(RoundedCornerShape(8.dp)),
        color = if (isActive) CardDark else Color.Transparent,
        border = if (isActive) BorderStroke(1.dp, BorderDark) else null,
        onClick = onClick
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = title,
                tint = if (isActive) ForgePrimary else TextSecondary,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                title,
                color = if (isActive) TextPrimary else TextSecondary,
                fontSize = 13.sp,
                fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Normal
            )
        }
    }
}

// ==========================================
// COMPONENT: Top bar with interactive tools
// ==========================================
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ForgeHubTopBar(
    workspaceName: String,
    searchQuery: String,
    onSearchQueryChange: (String) -> Unit,
    onMenuToggle: () -> Unit,
    notificationsCount: Int,
    onNotificationsClick: () -> Unit,
    onWorkspaceClick: () -> Unit,
    onProfileClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .height(64.dp)
            .drawBehind {
                val strokeWidth = 1.dp.toPx()
                drawLine(
                    color = Color(0xFF2E3A4E),
                    start = Offset(0f, size.height - strokeWidth / 2),
                    end = Offset(size.width, size.height - strokeWidth / 2),
                    strokeWidth = strokeWidth
                )
            },
        color = SurfaceDark
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Search input box matching mockup (with leading search and trailing shortcut)
            OutlinedTextField(
                value = searchQuery,
                onValueChange = onSearchQueryChange,
                placeholder = { Text("Buscar assets, skills, agentes e muito mais...", color = TextSecondary, fontSize = 13.sp) },
                leadingIcon = { Icon(Icons.Default.Search, "Search", tint = TextSecondary, modifier = Modifier.size(16.dp)) },
                trailingIcon = { 
                    Box(
                        modifier = Modifier
                            .padding(end = 8.dp)
                            .clip(RoundedCornerShape(4.dp))
                            .background(Color(0xFF1E293B))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text("⌘K", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                },
                modifier = Modifier
                    .width(420.dp)
                    .height(44.dp)
                    .testTag("global_search_input"),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = BackgroundDark,
                    unfocusedContainerColor = BackgroundDark,
                    focusedBorderColor = ForgePrimary,
                    unfocusedBorderColor = Color(0xFF2E3A4E),
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
            )

            // Utilities area (Notifications + Help + Dark mode + Workspace selector + Profile)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Notifications with live badge
                Box(modifier = Modifier.wrapContentSize()) {
                    IconButton(
                        onClick = onNotificationsClick,
                        modifier = Modifier.size(36.dp).testTag("notification_bell_btn")
                    ) {
                        Icon(Icons.Default.Notifications, "Notifications", tint = TextSecondary, modifier = Modifier.size(20.dp))
                    }
                    Box(
                        modifier = Modifier
                            .size(16.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF2563EB)) // Blue badge in mockup
                            .align(Alignment.TopEnd)
                            .offset(x = (-2).dp, y = (2).dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "6", // Badge count in mockup
                            color = Color.White,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Help (?) Button
                IconButton(onClick = {}, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.Info, "Help", tint = TextSecondary, modifier = Modifier.size(20.dp))
                }

                // Dark mode toggle icon (Moon)
                IconButton(onClick = {}, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.Star, "Theme Theme", tint = TextSecondary, modifier = Modifier.size(20.dp))
                }

                Spacer(modifier = Modifier.width(4.dp))

                // Workspace Selector button
                Surface(
                    onClick = onWorkspaceClick,
                    shape = RoundedCornerShape(8.dp),
                    color = CardDark,
                    border = BorderStroke(1.dp, BorderDark),
                    modifier = Modifier.height(36.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .clip(RoundedCornerShape(4.dp))
                                .background(Color(0xFF1E293B)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.AccountBox, "WS", tint = TextSecondary, modifier = Modifier.size(10.dp))
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            workspaceName,
                            color = TextPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(Icons.Default.ArrowDropDown, "Select", tint = TextSecondary, modifier = Modifier.size(16.dp))
                    }
                }

                // Profile trigger (with avatar photo simulation)
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFEC4899))
                        .clickable { onProfileClick() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        "C",
                        color = Color.White,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

// ==========================================
// SCREEN: Dashboard
// ==========================================
@Composable
fun DashboardScreen(
    viewModel: ForgeHubViewModel,
    assets: List<AssetEntity>,
    activities: List<ActivityEntity>,
    onSelectAsset: (String) -> Unit,
    onCustomizeAsset: (String) -> Unit
) {
    val searchVal by viewModel.searchQuery.collectAsState()
    
    // Filter list based on search bar queries
    val filteredAssets = remember(assets, searchVal) {
        if (searchVal.isEmpty()) assets else {
            assets.filter {
                it.title.contains(searchVal, ignoreCase = true) ||
                        it.description.contains(searchVal, ignoreCase = true) ||
                        it.category.contains(searchVal, ignoreCase = true)
            }
        }
    }

    Row(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(20.dp),
        horizontalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // COLUMN 1: CENTER CONTENT (Takes remaining space)
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight(),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Greetings Title Header (not in a card, directly as mockup)
            item {
                Column {
                    Text(
                        "Bom dia, Cristiane! 👋",
                        color = TextPrimary,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "Pronta para construir algo incrível hoje?",
                        color = TextSecondary,
                        fontSize = 14.sp
                    )
                }
            }

            // Stats row with sparklines
            item {
                PlatformStatsRow(assets)
            }

            // Acesso Rápido
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        "Acesso rápido",
                        color = TextPrimary,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        QuickAccessCard("Devocional IA", "MicroApp", Color(0xFF8B5CF6), modifier = Modifier.weight(1f))
                        QuickAccessCard("AI Agent Builder", "MicroApp", Color(0xFF3B82F6), modifier = Modifier.weight(1f))
                        QuickAccessCard("Skill Builder", "MicroApp", Color(0xFF10B981), modifier = Modifier.weight(1f))
                        QuickAccessCard("Offer Builder", "MicroApp", Color(0xFFF59E0B), modifier = Modifier.weight(1f))
                        QuickAccessCard("Landing Builder", "MicroApp", Color(0xFFEC4899), modifier = Modifier.weight(1f))
                        
                        // Novo Remix
                        Card(
                            modifier = Modifier
                                .weight(1f)
                                .height(96.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.Transparent),
                            border = BorderStroke(1.dp, Color(0xFF2E3A4E))
                        ) {
                            Column(
                                modifier = Modifier.fillMaxSize(),
                                verticalArrangement = Arrangement.Center,
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(Icons.Default.Add, "Novo Remix", tint = TextSecondary, modifier = Modifier.size(24.dp))
                                Spacer(modifier = Modifier.height(6.dp))
                                Text("Novo Remix", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // Meus Assets Grid Title & Filters
            item {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "Meus Assets",
                            color = TextPrimary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            "Ver todos",
                            color = Color(0xFF3B82F6),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.clickable { /* Action simulated */ }
                        )
                    }
                    
                    // Filter pills
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        val filters = listOf("Todos", "Recentes", "Favoritos", "Remixados")
                        var selectedFilter by remember { mutableStateOf("Todos") }
                        filters.forEach { filter ->
                            val isSelected = filter == selectedFilter
                            Surface(
                                onClick = { selectedFilter = filter },
                                shape = RoundedCornerShape(20.dp),
                                color = if (isSelected) Color(0xFF2563EB) else Color(0xFF1E293B),
                                border = if (isSelected) null else BorderStroke(1.dp, BorderDark),
                                modifier = Modifier.padding(vertical = 4.dp)
                            ) {
                                Text(
                                    filter,
                                    color = if (isSelected) Color.White else TextSecondary,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Grid of 8 items matching the mock image exactly
            item {
                Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp), modifier = Modifier.fillMaxWidth()) {
                        MockAssetGridCard("Devocional IA", "Crie devocionais diários personalizados com IA.", "5.0", "Editado há 2h", Color(0xFF8B5CF6), Icons.Default.Star, modifier = Modifier.weight(1f))
                        MockAssetGridCard("AI Agent Builder", "Crie agentes inteligentes para qualquer finalidade.", "4.9", "Editado ontem", Color(0xFF3B82F6), Icons.Default.Person, modifier = Modifier.weight(1f))
                        MockAssetGridCard("Skill Builder", "Transforme conhecimento em skills poderosas.", "4.8", "Editado há 1 dia", Color(0xFF10B981), Icons.Default.Refresh, modifier = Modifier.weight(1f))
                        MockAssetGridCard("Offer Builder", "Crie ofertas irresistíveis que vendem todos os dias.", "4.9", "Editado há 3 dias", Color(0xFFF59E0B), Icons.Default.ThumbUp, modifier = Modifier.weight(1f))
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp), modifier = Modifier.fillMaxWidth()) {
                        MockAssetGridCard("Landing Builder", "Páginas de alta conversão em minutos.", "4.8", "Editado há 3 dias", Color(0xFFEC4899), Icons.Default.PlayArrow, modifier = Modifier.weight(1f))
                        MockAssetGridCard("TikTok Studio", "Crie roteiros e ideias virais para TikTok.", "4.7", "Editado há 3 dias", Color(0xFFF43F5E), Icons.Default.Phone, modifier = Modifier.weight(1f))
                        MockAssetGridCard("Planner Financeiro", "Organize suas finanças e tome decisões melhores.", "4.6", "Editado há 5 dias", Color(0xFF06B6D4), Icons.Default.Settings, modifier = Modifier.weight(1f))
                        MockAssetGridCard("CRM Pro", "Gerencie clientes e vendas com facilidade.", "4.8", "Editado há 5 dias", Color(0xFFD97706), Icons.Default.ShoppingCart, modifier = Modifier.weight(1f))
                    }
                }
            }

            // Big Banner "Crie. Personalize. Lance."
            item {
                CriePersonalizeBanner()
            }
        }

        // COLUMN 2: RIGHT PANEL (Fixed 320.dp width)
        Column(
            modifier = Modifier
                .width(320.dp)
                .fillMaxHeight()
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Widget 1: Assets Favoritos
            AssetsFavoritosWidget()

            // Widget 2: Atividade recente
            AtividadeRecenteWidget()

            // Widget 3: Estatísticas
            EstatisticasWidget()

            // Widget 4: Categorias populares
            CategoriasPopularesWidget()
        }
    }
}

@Composable
fun PlatformStatsRow(assets: List<AssetEntity>) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        SparklineStatCard(
            title = "Assets Totais",
            value = "24",
            trendText = "+12 este mês",
            lineColor = Color(0xFF3B82F6),
            modifier = Modifier.weight(1f)
        )
        SparklineStatCard(
            title = "Assets Publicados",
            value = "8",
            trendText = "+4 este mês",
            lineColor = Color(0xFF10B981),
            modifier = Modifier.weight(1f)
        )
        SparklineStatCard(
            title = "Horas Economizadas",
            value = "36h",
            trendText = "+8 este mês",
            lineColor = Color(0xFF3B82F6),
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
fun SparklineStatCard(
    title: String,
    value: String,
    trendText: String,
    lineColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.height(100.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(verticalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxHeight()) {
                Text(title, color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Text(value, color = TextPrimary, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Text(trendText, color = if (lineColor == Color(0xFF10B981)) ForgeSuccess else Color(0xFF3B82F6), fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
            }
            
            // Sparkline Line Chart
            Canvas(
                modifier = Modifier
                    .width(80.dp)
                    .height(40.dp)
            ) {
                val width = size.width
                val height = size.height
                val points = when (title) {
                    "Assets Totais" -> listOf(0.1f, 0.2f, 0.15f, 0.4f, 0.35f, 0.7f, 0.6f, 0.9f)
                    "Assets Publicados" -> listOf(0.2f, 0.1f, 0.3f, 0.25f, 0.5f, 0.45f, 0.8f, 0.75f)
                    else -> listOf(0.05f, 0.3f, 0.2f, 0.5f, 0.4f, 0.65f, 0.55f, 0.85f)
                }
                
                val path = androidx.compose.ui.graphics.Path()
                points.forEachIndexed { index, value ->
                    val x = index * (width / (points.size - 1))
                    val y = height - (value * height)
                    if (index == 0) {
                        path.moveTo(x, y)
                    } else {
                        path.lineTo(x, y)
                    }
                }
                
                drawPath(
                    path = path,
                    color = lineColor,
                    style = androidx.compose.ui.graphics.drawscope.Stroke(
                        width = 2.dp.toPx(),
                        cap = androidx.compose.ui.graphics.StrokeCap.Round
                    )
                )
            }
        }
    }
}

@Composable
fun QuickAccessCard(
    title: String,
    category: String,
    iconColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.height(96.dp),
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(iconColor),
                contentAlignment = Alignment.Center
            ) {
                val iconVec = when (title) {
                    "Devocional IA" -> Icons.Default.Star
                    "AI Agent Builder" -> Icons.Default.Person
                    "Skill Builder" -> Icons.Default.Refresh
                    "Offer Builder" -> Icons.Default.ThumbUp
                    else -> Icons.Default.PlayArrow
                }
                Icon(iconVec, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(title, color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text(category, color = TextSecondary, fontSize = 9.sp)
            }
        }
    }
}

@Composable
fun MockAssetGridCard(
    title: String,
    description: String,
    rating: String,
    editedText: String,
    bannerColor: Color,
    icon: ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.height(210.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Visual Banner Area with Icon
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(72.dp)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(bannerColor.copy(alpha = 0.3f), bannerColor.copy(alpha = 0.05f))
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(bannerColor),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                }
            }
            
            // Content Area
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(12.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            title,
                            color = TextPrimary,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.weight(1f)
                        )
                        Icon(
                            Icons.Default.MoreVert,
                            contentDescription = "Options",
                            tint = TextSecondary,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                    Text(
                        "MicroApp",
                        color = TextSecondary,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        description,
                        color = TextSecondary,
                        fontSize = 11.sp,
                        lineHeight = 14.sp,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.Star,
                            contentDescription = "Rating",
                            tint = Color(0xFFF59E0B),
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(rating, color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    Text(editedText, color = TextSecondary, fontSize = 10.sp)
                }
            }
        }
    }
}

@Composable
fun CriePersonalizeBanner() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                // Glowing 3D Cube Icon
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(Color(0xFF3B82F6), Color(0xFF8B5CF6))
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Build,
                        contentDescription = "Cube",
                        tint = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                }
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        "Crie. Personalize. Lance.",
                        color = TextPrimary,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "Remixe qualquer asset, personalize do seu jeito e lance seu projeto em minutos.",
                        color = TextSecondary,
                        fontSize = 12.sp,
                        lineHeight = 16.sp
                    )
                }
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = {},
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text("Explorar Assets", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
                
                Button(
                    onClick = {},
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, BorderDark),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text("Ver Tutorial", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun AssetsFavoritosWidget() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Assets Favoritos", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Text("Ver todos", color = Color(0xFF3B82F6), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable {})
            }
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "7",
                    color = TextPrimary,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.width(16.dp))
                Button(
                    onClick = {},
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    border = BorderStroke(1.dp, Color(0xFF8B5CF6)),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                    modifier = Modifier.height(32.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Star, null, tint = Color(0xFF8B5CF6), modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Ver favoritos", color = Color(0xFF8B5CF6), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun AtividadeRecenteWidget() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Atividade recente", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Text("Ver tudo", color = Color(0xFF3B82F6), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable {})
            }
            Spacer(modifier = Modifier.height(12.dp))
            
            val items = listOf(
                RecentActData("Devocional IA foi remixado", "Há 2 horas", Color(0xFF8B5CF6), Icons.Default.Refresh),
                RecentActData("Novo asset: TikTok Studio", "Há 5 horas", Color(0xFFEC4899), Icons.Default.PlayArrow),
                RecentActData("AI Agent Builder atualizado", "Há 1 dia", Color(0xFF3B82F6), Icons.Default.Person),
                RecentActData("Novo template de página", "Há 2 dias", Color(0xFF8B5CF6), Icons.Default.List),
                RecentActData("Skill Copy Expert adicionado", "Há 3 dias", Color(0xFF10B981), Icons.Default.Build)
            )
            
            items.forEachIndexed { index, act ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(act.color.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(act.icon, null, tint = act.color, modifier = Modifier.size(12.dp))
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(act.title, color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        Text(act.time, color = TextSecondary, fontSize = 9.sp)
                    }
                }
                if (index < items.size - 1) {
                    HorizontalDivider(color = Color(0xFF1E293B))
                }
            }
        }
    }
}

data class RecentActData(val title: String, val time: String, val color: Color, val icon: ImageVector)

@Composable
fun EstatisticasWidget() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Estatísticas", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("7 dias", color = TextSecondary, fontSize = 11.sp)
                    Icon(Icons.Default.KeyboardArrowDown, null, tint = TextSecondary, modifier = Modifier.size(14.dp))
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Donut Chart Canvas
                Box(
                    modifier = Modifier.size(90.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val strokeWidth = 10.dp.toPx()
                        drawArc(
                            color = Color(0xFF3B82F6),
                            startAngle = -90f,
                            sweepAngle = 187.2f,
                            useCenter = false,
                            style = androidx.compose.ui.graphics.drawscope.Stroke(strokeWidth)
                        )
                        drawArc(
                            color = Color(0xFF10B981),
                            startAngle = 97.2f,
                            sweepAngle = 72f,
                            useCenter = false,
                            style = androidx.compose.ui.graphics.drawscope.Stroke(strokeWidth)
                        )
                        drawArc(
                            color = Color(0xFF8B5CF6),
                            startAngle = 169.2f,
                            sweepAngle = 64.8f,
                            useCenter = false,
                            style = androidx.compose.ui.graphics.drawscope.Stroke(strokeWidth)
                        )
                        drawArc(
                            color = Color(0xFF64748B),
                            startAngle = 234f,
                            sweepAngle = 36f,
                            useCenter = false,
                            style = androidx.compose.ui.graphics.drawscope.Stroke(strokeWidth)
                        )
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("72%", color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        Text("Produtividade", color = TextSecondary, fontSize = 8.sp, textAlign = TextAlign.Center)
                    }
                }
                
                Spacer(modifier = Modifier.width(16.dp))
                
                // Legend
                Column(verticalArrangement = Arrangement.spacedBy(4.dp), modifier = Modifier.weight(1f)) {
                    LegendItem("Criação", "52%", Color(0xFF3B82F6))
                    LegendItem("Edição", "20%", Color(0xFF10B981))
                    LegendItem("Aprendizado", "18%", Color(0xFF8B5CF6))
                    LegendItem("Outros", "10%", Color(0xFF64748B))
                }
            }
        }
    }
}

@Composable
fun LegendItem(label: String, percentage: String, color: Color) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .clip(CircleShape)
                    .background(color)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(label, color = TextSecondary, fontSize = 10.sp)
        }
        Text(percentage, color = TextPrimary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun CategoriasPopularesWidget() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Categorias populares", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Text("Ver todas", color = Color(0xFF3B82F6), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable {})
            }
            Spacer(modifier = Modifier.height(12.dp))
            
            val categories = listOf(
                CategoryPopData("IA", 12, Icons.Default.Star),
                CategoryPopData("Marketing", 8, Icons.Default.Share),
                CategoryPopData("Negócios", 7, Icons.Default.AccountBox),
                CategoryPopData("Redes Sociais", 6, Icons.Default.PlayArrow),
                CategoryPopData("Finanças", 5, Icons.Default.List),
                CategoryPopData("Educação", 4, Icons.Default.Info),
                CategoryPopData("Fé", 3, Icons.Default.Favorite)
            )
            
            categories.forEach { cat ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(cat.icon, null, tint = TextSecondary, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(cat.name, color = TextSecondary, fontSize = 11.sp)
                    }
                    Text(cat.count.toString(), color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

data class CategoryPopData(val name: String, val count: Int, val icon: ImageVector)

@Composable
fun StatCard(
    title: String,
    value: String,
    percentage: String,
    isSuccess: Boolean,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = CardDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(title, color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text(value, color = TextPrimary, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                percentage,
                color = if (isSuccess) ForgeSuccess else ForgeSecondary,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
fun ContinueWorkingCard(
    asset: AssetEntity,
    onOpen: () -> Unit,
    onEdit: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(260.dp)
            .clickable { onOpen() },
        colors = CardDefaults.cardColors(containerColor = CardDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(ForgePrimary.copy(alpha = 0.15f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        asset.category.uppercase(),
                        color = ForgeSecondary,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Text(asset.version, color = TextSecondary, fontSize = 11.sp)
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                asset.title,
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                asset.description,
                color = TextSecondary,
                fontSize = 12.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 16.sp
            )
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = onEdit,
                    modifier = Modifier
                        .weight(1f)
                        .height(32.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SurfaceDark),
                    contentPadding = PaddingValues(0.dp),
                    shape = RoundedCornerShape(6.dp),
                    border = BorderStroke(1.dp, BorderDark)
                ) {
                    Icon(Icons.Default.Edit, "Edit", tint = TextPrimary, modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Editar", color = TextPrimary, fontSize = 11.sp)
                }
                Button(
                    onClick = onOpen,
                    modifier = Modifier
                        .weight(1f)
                        .height(32.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = ForgePrimary),
                    contentPadding = PaddingValues(0.dp),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text("Abrir", color = Color.White, fontSize = 11.sp)
                }
            }
        }
    }
}

@Composable
fun ActivityLogItem(activity: ActivityEntity) {
    val actionColor = when (activity.actionType) {
        "REMIX" -> ForgeSecondary
        "DEPLOY" -> ForgeSuccess
        "FAVORITE" -> ForgeWarning
        "DOWNLOAD" -> ForgePrimary
        else -> TextSecondary
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = CardDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(actionColor.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    val icon = when (activity.actionType) {
                        "REMIX" -> Icons.Default.Refresh
                        "DEPLOY" -> Icons.Default.Share
                        "FAVORITE" -> Icons.Default.Star
                        "DOWNLOAD" -> Icons.Default.Add
                        else -> Icons.Default.Info
                    }
                    Icon(icon, activity.actionType, tint = actionColor, modifier = Modifier.size(16.dp))
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = when (activity.actionType) {
                            "REMIX" -> "Remix de prompt efetuado"
                            "DEPLOY" -> "Publicado em produção (Vercel Edge)"
                            "FAVORITE" -> "Marcado como Favorito"
                            "DOWNLOAD" -> "Exportado para Workspace local"
                            else -> "Atividade registrada"
                        },
                        color = TextPrimary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        activity.assetTitle,
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                }
            }
            Text(
                "Agora",
                color = TextSecondary,
                fontSize = 11.sp
            )
        }
    }
}

@Composable
fun SectionHeader(title: String) {
    Text(
        title,
        color = TextPrimary,
        fontWeight = FontWeight.Bold,
        fontSize = 15.sp,
        modifier = Modifier.padding(vertical = 4.dp)
    )
}

// ==========================================
// SCREEN: Biblioteca (Favorites & Downloads)
// ==========================================
@Composable
fun BibliotecaScreen(
    viewModel: ForgeHubViewModel,
    assets: List<AssetEntity>,
    onSelectAsset: (String) -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) } // 0: Favoritos, 1: Downloads, 2: Meus Remixes
    val searchVal by viewModel.searchQuery.collectAsState()

    val filteredAssets = remember(assets, selectedTab, searchVal) {
        assets.filter {
            val matchesSearch = it.title.contains(searchVal, ignoreCase = true) ||
                    it.description.contains(searchVal, ignoreCase = true)
            val matchesTab = when (selectedTab) {
                0 -> it.isFavorite
                1 -> it.isDownloaded
                else -> it.isCustom
            }
            matchesSearch && matchesTab
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Biblioteca", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        Text("Coleção privada de assets salvos, baixados ou personalizados por você.", color = TextSecondary, fontSize = 12.sp)

        Spacer(modifier = Modifier.height(16.dp))

        // Custom minimalist navigation bar tabs (Linear style)
        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = SurfaceDark,
            contentColor = ForgePrimary,
            divider = { Divider(color = DividerDark) }
        ) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("Favoritos", fontSize = 13.sp, fontWeight = FontWeight.Bold) }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("Downloads", fontSize = 13.sp, fontWeight = FontWeight.Bold) }
            )
            Tab(
                selected = selectedTab == 2,
                onClick = { selectedTab = 2 },
                text = { Text("Criados por mim", fontSize = 13.sp, fontWeight = FontWeight.Bold) }
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (filteredAssets.isEmpty()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.List,
                        contentDescription = "Empty collection",
                        tint = TextSecondary,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Nenhum item nesta pasta.", color = TextPrimary, fontWeight = FontWeight.Bold)
                    Text("Utilize o menu lateral ou pesquise para catalogar novos itens.", color = TextSecondary, fontSize = 12.sp)
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Adaptive(minSize = 250.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(filteredAssets) { asset ->
                    AssetGridCard(
                        asset = asset,
                        onSelect = { onSelectAsset(asset.id) },
                        onFavoriteToggle = { viewModel.toggleFavorite(asset.id) }
                    )
                }
            }
        }
    }
}

// ==========================================
// COMPONENT: Individual Asset Grid Card
// ==========================================
@Composable
fun AssetGridCard(
    asset: AssetEntity,
    onSelect: () -> Unit,
    onFavoriteToggle: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onSelect() }
            .testTag("asset_grid_card_${asset.id}"),
        colors = CardDefaults.cardColors(containerColor = CardDark),
        border = BorderStroke(1.dp, BorderDark)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(ForgePrimary.copy(alpha = 0.15f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        asset.category.uppercase(),
                        color = ForgeSecondary,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                IconButton(
                    onClick = onFavoriteToggle,
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        Icons.Default.Star,
                        contentDescription = "Favorite",
                        tint = if (asset.isFavorite) ForgeWarning else TextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                asset.title,
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                asset.description,
                color = TextSecondary,
                fontSize = 12.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 16.sp
            )
            Spacer(modifier = Modifier.height(12.dp))
            Divider(color = DividerDark)
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Star, "Rating", tint = ForgeWarning, modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(asset.rating.toString(), color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("${asset.downloadsCount} downloads", color = TextSecondary, fontSize = 11.sp)
                }
                if (asset.isDeployReady) {
                    Box(
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(ForgeSuccess.copy(alpha = 0.15f))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text("Deploy Ready", color = ForgeSuccess, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

// ==========================================
// SCREEN: Explore Catalog screen
// ==========================================
@Composable
fun ExploreCatalogScreen(
    viewModel: ForgeHubViewModel,
    assets: List<AssetEntity>,
    onSelectAsset: (String) -> Unit
) {
    val category by viewModel.activeCategory.collectAsState()
    val searchVal by viewModel.searchQuery.collectAsState()

    val filtered = remember(assets, category, searchVal) {
        assets.filter {
            val matchesCategory = category == "Todos" || it.category.equals(category, ignoreCase = true)
            val matchesSearch = it.title.contains(searchVal, ignoreCase = true) ||
                    it.description.contains(searchVal, ignoreCase = true)
            matchesCategory && matchesSearch
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Explorar $category",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    "Selecione um ativo inteligente pronto para remixagem e deploy instantâneo.",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            }
            Surface(
                color = CardDark,
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, BorderDark),
                modifier = Modifier.padding(4.dp)
            ) {
                Text(
                    "${filtered.size} ativos encontrados",
                    color = TextPrimary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (filtered.isEmpty()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text("Nenhum ativo corresponde aos critérios de pesquisa.", color = TextSecondary, fontSize = 13.sp)
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Adaptive(minSize = 250.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(filtered) { asset ->
                    AssetGridCard(
                        asset = asset,
                        onSelect = { onSelectAsset(asset.id) },
                        onFavoriteToggle = { viewModel.toggleFavorite(asset.id) }
                    )
                }
            }
        }
    }
}

// ==========================================
// SCREEN: Asset detailed specifications
// ==========================================
@Composable
fun AssetDetailScreen(
    assetId: String,
    viewModel: ForgeHubViewModel,
    onBack: () -> Unit,
    onOpenCustomize: () -> Unit
) {
    val assets by viewModel.allAssets.collectAsState()
    val asset = remember(assets, assetId) { assets.firstOrNull { it.id == assetId } }

    if (asset == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = ForgePrimary)
        }
        return
    }

    var selectedSectionTab by remember { mutableStateOf(0) } // 0: Documentação, 1: Tutorial, 2: Prompt Original

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Back Navigation
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary)
            }
            Text("Explorar Ativos", color = TextSecondary, fontSize = 13.sp)
            Text(" / ", color = BorderDark, fontSize = 13.sp)
            Text(asset.title, color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
        }

        // Hero Header Panel
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, BorderDark)
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(ForgePrimary.copy(alpha = 0.2f))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            asset.category.uppercase(),
                            color = ForgeSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Text("Versão ${asset.version}", color = TextSecondary, fontSize = 12.sp)
                }
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    asset.title,
                    color = TextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    asset.description,
                    color = TextSecondary,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Spacer(modifier = Modifier.height(16.dp))
                Divider(color = DividerDark)
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        DetailChip(label = "Tempo: ${asset.timeToCustomize}")
                        DetailChip(label = "Dificuldade: ${asset.level}")
                        DetailChip(label = "Compatibilidade: ${asset.compatibility}")
                    }
                    IconButton(onClick = { viewModel.toggleFavorite(asset.id) }) {
                        Icon(
                            Icons.Default.Star,
                            "Favorite Detail",
                            tint = if (asset.isFavorite) ForgeWarning else TextSecondary
                        )
                    }
                }
            }
        }

        // Action Deck buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Button(
                onClick = {
                    viewModel.downloadAsset(asset.id)
                },
                colors = ButtonDefaults.buttonColors(containerColor = SurfaceDark),
                border = BorderStroke(1.dp, BorderDark),
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.Add, "Download", tint = TextPrimary)
                Spacer(modifier = Modifier.width(8.dp))
                Text(if (asset.isDownloaded) "Adicionado local" else "Download Asset", color = TextPrimary, fontSize = 13.sp)
            }
            Button(
                onClick = onOpenCustomize,
                colors = ButtonDefaults.buttonColors(containerColor = ForgePrimary),
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp)
                    .testTag("remix_asset_detail_button"),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.Refresh, "Remix", tint = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Remix Prompt (IA)", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Sub-tabs (Docs, Tutorial, Master Prompt)
        TabRow(
            selectedTabIndex = selectedSectionTab,
            containerColor = SurfaceDark,
            contentColor = ForgePrimary,
            divider = { Divider(color = DividerDark) }
        ) {
            Tab(
                selected = selectedSectionTab == 0,
                onClick = { selectedSectionTab = 0 },
                text = { Text("Documentação", fontSize = 13.sp) }
            )
            Tab(
                selected = selectedSectionTab == 1,
                onClick = { selectedSectionTab = 1 },
                text = { Text("Tutorial", fontSize = 13.sp) }
            )
            Tab(
                selected = selectedSectionTab == 2,
                onClick = { selectedSectionTab = 2 },
                text = { Text("Prompt Mestre", fontSize = 13.sp) }
            )
        }

        // Render selected section
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, BorderDark)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                when (selectedSectionTab) {
                    0 -> {
                        Text("Configuração de API", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            asset.documentation,
                            color = TextSecondary,
                            fontSize = 13.sp,
                            lineHeight = 18.sp
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text("Habilidades inclusas", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(DividerDark)
                                .padding(8.dp)
                        ) {
                            Text(asset.skillIncluded, color = ForgeSecondary, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                        }
                    }
                    1 -> {
                        Text("Como customizar e subir", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            asset.tutorial,
                            color = TextSecondary,
                            fontSize = 13.sp,
                            lineHeight = 18.sp
                        )
                    }
                    2 -> {
                        Text("Código de Orquestração de Prompt", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(BackgroundDark)
                                .border(1.dp, BorderDark)
                                .padding(12.dp)
                        ) {
                            Text(
                                asset.masterPrompt,
                                color = ForgeSecondary,
                                fontFamily = FontFamily.Monospace,
                                fontSize = 12.sp,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DetailChip(label: String) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(SurfaceDark)
            .border(1.dp, BorderDark)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(label, color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium)
    }
}

// ==========================================
// SCREEN: Interactive Prompt Editor & Remix Engine
// ==========================================
@Composable
fun AssetEditorScreen(
    assetId: String,
    viewModel: ForgeHubViewModel,
    onBack: () -> Unit
) {
    val assets by viewModel.allAssets.collectAsState()
    val asset = remember(assets, assetId) { assets.firstOrNull { it.id == assetId } }

    if (asset == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }

    var editablePrompt by remember { mutableStateOf(asset.masterPrompt) }
    var remixInstructions by remember { mutableStateOf("") }
    
    val isRemixing by viewModel.isRemixing.collectAsState()
    val isDeploying by viewModel.isDeploying.collectAsState()

    // Real-time terminal outputs for deployment logging
    var terminalLogs by remember { mutableStateOf<List<String>>(emptyList()) }
    val coroutineScope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Back
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary)
            }
            Text("Editor de Ativos", color = TextSecondary, fontSize = 13.sp)
            Text(" / ", color = BorderDark, fontSize = 13.sp)
            Text(asset.title, color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
        }

        // Section: Live Remix
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, BorderDark)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    "Remix Assistido por IA (Gemini 3.5-Flash)",
                    color = TextPrimary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Text(
                    "Digite instruções em linguagem natural. A inteligência artificial irá otimizar e fundir o Prompt Mestre gerando uma nova versão compilável.",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = remixInstructions,
                    onValueChange = { remixInstructions = it },
                    placeholder = { Text("ex: Traduza as saídas para português de Portugal e adicione regras de compliance LGPD", color = TextSecondary, fontSize = 12.sp) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp)
                        .testTag("ai_remix_input"),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = BackgroundDark,
                        unfocusedContainerColor = BackgroundDark,
                        focusedBorderColor = ForgePrimary,
                        unfocusedBorderColor = Color(0xFF2E3A4E),
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    ),
                    shape = RoundedCornerShape(8.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = {
                        if (remixInstructions.isNotBlank()) {
                            viewModel.remixAsset(asset.id, remixInstructions) { remixedId ->
                                viewModel.selectAsset(remixedId)
                                onBack()
                            }
                        }
                    },
                    enabled = remixInstructions.isNotBlank() && !isRemixing,
                    colors = ButtonDefaults.buttonColors(containerColor = ForgeSecondary),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .testTag("trigger_remix_button"),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    if (isRemixing) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Reescrevendo Prompt no Edge...", color = Color.White)
                    } else {
                        Icon(Icons.Default.Refresh, "Remix", tint = Color.Black)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Executar Remix Inteligente", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Section: Prompt code block
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, BorderDark)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "Prompt Mestre de Orquestração",
                        color = TextPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                    TextButton(onClick = { viewModel.updateMasterPrompt(asset.id, editablePrompt) }) {
                        Text("Salvar Código", color = ForgePrimary, fontSize = 12.sp)
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = editablePrompt,
                    onValueChange = { editablePrompt = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .testTag("prompt_code_field"),
                    textStyle = androidx.compose.ui.text.TextStyle(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = BackgroundDark,
                        unfocusedContainerColor = BackgroundDark,
                        focusedBorderColor = ForgePrimary,
                        unfocusedBorderColor = Color(0xFF2E3A4E),
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )
            }
        }

        // Section: Instant Deploy to edge (Linear / Lovable console style)
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, BorderDark)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    "Deploy de Alta Velocidade",
                    color = TextPrimary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Text(
                    "Configure deploys de produção globais em servidores Edge. Sem provisionamento de máquinas ou contêineres de segundo plano.",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = {
                        coroutineScope.launch {
                            terminalLogs = emptyList()
                            viewModel.deployAsset(asset.id)
                            terminalLogs = listOf(
                                "⚡ ForgeHub Edge Build v1.4",
                                "⚙️ Compilando Prompt Mestre...",
                                "📦 Agrupando módulos e verificando dependências...",
                                "🛡️ Verificando segurança e políticas anti-prompt injection...",
                                "🚀 Enviando imagem binária para 42 servidores edge globais...",
                                "✅ Deploy Concluído: Ativo online na URL global!"
                            )
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ForgePrimary),
                    enabled = !isDeploying,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .testTag("deploy_asset_button"),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    if (isDeploying) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Alocando Cluster Edge...", color = Color.White)
                    } else {
                        Icon(Icons.Default.Share, "Deploy", tint = Color.White)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Implantar em Produção", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }

                if (terminalLogs.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color.Black)
                            .border(1.dp, BorderDark)
                            .padding(12.dp)
                    ) {
                        Column {
                            terminalLogs.forEach { log ->
                                Text(
                                    log,
                                    color = if (log.startsWith("✅")) ForgeSuccess else ForgeSecondary,
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 11.sp,
                                    modifier = Modifier.padding(vertical = 2.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// SCREEN: Academy Panel
// ==========================================
@Composable
fun AcademyScreen() {
    val tutorials = listOf(
        Pair("Dominando Few-Shot Prompting", "Aprenda a fornecer exemplos estruturados de entradas e saídas no prompt para instruir modelos complexos a retornar saídas confiáveis e com regras específicas."),
        Pair("Orquestração de Agentes Corporativos", "Descubra como construir agentes autônomos que realizam chain-of-thought avançados conectando ferramentas externas via chamadas de funções."),
        Pair("Anti-Prompt Injection Avançado", "Como proteger seus ativos digitais e segredos de prompt contra tentativas fraudulentas de usuários que manipulam os chats do chatbot."),
        Pair("Formatação JSON Rígida", "Utilize esquemas JSON de sistema para forçar os modelos LLM a entregarem objetos estruturados consistentes prontos para consumo por microsserviços.")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("ForgeHub Academy", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        Text("Aprenda a arquitetar, reescrever e vender prompts e agentes de alta performance.", color = TextSecondary, fontSize = 12.sp)

        Spacer(modifier = Modifier.height(8.dp))

        tutorials.forEach { (title, description) ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = CardDark),
                border = BorderStroke(1.dp, BorderDark)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(ForgePrimary.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Info, "Class", tint = ForgePrimary, modifier = Modifier.size(16.dp))
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(title, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        description,
                        color = TextSecondary,
                        fontSize = 13.sp,
                        lineHeight = 18.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    TextButton(
                        onClick = {},
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text("Iniciar Tutorial", color = ForgeSecondary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(Icons.Default.ArrowForward, "Start", tint = ForgeSecondary, modifier = Modifier.size(14.dp))
                    }
                }
            }
        }
    }
}

// ==========================================
// SCREEN: SaaS unified Settings Hub
// ==========================================
@Composable
fun SettingsScreen(viewModel: ForgeHubViewModel) {
    var selectedSubTab by remember { mutableStateOf(0) } // 0: Perfil, 1: Workspace, 2: Faturamento, 3: Equipe, 4: API, 5: Integrações

    val userName by viewModel.userName.collectAsState()
    val workspaceName by viewModel.workspaceName.collectAsState()
    val apiKey by viewModel.apiKeyCreated.collectAsState()

    var userNameInput by remember { mutableStateOf(userName) }
    var workspaceNameInput by remember { mutableStateOf(workspaceName) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Configurações", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        Text("Gerencie dados de perfil, faturamento, chaves secretas de API e integrações ativas.", color = TextSecondary, fontSize = 12.sp)

        // Slide tabs switcher
        ScrollableTabRow(
            selectedTabIndex = selectedSubTab,
            containerColor = SurfaceDark,
            contentColor = ForgePrimary,
            divider = { Divider(color = DividerDark) },
            edgePadding = 0.dp
        ) {
            Tab(selected = selectedSubTab == 0, onClick = { selectedSubTab = 0 }, text = { Text("Perfil", fontSize = 12.sp) })
            Tab(selected = selectedSubTab == 1, onClick = { selectedSubTab = 1 }, text = { Text("Workspace", fontSize = 12.sp) })
            Tab(selected = selectedSubTab == 2, onClick = { selectedSubTab = 2 }, text = { Text("Billing / Planos", fontSize = 12.sp) })
            Tab(selected = selectedSubTab == 3, onClick = { selectedSubTab = 3 }, text = { Text("Equipe", fontSize = 12.sp) })
            Tab(selected = selectedSubTab == 4, onClick = { selectedSubTab = 4 }, text = { Text("Chaves API", fontSize = 12.sp) })
            Tab(selected = selectedSubTab == 5, onClick = { selectedSubTab = 5 }, text = { Text("Integrações", fontSize = 12.sp) })
        }

        // Settings content cards
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, BorderDark)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                when (selectedSubTab) {
                    0 -> { // Profile
                        Text("Configurações do Perfil", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Nome de exibição", color = TextSecondary, fontSize = 12.sp)
                        OutlinedTextField(
                            value = userNameInput,
                            onValueChange = { userNameInput = it },
                            modifier = Modifier.fillMaxWidth().testTag("profile_name_input"),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = BackgroundDark,
                                unfocusedContainerColor = BackgroundDark,
                                focusedBorderColor = ForgePrimary,
                                unfocusedBorderColor = Color(0xFF2E3A4E),
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                        Button(
                            onClick = { viewModel.setUserName(userNameInput) },
                            colors = ButtonDefaults.buttonColors(containerColor = ForgePrimary),
                            modifier = Modifier.align(Alignment.End).testTag("save_profile_button"),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Salvar Perfil", color = Color.White)
                        }
                    }
                    1 -> { // Workspace
                        Text("Informações do Workspace", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Nome corporativo do espaço", color = TextSecondary, fontSize = 12.sp)
                        OutlinedTextField(
                            value = workspaceNameInput,
                            onValueChange = { workspaceNameInput = it },
                            modifier = Modifier.fillMaxWidth().testTag("workspace_name_input"),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = BackgroundDark,
                                unfocusedContainerColor = BackgroundDark,
                                focusedBorderColor = ForgePrimary,
                                unfocusedBorderColor = Color(0xFF2E3A4E),
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                        Button(
                            onClick = { viewModel.setWorkspaceName(workspaceNameInput) },
                            colors = ButtonDefaults.buttonColors(containerColor = ForgePrimary),
                            modifier = Modifier.align(Alignment.End).testTag("save_workspace_button"),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Salvar Alterações", color = Color.White)
                        }
                    }
                    2 -> { // Billing
                        Text("Faturamento & Consumo", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Seu plano atual é o ForgeHub Pro Developer, ideal para startups e criadores de agentes inteligentes.", color = TextSecondary, fontSize = 13.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                            border = BorderStroke(1.dp, BorderDark)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Consumo de Tokens IA", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                    Text("PRO ILIMITADO", color = ForgeSuccess, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                LinearProgressIndicator(
                                    progress = 0.45f,
                                    modifier = Modifier.fillMaxWidth().height(6.dp),
                                    color = ForgePrimary,
                                    trackColor = DividerDark
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("4.5M tokens usados / limite elástico no Edge", color = TextSecondary, fontSize = 11.sp)
                            }
                        }
                    }
                    3 -> { // Team
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Membros da Equipe", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Button(
                                onClick = {},
                                colors = ButtonDefaults.buttonColors(containerColor = ForgePrimary),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Icon(Icons.Default.Add, "Add Member", tint = Color.White, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Convidar", color = Color.White, fontSize = 12.sp)
                            }
                        }
                        Divider(color = DividerDark)
                        TeamMemberRow(name = "Cris Suboy", role = "Owner / Administrator", email = "cris.suboy@gmail.com")
                        TeamMemberRow(name = "Alice Silveira", role = "Software Architect", email = "alice@forgehub.ai")
                        TeamMemberRow(name = "Bob Santos", role = "Product Designer", email = "bob@forgehub.ai")
                    }
                    4 -> { // API Keys
                        Text("Tokens de Acesso à API", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Utilize chaves de API secretas para conectar seus prompts e agentes diretamente à suas aplicações web ou canais de atendimento.", color = TextSecondary, fontSize = 12.sp)
                        
                        if (apiKey != null) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(BackgroundDark)
                                    .border(1.dp, BorderDark)
                                    .padding(12.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        apiKey!!,
                                        fontFamily = FontFamily.Monospace,
                                        color = ForgeSecondary,
                                        fontSize = 12.sp
                                    )
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(ForgeSuccess.copy(alpha = 0.15f))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text("Ativo", color = ForgeSuccess, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                        
                        Button(
                            onClick = { viewModel.createApiKey() },
                            colors = ButtonDefaults.buttonColors(containerColor = ForgePrimary),
                            modifier = Modifier.fillMaxWidth().height(40.dp).testTag("generate_api_key_button"),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Criar Nova Chave Secreta", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    5 -> { // Integrations
                        Text("Integrações Corporativas", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Habilite integrações nativas de banco de dados e hospedagem em produção.", color = TextSecondary, fontSize = 12.sp)
                        Divider(color = DividerDark)
                        IntegrationToggleRow("GitHub Integration", "Sincronize alterações de prompts e versões com repositórios GitHub automaticamente.")
                        IntegrationToggleRow("Vercel Functions", "Hospede e ative endpoints Edge para seus MicroApps.")
                        IntegrationToggleRow("Supabase Database", "Sincronize schemas Postgres e visualize tabelas de forma dinâmica.")
                    }
                }
            }
        }
    }
}

@Composable
fun TeamMemberRow(name: String, role: String, email: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(name, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 13.sp)
            Text(email, color = TextSecondary, fontSize = 11.sp)
        }
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(4.dp))
                .background(DividerDark)
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            Text(role, color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun IntegrationToggleRow(title: String, description: String) {
    var isEnabled by remember { mutableStateOf(true) }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f).padding(end = 16.dp)) {
            Text(title, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 13.sp)
            Text(description, color = TextSecondary, fontSize = 11.sp, lineHeight = 14.sp)
        }
        Switch(
            checked = isEnabled,
            onCheckedChange = { isEnabled = it },
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = ForgePrimary,
                uncheckedThumbColor = TextSecondary,
                uncheckedTrackColor = DividerDark
            )
        )
    }
}
