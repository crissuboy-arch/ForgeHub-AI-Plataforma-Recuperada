package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val ForgeColorScheme = darkColorScheme(
    primary = ForgePrimary,
    secondary = ForgeSecondary,
    background = BackgroundDark,
    surface = SurfaceDark,
    surfaceVariant = CardDark,
    onPrimary = Color.White,
    onSecondary = Color.Black,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onSurfaceVariant = TextSecondary,
    error = ForgeDanger
)

@Composable
fun ForgeHubTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = ForgeColorScheme,
        typography = Typography,
        content = content
    )
}
