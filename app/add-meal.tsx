import { LoadingOverlay } from "@/components/LoadingOverlay";
import { RecipeList } from "@/components/RecipeList";
import { createMeal } from "@/services/meal";
import { Recipe } from "@/types/recipe/recipe";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function AddMealScreen() {
  const { mealDate } = useLocalSearchParams<{ mealDate: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const addMeal = async ({ id: recipeId, servings }: Recipe) => {
    try {
      setIsLoading(true);
      const { id } = await createMeal({
        recipeId,
        date: Temporal.PlainDate.from(mealDate),
        servings,
      });
      router.push({
        pathname: "meals/[id]",
        params: { id },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <RecipeList onPressRecipe={addMeal} />
      <LoadingOverlay visible={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
