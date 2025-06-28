import { Stack } from "expo-router";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { colors, typography } from "../../theme";

export default function ProfileInfosScreen() {
  const { session } = useAuth();

  // Extract user data from session
  const userEmail = session?.user?.email || "";
  const userMetadata = session?.user?.user_metadata || {};
  const displayName = userMetadata.full_name || userMetadata.name || "";

  // Split display name into first and last name
  const nameParts = displayName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "Informations",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.textPrimary,
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require("../../assets/images/avatar_placeholder.png")}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[typography.body, styles.label]}>Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre nom"
              placeholderTextColor={colors.grey}
              autoCapitalize="words"
              value={lastName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[typography.body, styles.label]}>Prénom</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre prénom"
              placeholderTextColor={colors.grey}
              autoCapitalize="words"
              value={firstName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[typography.body, styles.label]}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputReadOnly]}
              placeholder="Entrez votre email"
              placeholderTextColor={colors.grey}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={userEmail}
              editable={false}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: colors.grey,
  },
  input: {
    ...typography.body,
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  inputReadOnly: {
    backgroundColor: colors.lighterGrey,
    opacity: 0.7,
  },
});
