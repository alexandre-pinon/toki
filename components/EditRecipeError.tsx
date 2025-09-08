import { colors, typography } from "@/theme";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type EditRecipeErrorProps = {
  error?: string | null;
};

export function EditRecipeError({ error }: EditRecipeErrorProps) {
  return (
    <View style={styles.errorContainer}>
      <Text style={[typography.header, styles.errorText]}>{error || "Recipe not found"}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
        <Text style={[typography.body, styles.retryButtonText]}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 20,
    color: colors.error,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
});
