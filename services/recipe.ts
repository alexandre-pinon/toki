import { supabase } from "@/lib/supabase";
import type { Recipe } from "@/types/recipe/recipe";

export function useRecipeService() {
	const getRecipes = async (userId: string): Promise<Recipe[]> => {
		const { data, error } = await supabase
			.from("recipes")
			.select(`
        *,
        ingredients:recipe_ingredients(*)
      `)
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
			ingredients: recipe.ingredients.map((ingredient: any) => ({
				recipeId: ingredient.recipe_id,
				ingredientId: ingredient.ingredient_id,
				quantity: ingredient.quantity ?? undefined,
				unit: ingredient.unit ?? undefined,
			})),
			instructions: recipe.instructions,
			timesDone: recipe.times_done,
			userId: recipe.user_id,
		}));
	};

	return {
		getRecipes,
	};
}
