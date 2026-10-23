import type { CapacitorConfig } from '@capacitor/cli';

// GovMithra AI — Capacitor configuration
// The Android app bundles the frontend (HTML/JS/CSS from out/).
// All API calls go to the running Next.js backend server (configurable URL).

const config: CapacitorConfig = {
  appId: 'com.govmithra.ai',
  appName: 'GovMithra AI',
  webDir: 'out',
  bundledWebRuntime: false,
  backgroundColor: '#16a34a',
  android: {
    backgroundColor: '#16a34a',
    allowMixedContent: true,
  },
  server: {
    androidScheme: 'https',
    cleartext: true, // Allow HTTP during development
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#16a34a',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#16a34a',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'native',
      resizeOnFullScreen: true,
      style: 'DEFAULT',
    },
  },
};

export default config;
