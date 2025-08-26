import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../theme";
import { formatQuantityAndUnit, type UnitType } from "../types/unit-type";

type RecipeTabsProps = {
  tab: RecipeTab;
  onTabChange: (tab: RecipeTab) => void;
  instructions: string[];
  ingredients: Array<{
    name: string;
    quantity?: number;
    unit?: UnitType;
  }>;
};

export type RecipeTab = "instructions" | "ingredients";

export function RecipeTabs({ tab, onTabChange, instructions, ingredients }: RecipeTabsProps) {
  return (
    <View style={styles.tabsContainer}>
      <View style={styles.tabsRow}>
        <TouchableOpacity style={styles.tabButton} onPress={() => onTabChange("instructions")}>
          <Text
            style={[
              typography.header,
              styles.tabText,
              tab === "instructions" && styles.tabTextActive,
            ]}
          >
            Instructions
          </Text>
          <View
            style={[styles.tabIndicator, tab === "instructions" && styles.tabIndicatorActive]}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => onTabChange("ingredients")}>
          <Text
            style={[
              typography.header,
              styles.tabText,
              tab === "ingredients" && styles.tabTextActive,
            ]}
          >
            Ingrédients
          </Text>
          <View style={[styles.tabIndicator, tab === "ingredients" && styles.tabIndicatorActive]} />
        </TouchableOpacity>
      </View>
      {tab === "instructions" ? (
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
      ) : (
        <View style={styles.ingredientsTabContent}>
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <Text style={[typography.body, styles.bulletText]}>{"\u2022"}</Text>
                <Text style={[typography.body]}>{ingredient.name}</Text>
                {(ingredient.quantity || ingredient.unit) && (
                  <Text style={[typography.body, styles.ingredientSubtext]}>
                    {formatQuantityAndUnit(ingredient.quantity, ingredient.unit)}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={[typography.body, styles.noDataText]}>Aucun ingrédient disponible</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  tabsRow: {
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  tabIndicator: {
    width: 55,
    height: 1,
    backgroundColor: "transparent",
  },
  tabIndicatorActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontWeight: "300",
  },
  tabTextActive: {
    color: colors.primary,
  },
  instructionsTabContent: {
    gap: 24,
  },
  ingredientsTabContent: {},
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
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bulletText: {
    fontSize: 24,
  },
  ingredientSubtext: {
    marginLeft: 4,
    color: colors.gray600,
  },
  noDataText: {
    textAlign: "center",
    color: colors.gray600,
    fontStyle: "italic",
  },
});
