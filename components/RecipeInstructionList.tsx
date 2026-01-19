import { colors, typography } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { LinkableText } from "./LinkableText";

type RecipeInstructionListProps = {
  instructions: string[];
};

export function RecipeInstructionList({
  instructions,
}: RecipeInstructionListProps) {
  return (
    <View style={styles.instructionsTabContent}>
      {instructions.length > 0 ? (
        instructions.map((step, index) => (
          <View
            key={`recipe-instruction-step-${index + 1}`}
            style={styles.stepRow}
          >
            <Text style={[typography.bodyLarge, styles.stepTitle]}>
              Étape {index + 1}
            </Text>
            <LinkableText style={[typography.bodyLarge, styles.stepText]}>
              {step}
            </LinkableText>
          </View>
        ))
      ) : (
        <Text style={[typography.body, styles.noDataText]}>
          Aucune instruction disponible
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
