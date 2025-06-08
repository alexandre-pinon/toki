import { supabase } from "@/lib/supabase";
import type { Recipe } from "@/types/recipe/recipe";

export function useRecipeService() {
	const getRecipes = async (userId: string): Promise<Recipe[]> => {
		const { data, error } = await supabase
			.from("recipes")
			.select("*")
			.eq("user_id", userId)
			.order("name");

		if (error) {
			throw error;
		}

		return data.map((recipe) => ({
			id: recipe.id,
			name: recipe.name,
			type: recipe.type,
			imageUrl: recipe.image_url ?? undefined,
			preparationTime: recipe.preparation_time ?? undefined,
			cookingTime: recipe.cooking_time ?? undefined,
			servings: recipe.servings,
			timesDone: recipe.times_done,
			userId: recipe.user_id,
			lastTimeDone: recipe.last_time_done
				? Temporal.PlainDate.from(recipe.last_time_done)
				: undefined,
		}));
	};

	return {
		getRecipes,
	};
}
