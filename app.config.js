export default {
  "expo": {
    "name": "pomodoro-flow",
    "slug": "pomodoro-flow",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.terry.pomodoroflow",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      },
      "googleServicesFile": process.env.GOOGLE_SERVICE_INFO_PLIST || "GoogleService-Info.plist"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.terry.pomodoroflow",
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON || "google-services.json"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      [
        "expo-build-properties",
        {
          "ios": {
            "newArchEnabled": true
          },
          "android": {
            "newArchEnabled": true
          }
        }
      ],
      "expo-web-browser",
      "@react-native-google-signin/google-signin"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "e8325eb1-d33e-438e-bf35-8fd433a0ac55"
      }
    }
  }
}
