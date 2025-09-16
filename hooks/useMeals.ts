import { useAuth } from "@/contexts/AuthContext";
import { getUpcomingMeals } from "@/services/meal";
import type { MealWithRecipe } from "@/types/menu/meal";
import { startTransition, useActionState, useEffect } from "react";

type UseMealsReturn = {
  meals: MealWithRecipe[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

type UseMealsState = {
  meals: MealWithRecipe[];
  error: string | null;
};

export function useMeals(): UseMealsReturn {
  const { session } = useAuth();

  const [state, action, isPending] = useActionState<UseMealsState>(
    async () => {
      if (!session?.user?.id) {
        return { meals: [], error: "User not authenticated" };
      }

      try {
        const data = await getUpcomingMeals(session.user.id);
        return { meals: data, error: null };
      } catch (err) {
        console.error("Error fetching meals:", err);
        return { meals: [], error: "Failed to load meals" };
      }
    },
    { meals: [], error: null },
  );

  useEffect(() => {
    startTransition(action);
  }, [session?.user?.id, action]);

  return {
    meals: state.meals,
    isLoading: isPending,
    error: state.error,
    refetch: () => startTransition(action),
  };
}
