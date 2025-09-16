import { colors, commonStyles, typography } from "@/theme";
import type { MealWithRecipe } from "@/types/menu/meal";
import { mapRecipeTypeToName } from "@/types/recipe/recipe-type";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MealCardProps = {
  meal: MealWithRecipe;
  onPress: () => void;
};

export function MealCard({ meal, onPress }: MealCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.mealCard}>
      <Image source={meal.recipe.imageUrl} style={styles.mealImage} contentFit="cover" transition={200} />
      <View style={styles.mealContent}>
        <Text style={[typography.subtitle, styles.mealTitle]}>{meal.recipe.name}</Text>
        <Text style={[typography.subtext, styles.mealType]}>{mapRecipeTypeToName(meal.recipe.type)}</Text>
      </View>
    </TouchableOpacity>
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
