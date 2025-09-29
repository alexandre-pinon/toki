export default ({ config }) => {
  const profile = process.env.APP_PROFILE || "dev";

  return {
    ...config,
    name: profile === "prod" ? "Toki" : profile === "preview" ? "Toki (Preview)" : "Toki (Dev)",
    slug: "toki",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/toki_logo.png",
    scheme: "toki",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      config: {
        usesNonExemptEncryption: false,
      },
      bundleIdentifier: profile === "prod" ? "com.alexandrepinon.toki" : `com.alexandrepinon.toki.${profile}`,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: profile === "prod" ? "com.alexandrepinon.toki" : `com.alexandrepinon.toki.${profile}`,
      permissions: ["android.permission.RECORD_AUDIO"],
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.googleusercontent.apps.876817290985-28t9ssm2jeap87i6cirdjg22u9fnaur9",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you choose images for your recipes.",
        },
      ],
      "expo-font",
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      router: {},
      eas: {
        projectId: "0405d06b-39b8-4e1b-9ecf-8d18b75fd7ef",
      },
      profile,
    },
  };
};
