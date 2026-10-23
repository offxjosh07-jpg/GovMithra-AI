# GovMithra AI — Android App Build Guide

This guide explains how to convert the GovMithra AI web application into an Android mobile app using Capacitor.

## Architecture

```
Existing GovMithra AI Website (Next.js)
        ↓
   Capacitor (wraps web assets)
        ↓
   Android App (.apk / .aab)
        ↓
   Next.js Dev Server (backend API)
        ↓
   GLM-5.2 + SQLite Database
```

The Android app bundles the web build (HTML/JS/CSS) and calls the backend API at a configurable URL. The GLM-5.2 API key stays on the server — it is NEVER exposed in the mobile app.

---

## Prerequisites

1. **Node.js 18+** and **Bun** (already installed)
2. **Android Studio** (for building APKs): https://developer.android.com/studio
3. **Java JDK 17+** (comes with Android Studio)
4. **Android SDK** (installed via Android Studio)
5. An **Android phone** (for testing) with **USB debugging** enabled
   - Settings → About Phone → tap "Build Number" 7 times → Developer Options → enable USB Debugging

---

## Step 1: Configure the Backend URL

The Android app needs to know where your backend server is running.

### Find your computer's local IP:
```bash
# Linux/Mac
ifconfig | grep "inet " | grep -v 127.0.0.1
# Or
ip addr show | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

Look for something like `192.168.1.10` or `10.0.0.5`.

### Set the API base URL (build-time):
Create a `.env` file in the project root:
```bash
NEXT_PUBLIC_API_BASE=http://192.168.1.10:3000/api
```

### Or set it at runtime (in the app):
Open the app → Settings → Server Configuration → enter the URL → Save.

---

## Step 2: Start the Backend Server

The Next.js dev server IS your backend. Start it on port 3000:

```bash
bun run dev
```

Keep this running. The Android app will call `http://192.168.1.10:3000/api/*`.

> **Important**: Your phone and computer must be on the **same WiFi network**.

---

## Step 3: Add the Android Platform (first time only)

```bash
# Build the static web assets for mobile
CAPACITOR_BUILD=1 bun run next build

# Add the Android platform
npx cap add android

# Sync the web build to the Android project
npx cap sync android
```

This creates an `android/` directory with the native Android project.

---

## Step 4: Build the Mobile Web Assets

Every time you change the web code, rebuild and sync:

```bash
# Build static export + sync to Android
bun run build:mobile
```

This runs:
1. `CAPACITOR_BUILD=1 next build` → outputs static files to `out/`
2. `cap sync android` → copies `out/` to the Android project

---

## Step 5: Open in Android Studio

```bash
npx cap open android
```

This opens Android Studio with the GovMithra AI project.

---

## Step 6: Run on a Physical Android Phone

1. Connect your phone via USB (with USB debugging enabled)
2. In Android Studio, select your phone from the device dropdown
3. Click the **Run** (▶) button
4. The app installs and launches on your phone

### Troubleshooting connection:
- If the app shows "cannot reach server":
  - Ensure `bun run dev` is running on your computer
  - Ensure phone and computer are on the same WiFi
  - Check firewall settings (allow port 3000)
  - Verify the IP address in Settings → Server Configuration

---

## Step 7: Generate a Debug APK

A debug APK is for testing — it's signed with a debug key.

```bash
# Option A: Via command line
cd android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk

# Option B: Via Android Studio
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

Install the debug APK on your phone:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Step 8: Generate a Release APK

A release APK is for distribution — it must be signed with your own keystore.

### Create a keystore (first time only):
```bash
keytool -genkey -v -keystore govmithra-release.keystore -alias govmithra -keyalg RSA -keysize 2048 -validity 10000
```
- Enter a password and remember it
- Save the `.keystore` file in a SECURE location (do NOT commit to git)

### Configure signing in `android/app/build.gradle`:
Add before the `android {` block:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Add inside `android { ... }`:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

Create `android/key.properties`:
```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=govmithra
storeFile=/path/to/govmithra-release.keystore
```

### Build the release APK:
```bash
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

---

## Step 9: Generate an AAB for Google Play Store

Google Play requires `.aab` (Android App Bundle) format.

```bash
cd android
./gradlew bundleRelease
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

Upload this `.aab` to the Google Play Console.

---

## App Configuration

### App Details
- **Name**: GovMithra AI
- **App ID**: `com.govmithra.ai`
- **Package**: `com.govmithra.ai`
- **Min SDK**: 22 (Android 5.1+)
- **Target SDK**: 34 (Android 14)

### Splash Screen
- Green background (#16a34a)
- Shows for 2 seconds on launch
- Configured in `capacitor.config.ts`

### Status Bar
- Green background (#16a34a)
- Light text
- Does not overlay webview

### App Icon
To customize the app icon:
```bash
# Generate icons from a source image (1024x1024 PNG)
npx @capacitor/assets generate --android
```
Place your icon at `resources/icon.png` and splash at `resources/splash.png`.

---

## Mobile Features

### Bottom Navigation (5 tabs)
- **Home** → Dashboard
- **Chat** → AI Chatbot (GLM-5.2)
- **Schemes** → Government Schemes Explorer
- **Agri** → AgriMithra (Crop Doctor, Weather, Market)
- **Profile** → Profile, Settings, Verification

### Camera Integration (AgriMithra)
- **Take Photo** button → launches native camera
- **From Gallery** button → opens photo picker
- Uses `@capacitor/camera` plugin
- Falls back to HTML file input on web

### Android Back Button
- Navigates back through views
- Exits app from the home screen
- Handled via `@capacitor/app` plugin

### Keyboard-Safe Chatbot
- Chat input sticks above the keyboard
- WebView resizes on keyboard appearance
- Configured via `@capacitor/keyboard` plugin

### Offline-Friendly
- Service worker caches the app shell
- API calls fail gracefully when offline
- App remains usable for cached content

### Multilingual
- Tamil, English, Hindi, Telugu, Kannada, Bengali
- Tanglish input supported by GLM-5.2
- Language selector in header + settings

---

## File Structure

```
govmithra-ai/
├── capacitor.config.ts        # Capacitor configuration
├── next.config.ts             # Next.js (standalone + export modes)
├── android/                   # Native Android project (generated)
├── out/                       # Static export (generated by build:mobile)
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── lib/
│   │   └── mobile.ts          # Capacitor detection + camera wrapper
│   ├── components/
│   │   └── govmithra/
│   │       ├── mobile-nav.tsx     # Bottom navigation bar
│   │       ├── native-init.tsx    # Status bar + back button init
│   │       └── sw-register.tsx    # Service worker registration
│   ├── services/
│   │   └── api.ts             # Configurable API base URL
│   └── app/
│       └── layout.tsx         # Mobile viewport meta tags
└── package.json               # Mobile build scripts
```

---

## Quick Reference Commands

```bash
# Development (web)
bun run dev

# Build for mobile (static export + sync)
bun run build:mobile

# Add Android platform (first time)
npx cap add android

# Open in Android Studio
npx cap open android

# Sync web changes to Android
npx cap sync android

# Generate debug APK
cd android && ./gradlew assembleDebug

# Generate release APK
cd android && ./gradlew assembleRelease

# Generate AAB for Play Store
cd android && ./gradlew bundleRelease
```

---

## Security Notes

- ✅ GLM-5.2 API key stays on the server (never in the app)
- ✅ All AI calls go through the Next.js API routes
- ✅ No Aadhaar numbers, OTPs, or passwords stored
- ✅ HTTPS recommended for production (use a reverse proxy)
- ⚠️ For production: remove `cleartext: true` from capacitor.config.ts and use HTTPS
- ⚠️ Keep your release keystore safe — you need it for all future updates

---

## Troubleshooting

### App can't reach the server
1. Check `bun run dev` is running
2. Check phone + computer on same WiFi
3. Check IP address in Settings → Server Configuration
4. Check firewall allows port 3000
5. Try pinging your computer from the phone

### Camera not working
1. Ensure camera permission is granted
2. Check `@capacitor/camera` is installed
3. Run `npx cap sync android` after adding plugins

### Blank screen on Android
1. Run `bun run build:mobile` to rebuild web assets
2. Run `npx cap sync android` to copy to Android
3. Check `out/` directory exists and has `index.html`

### Build errors
1. Ensure Java JDK 17+ is installed
2. Ensure Android SDK is installed
3. Run `cd android && ./gradlew clean` then rebuild
