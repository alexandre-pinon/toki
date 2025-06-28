import { supabase } from "@/lib/supabase";
import type { RecipeType } from "@/types/recipe/recipe-type";

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
	const getUpcomingMeals = async (
		userId: string,
	): Promise<MealWithRecipe[]> => {
		const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

		const { data, error } = await supabase
			.from("meals")
			.select(`
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
      `)
			.eq("user_id", userId)
			.gte("date", today)
			.order("date")
			.order("recipes(name)");

		if (error) {
			throw error;
		}

		return data.map((meal) => ({
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
	};

	return {
		getUpcomingMeals,
	};
}
