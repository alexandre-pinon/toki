import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";
import { formatQuantityAndUnit } from "../types/unit-type";
import { RecipeIngredient } from "@/types/recipe/recipe";

type RecipeTabsProps = {
  ingredients: Omit<RecipeIngredient, "recipeId" | "ingredientId">[];
};

export function RecipeIngredientList({ ingredients }: RecipeTabsProps) {
  if (ingredients.length === 0) {
    return <Text style={[typography.body, styles.noDataText]}>Aucun ingrédient disponible</Text>;
  }

  return (
    <View>
      {ingredients.map((ingredient, idx) => (
        <View key={idx} style={styles.ingredientRow}>
          <Text style={[typography.body, styles.bulletText]}>{"\u2022"}</Text>
          <Text style={[typography.body, styles.ingredientText]}>{ingredient.name}</Text>
          {(ingredient.quantity || ingredient.unit) && (
            <Text style={[typography.body, styles.ingredientSubtext]}>
              {formatQuantityAndUnit(ingredient.quantity, ingredient.unit)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bulletText: {
    fontSize: 24,
  },
  ingredientText: {
    textTransform: "capitalize",
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
