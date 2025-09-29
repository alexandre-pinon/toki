import { colors, typography } from "@/theme";
import { ErrorBoundaryProps, router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function CustomErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.errorContainer}>
      <Text style={[typography.header, styles.errorText]}>{error.message}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={retry}>
          <Text style={[typography.subtitle, styles.retryButtonText]}>Réessayer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
          <Text style={[typography.subtitle, styles.goBackButtonText]}>Revenir en arrière</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.primary,
  },
  goBackButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: colors.white,
  },
});
