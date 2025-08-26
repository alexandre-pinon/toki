import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import type { MealWithRecipe } from "../services/meal";
import { colors, commonStyles, typography } from "../theme";
import { mapRecipeTypeToName } from "../types/recipe/recipe-type";

type MealCardProps = {
  meal: MealWithRecipe;
};

export function MealCard({ meal }: MealCardProps) {
  return (
    <View style={styles.mealCard}>
      <Image
        source={meal.recipe.imageUrl}
        style={styles.mealImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.mealContent}>
        <Text style={[typography.subtitle, styles.mealTitle]}>{meal.recipe.name}</Text>
        <Text style={[typography.subtext, styles.mealType]}>
          {mapRecipeTypeToName(meal.recipe.type)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    boxShadow: commonStyles.boxShadow,
  },
  mealImage: {
    width: 70,
    height: 70,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  mealContent: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 12,
  },
  mealTitle: {
    marginBottom: 2,
  },
  mealMenuIcon: {
    paddingHorizontal: 12,
  },
  mealType: {
    textTransform: "capitalize",
  },
});
