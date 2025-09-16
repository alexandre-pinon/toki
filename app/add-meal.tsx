import { LoadingOverlay } from "@/components/LoadingOverlay";
import { RecipeList } from "@/components/RecipeList";
import { createMeal } from "@/services/meal";
import { colors, typography } from "@/theme";
import { Recipe } from "@/types/recipe/recipe";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        pathname: "./meals/[id]",
        params: { id },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitleStyle: typography.header,
          headerTitle: "Nouveau repas",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
        }}
      />
      <SafeAreaView style={styles.container}>
        <RecipeList onPressRecipe={addMeal} />
        <LoadingOverlay visible={isLoading} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
