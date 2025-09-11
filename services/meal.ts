import { getDbResponseDataOrThrow, supabase } from "@/lib/supabase";
import type { RecipeType } from "@/types/recipe/recipe-type";
import { useCallback, useMemo } from "react";

export type MealWithRecipe = {
  id: string;
  recipeId: string;
  date: Temporal.PlainDate;
  servings: number;
  userId: string;
  recipe: {
    id: string;
    name: string;
    type: RecipeType;
    imageUrl?: string;
  };
};

export function useMealService() {
  const getUpcomingMeals = useCallback(async (userId: string): Promise<MealWithRecipe[]> => {
    const today = Temporal.Now.plainDateISO().toString();

    const meals = getDbResponseDataOrThrow(
      await supabase
        .from("meals")
        .select(
          `
        id,
        recipe_id,
        date,
        servings,
        user_id,
        recipes (
          id,
          name,
          type,
          image_url
        )
      `,
        )
        .eq("user_id", userId)
        .gte("date", today)
        .order("date")
        .order("recipes(name)"),
    );

    return meals.map((meal) => ({
      id: meal.id,
      recipeId: meal.recipe_id,
      date: Temporal.PlainDate.from(meal.date),
      servings: meal.servings,
      userId: meal.user_id,
      recipe: {
        id: meal.recipes.id,
        name: meal.recipes.name,
        type: meal.recipes.type,
        imageUrl: meal.recipes.image_url ?? undefined,
      },
    }));
  }, []);

  return useMemo(() => ({ getUpcomingMeals }), [getUpcomingMeals]);
}
