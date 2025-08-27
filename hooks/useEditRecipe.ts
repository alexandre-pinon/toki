import { useRecipeService } from "@/services/recipe";
import type { RecipeDetails, RecipeUpdateData } from "@/types/recipe/recipe";
import { startTransition, useActionState, useEffect } from "react";

type UseEditRecipeReturn = {
  recipeDetails: RecipeDetails | null;
  isLoading: boolean;
  error: string | null;
  updateRecipe: (recipeData: RecipeUpdateData) => Promise<void>;
  refetch: () => void;
};

type UseEditRecipeState = {
  recipeDetails: RecipeDetails | null;
  error: string | null;
};

export function useEditRecipe(recipeId: string): UseEditRecipeReturn {
  const { getRecipeById, updateRecipe: updateRecipeService } = useRecipeService();

  const [state, action, isPending] = useActionState<UseEditRecipeState>(
    async () => {
      try {
        const details = await getRecipeById(recipeId);
        return { recipeDetails: details, error: null };
      } catch (err) {
        console.error("Error fetching recipe:", err);
        return { recipeDetails: null, error: "Failed to load recipe" };
      }
    },
    { recipeDetails: null, error: null }
  );

  useEffect(() => {
    startTransition(action);
  }, [recipeId]);

  const updateRecipe = async (recipeData: RecipeUpdateData) => {
    await updateRecipeService(recipeId, recipeData);
  };

  return {
    recipeDetails: state.recipeDetails,
    isLoading: isPending,
    error: state.error,
    updateRecipe,
    refetch: () => startTransition(action),
  };
}
