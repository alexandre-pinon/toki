import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../theme";

type RecipeErrorProps = {
  error?: string | null;
};

export function RecipeError({ error }: RecipeErrorProps) {
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
    paddingHorizontal: 24,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
  },
});
