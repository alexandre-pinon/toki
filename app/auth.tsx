import { ShoppingCartIcon } from "@/components/icons/ShoppingCartIcon";
import { useAuth } from "@/contexts/AuthContext";
import { useNetwork } from "@/contexts/NetworkContext";
import { colors, typography } from "@/theme";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const { signInWithGoogle } = useAuth();
  const { isConnected, isInternetReachable } = useNetwork();

  const isOffline = !isConnected || !isInternetReachable;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Connexion",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
        }}
      />
      <View style={styles.content}>
        <ShoppingCartIcon style={styles.icon} color={colors.primary} size={64} />
        <Text style={[typography.headlineMedium, styles.title]}>Bienvenue sur Toki</Text>
        <Text style={[typography.bodyLarge, styles.subtitle]}>Connectez-vous pour commencer à gérer vos courses</Text>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={signInWithGoogle}
          disabled={isOffline}
          style={[styles.button, isOffline && styles.buttonDisabled]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.7,
  },
  button: {
    width: "100%",
    height: 48,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
