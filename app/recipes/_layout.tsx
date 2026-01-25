import { CurrentRecipeProvider } from "@/contexts/CurrentRecipeContext";
import { Slot, useLocalSearchParams } from "expo-router";

export default function RecipesLayout() {
  const params = useLocalSearchParams<{ id?: string }>();

  // Extract the recipe ID from either /recipes/[id] or /recipes/edit/[id]
  const recipeId = params.id;

  // Only provide CurrentRecipeProvider when we have a recipe ID
  // (both detail and edit routes will share this provider)
  if (recipeId) {
    return (
      <CurrentRecipeProvider id={recipeId}>
        <Slot />
      </CurrentRecipeProvider>
    );
  }

  // For routes without ID, just render children
  return <Slot />;
}
