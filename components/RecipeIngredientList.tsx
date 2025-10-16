import { colors, typography } from "@/theme";
import { RecipeIngredient } from "@/types/recipe/recipe";
import { formatQuantityAndUnit } from "@/types/unit-type";
import { capitalize } from "@/utils/string";
import { StyleSheet, Text, View } from "react-native";

type RecipeTabsProps = {
  ingredients: Omit<RecipeIngredient, "recipeId" | "ingredientId">[];
  quantityCoefficient?: number;
};

export function RecipeIngredientList({ ingredients, quantityCoefficient }: RecipeTabsProps) {
  if (ingredients.length === 0) {
    return <Text style={[typography.body, styles.noDataText]}>Aucun ingrédient disponible</Text>;
  }

  return (
    <View>
      {ingredients.map((ingredient) => (
        <View key={ingredient.name} style={styles.ingredientRow}>
          <Text style={[typography.body, styles.bulletText]}>{"\u2022"}</Text>
          <Text style={[typography.body]}>{capitalize(ingredient.name)}</Text>
          {(ingredient.quantity || ingredient.unit) && (
            <Text style={[typography.body, styles.ingredientSubtext]}>
              {formatQuantityAndUnit(ingredient.quantity, ingredient.unit, quantityCoefficient)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
