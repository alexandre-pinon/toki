import { useRecipeService } from "@/services/recipe";
import type { RecipeDetails } from "@/types/recipe/recipe";
import { startTransition, useActionState, useEffect } from "react";

type UseRecipeDetailsReturn = {
  recipeDetails: RecipeDetails | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

type UseRecipeDetailsState = {
  recipeDetails: RecipeDetails | null;
  error: string | null;
};

export function useRecipeDetails(recipeId: string | undefined): UseRecipeDetailsReturn {
  const { getRecipeById } = useRecipeService();

  const [state, action, isPending] = useActionState<UseRecipeDetailsState>(
    async () => {
      if (!recipeId) {
        return { recipeDetails: null, error: "Missing recipe ID" };
      }

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

  return {
    recipeDetails: state.recipeDetails,
    isLoading: isPending,
    error: state.error,
    refetch: () => startTransition(action),
  };
}
