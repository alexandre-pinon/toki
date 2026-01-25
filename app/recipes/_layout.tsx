import { CurrentRecipeProvider } from "@/contexts/CurrentRecipeContext";
import { Stack, useLocalSearchParams } from "expo-router";

export default function RecipesLayout() {
  const params = useLocalSearchParams<{ id?: string }>();

  // Extract the recipe ID from either /recipes/[id] or /recipes/edit/[id]
  const recipeId = params.id;

  // Only provide CurrentRecipeProvider when we have a recipe ID
  // (both detail and edit routes will share this provider)
  if (recipeId) {
    return (
      <CurrentRecipeProvider id={recipeId}>
        <Stack>
          <Stack.Screen name="[id]/index" options={{ headerShown: false }} />
          <Stack.Screen name="edit" options={{ headerShown: false }} />
        </Stack>
      </CurrentRecipeProvider>
    );
  }

  // For routes without ID, just render children
  return <Stack />;
}
