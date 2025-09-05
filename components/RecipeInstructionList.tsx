import { colors, typography } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

type RecipeInstructionListProps = {
  instructions: string[];
};

export function RecipeInstructionList({ instructions }: RecipeInstructionListProps) {
  return (
    <View style={styles.instructionsTabContent}>
      {instructions.length > 0 ? (
        instructions.map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <Text style={[typography.bodyLarge, styles.stepTitle]}>Étape {idx + 1}</Text>
            <Text style={[typography.bodyLarge, styles.stepText]}>{step}</Text>
          </View>
        ))
      ) : (
        <Text style={[typography.body, styles.noDataText]}>Aucune instruction disponible</Text>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  instructionsTabContent: {
    gap: 24,
  },
  stepRow: {
    gap: 4,
  },
  stepTitle: {
    fontSize: 14,
  },
  stepText: {
    fontSize: 14,
    color: colors.gray600,
  },
  noDataText: {
    textAlign: "center",
    color: colors.gray600,
    fontStyle: "italic",
  },
});
