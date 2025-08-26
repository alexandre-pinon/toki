import { useAuth } from "@/contexts/AuthContext";
import { useRecipeService } from "@/services/recipe";
import type { Recipe } from "@/types/recipe/recipe";
import { startTransition, useActionState, useEffect } from "react";

type UseRecipesReturn = {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

type UseRecipesState = {
  recipes: Recipe[];
  error: string | null;
};

export function useRecipes(): UseRecipesReturn {
  const { session } = useAuth();
  const { getRecipes } = useRecipeService();

  const [state, action, isPending] = useActionState<UseRecipesState>(
    async () => {
      if (!session?.user?.id) {
        return { recipes: [], error: "User not authenticated" };
      }

      try {
        const data = await getRecipes(session.user.id);
        return { recipes: data, error: null };
      } catch (err) {
        console.error("Error fetching recipes:", err);
        return { recipes: [], error: "Failed to load recipes" };
      }
    },
    { recipes: [], error: null }
  );

  useEffect(() => {
    startTransition(action);
  }, [session?.user?.id]);

  return {
    recipes: state.recipes,
    isLoading: isPending,
    error: state.error,
    refetch: () => startTransition(action),
  };
}
