import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { colors, typography } from "../theme";

export default function AuthScreen() {
  const { signInWithGoogle } = useAuth();

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
        <Ionicons name="cart" size={64} color={colors.primary} style={styles.icon} />
        <Text style={[typography.headlineMedium, styles.title]}>Bienvenue sur Toki</Text>
        <Text style={[typography.bodyLarge, styles.subtitle]}>
          Connectez-vous pour commencer à gérer vos courses
        </Text>
        <TouchableOpacity style={styles.button} onPress={signInWithGoogle}>
          <Ionicons name="logo-google" size={24} color={colors.primary} style={styles.buttonIcon} />
          <Text style={[typography.bodyLarge, styles.buttonText]}>Se connecter avec Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    width: "100%",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: colors.primary,
  },
});
