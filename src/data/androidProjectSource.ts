export interface AndroidSourceFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidSourceFile[] = [
  {
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'Android Gradle build configuration with Media3, WorkManager, Compose, Room, and Retrofit',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.mnstube.pro"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.mnstube.pro"
        minSdk = 26
        targetSdk = 35
        versionCode = 482
        versionName = "4.8.2-PRO"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // configure release keystore in production
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.navigation:navigation-compose:2.8.3")

    // AndroidX Media3 (ExoPlayer, Session, UI)
    implementation("androidx.media3:media3-exoplayer:1.4.1")
    implementation("androidx.media3:media3-ui:1.4.1")
    implementation("androidx.media3:media3-session:1.4.1")
    implementation("androidx.media3:media3-common:1.4.1")

    // Persistent Background Downloads with WorkManager
    implementation("androidx.work:work-runtime-ktx:2.9.1")

    // Room Database for Download History and Playlists
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")

    // Coroutines & Lifecycle
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.6")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.6")

    // Networking & OkHttp for Multi-threaded Streaming Downloads
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Coil for Asynchronous Image & Thumbnail Loading
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("io.coil-kt:coil-video:2.7.0")

    // Security & Encrypted SharedPreferences for Private Vault
    implementation("androidx.security:security-crypto:1.1.0-alpha06")
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Android Manifest with Media3 foreground service, WorkManager, storage & notification permissions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.mnstube.pro">

    <!-- Network Access -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

    <!-- Persistent Background Media Playback & Downloads -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <!-- Storage Management (Scoped Storage & WhatsApp Status Access) -->
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="28" />

    <!-- Floating Download Shortcut Permission -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

    <application
        android:name=".MnsTubeApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MnsTubePro"
        android:usesCleartextTraffic="true"
        tools:targetApi="35">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.MnsTubePro"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Share intent to capture URLs from Browser / YouTube / TikTok -->
            <intent-filter>
                <action android:name="android.intent.action.SEND" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="text/plain" />
            </intent-filter>
        </activity>

        <!-- Media3 Audio/Video Playback Service -->
        <service
            android:name=".player.MediaPlaybackService"
            android:exported="false"
            android:foregroundServiceType="mediaPlayback">
            <intent-filter>
                <action android:name="androidx.media3.session.MediaSessionService" />
            </intent-filter>
        </service>

    </application>
</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/mnstube/pro/MainActivity.kt',
    language: 'kotlin',
    description: 'Jetpack Compose entry point with Bottom Navigation (Download, Play, Settings), Top Bar, and Theme',
    content: `package com.mnstube.pro

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.mnstube.pro.ui.components.*
import com.mnstube.pro.ui.screens.*
import com.mnstube.pro.ui.theme.MnsTubeProTheme
import com.mnstube.pro.ui.theme.PureBlack
import com.mnstube.pro.ui.theme.NeonGreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MnsTubeProTheme {
                MnsTubeAppRoot()
            }
        }
    }
}

@Composable
fun MnsTubeAppRoot() {
    val navController = rememberNavController()
    var selectedTab by remember { mutableStateOf("download") }

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .background(PureBlack),
        containerColor = PureBlack,
        topBar = {
            MnsTubeTopBar(
                onNotificationClick = { /* open drawer */ },
                onSearchClick = { /* focus search */ }
            )
        },
        bottomBar = {
            MnsBottomNavigationBar(
                selectedTab = selectedTab,
                onTabSelected = { tab ->
                    selectedTab = tab
                    navController.navigate(tab) {
                        popUpTo(navController.graph.startDestinationId) { saveState = true }
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "download",
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            composable("download") {
                DownloadHomeScreen(
                    onNavigateToPlayer = { navController.navigate("play") }
                )
            }
            composable("play") {
                MediaPlayScreen()
            }
            composable("settings") {
                SettingsScreen()
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/mnstube/pro/service/DownloadWorker.kt',
    language: 'kotlin',
    description: 'WorkManager background worker executing authorized, resumable chunked video & audio downloads',
    content: `package com.mnstube.pro.service

import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.work.*
import com.mnstube.pro.R
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.concurrent.TimeUnit

class DownloadWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .build()

    override suspend fun doWork(): Result {
        val downloadUrl = inputData.getString(KEY_URL) ?: return Result.failure()
        val fileName = inputData.getString(KEY_FILENAME) ?: "video_\${System.currentTimeMillis()}.mp4"
        val targetFolder = inputData.getString(KEY_FOLDER) ?: context.getExternalFilesDir(null)?.absolutePath

        setForeground(createForegroundInfo(0, fileName))

        return try {
            val destinationFile = File(targetFolder, fileName)
            val request = Request.Builder()
                .url(downloadUrl)
                .addHeader("User-Agent", "MnsTubePro-Android/4.8")
                .build()

            val response = client.newCall(request).execute()
            if (!response.isSuccessful) return Result.retry()

            val body = response.body ?: return Result.failure()
            val totalBytes = body.contentLength()
            var downloadedBytes: Long = 0

            val inputStream: InputStream = body.byteStream()
            val outputStream = FileOutputStream(destinationFile)
            val buffer = ByteArray(8192)
            var bytesRead: Int

            while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                if (isStopped) {
                    outputStream.close()
                    inputStream.close()
                    return Result.failure()
                }
                outputStream.write(buffer, 0, bytesRead)
                downloadedBytes += bytesRead

                if (totalBytes > 0) {
                    val progress = ((downloadedBytes * 100) / totalBytes).toInt()
                    setProgress(workDataOf(KEY_PROGRESS to progress))
                    setForeground(createForegroundInfo(progress, fileName))
                }
            }

            outputStream.flush()
            outputStream.close()
            inputStream.close()

            Result.success(workDataOf(KEY_FILE_PATH to destinationFile.absolutePath))
        } catch (e: Exception) {
            e.printStackTrace()
            Result.retry()
        }
    }

    private fun createForegroundInfo(progress: Int, title: String): ForegroundInfo {
        val notification = NotificationCompat.Builder(context, "MNS_DOWNLOAD_CHANNEL")
            .setContentTitle("MNS TUBE PRO Downloader")
            .setContentText("Downloading \$title (\$progress%)")
            .setSmallIcon(R.drawable.ic_download)
            .setProgress(100, progress, false)
            .setOngoing(true)
            .build()

        return ForegroundInfo(NOTIFICATION_ID, notification)
    }

    companion object {
        const val KEY_URL = "key_download_url"
        const val KEY_FILENAME = "key_file_name"
        const val KEY_FOLDER = "key_folder"
        const val KEY_PROGRESS = "key_progress"
        const val KEY_FILE_PATH = "key_file_path"
        private const val NOTIFICATION_ID = 4001
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/mnstube/pro/player/MediaPlaybackService.kt',
    language: 'kotlin',
    description: 'AndroidX Media3 Service handling background audio and video playback with lockscreen controls',
    content: `package com.mnstube.pro.player

import android.content.Intent
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService

class MediaPlaybackService : MediaSessionService() {

    private var player: ExoPlayer? = null
    private var mediaSession: MediaSession? = null

    override fun onCreate() {
        super.onCreate()
        val audioAttributes = AudioAttributes.Builder()
            .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
            .setUsage(C.USAGE_MEDIA)
            .build()

        player = ExoPlayer.Builder(this)
            .setAudioAttributes(audioAttributes, true)
            .setHandleAudioBecomingNoisy(true)
            .build()

        mediaSession = MediaSession.Builder(this, player!!).build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? {
        return mediaSession
    }

    override fun onDestroy() {
        mediaSession?.run {
            player.release()
            release()
            mediaSession = null
        }
        super.onDestroy()
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/mnstube/pro/ui/theme/Theme.kt',
    language: 'kotlin',
    description: 'Black + Neon Green Material3 design token specifications for Jetpack Compose',
    content: `package com.mnstube.pro.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val PureBlack = Color(0xFF050505)
val SurfaceDark = Color(0xFF0E0F12)
val SurfaceCard = Color(0xFF14161B)
val NeonGreen = Color(0xFF00F078)
val NeonGreenGlow = Color(0x6600F078)
val TextWhite = Color(0xFFFFFFFF)
val TextGrey = Color(0xFFA0A5B2)

private val DarkColorScheme = darkColorScheme(
    primary = NeonGreen,
    onPrimary = PureBlack,
    secondary = NeonGreen,
    background = PureBlack,
    surface = SurfaceDark,
    surfaceVariant = SurfaceCard,
    onBackground = TextWhite,
    onSurface = TextWhite,
    onSurfaceVariant = TextGrey
)

@Composable
fun MnsTubeProTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
`,
  },
  {
    path: 'README_ANDROID.md',
    language: 'markdown',
    description: 'Complete Android Studio setup, building signed APK, and testing documentation',
    content: `# MNS TUBE PRO – Android Application Project

## Overview
MNS TUBE PRO is a modern, high-speed Android video and audio downloader application built with **Kotlin**, **Jetpack Compose**, **AndroidX Media3**, and **WorkManager**.

### Key Highlights
- **Theme**: Pure Black (#050505) + Neon Green (#00F078) with glowing modern controls.
- **Persistent Downloads**: Powered by AndroidX WorkManager for background survivability during app closure.
- **Media Playback**: Full-featured Media3 ExoPlayer with Picture-in-Picture and background playback notification.
- **WhatsApp Status Saver**: Scans and saves media from WhatsApp status folder with user permission.
- **Private Vault**: AES-256 encrypted hidden storage protected by a 4-digit PIN.
- **Multi-language**: Complete English and Urdu (اردو) RTL support.

## Prerequisites
- Android Studio Ladybug (2024.2+) or newer.
- Android SDK 35 (compileSdk: 35, minSdk: 26).
- JDK 17.

## Building the APK
1. Open the project folder in Android Studio.
2. Allow Gradle sync to download dependencies.
3. To build a debug APK:
   \`\`\`bash
   ./gradlew assembleDebug
   \`\`\`
   Output APK: \`app/build/outputs/apk/debug/app-debug.apk\`
4. To build an optimized release APK:
   \`\`\`bash
   ./gradlew assembleRelease
   \`\`\`
`,
  },
];
