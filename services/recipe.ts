import { supabase } from "@/lib/supabase";
import type { Recipe, RecipeDetails, RecipeIngredient, RecipeUpsertData } from "@/types/recipe/recipe";

export function useRecipeService() {
  const getRecipes = async (userId: string): Promise<Recipe[]> => {
    const { data, error } = await supabase.from("recipes").select("*").eq("user_id", userId).order("name");

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
      restTime: recipe.rest_time ?? undefined,
      servings: recipe.servings,
      timesDone: recipe.times_done,
      userId: recipe.user_id,
      lastTimeDone: recipe.last_time_done ? Temporal.PlainDate.from(recipe.last_time_done) : undefined,
    }));
  };

  const getRecipeById = async (recipeId: string): Promise<RecipeDetails> => {
    const { data: recipeData, error: recipeError } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", recipeId)
      .single();

    if (recipeError) {
      throw recipeError;
    }

    const { data: ingredientsData, error: ingredientsError } = await supabase
      .from("recipes_to_ingredients")
      .select(
        `
				quantity,
				unit,
				ingredients (
					id,
					name,
					category
				)
			`,
      )
      .eq("recipe_id", recipeId);

    if (ingredientsError) {
      throw ingredientsError;
    }

    if (
      !Array.isArray(recipeData?.instructions) ||
      !recipeData.instructions.every((instruction) => typeof instruction === "string")
    ) {
      throw new Error("Invalid recipe instructions format");
    }

    const recipe: Recipe = {
      id: recipeData.id,
      name: recipeData.name,
      type: recipeData.type,
      imageUrl: recipeData.image_url ?? undefined,
      preparationTime: recipeData.preparation_time ?? undefined,
      cookingTime: recipeData.cooking_time ?? undefined,
      restTime: recipeData.rest_time ?? undefined,
      servings: recipeData.servings,
      timesDone: recipeData.times_done,
      userId: recipeData.user_id,
      lastTimeDone: recipeData.last_time_done ? Temporal.PlainDate.from(recipeData.last_time_done) : undefined,
    };

    const ingredients: RecipeIngredient[] = ingredientsData.map((item) => ({
      recipeId: recipeId,
      ingredientId: item.ingredients.id,
      quantity: item.quantity ?? undefined,
      unit: item.unit ?? undefined,
      name: item.ingredients.name,
      category: item.ingredients.category ?? "other",
    }));

    return {
      recipe,
      ingredients,
      instructions: recipeData.instructions,
    };
  };

  const upsertRecipe = async (recipeData: RecipeUpsertData): Promise<void> => {
    const { error: recipeUpsertError } = await supabase.from("recipes").upsert({
      id: recipeData.recipe.id,
      name: recipeData.recipe.name,
      type: recipeData.recipe.type,
      image_url: recipeData.recipe.imageUrl,
      preparation_time: recipeData.recipe.preparationTime,
      cooking_time: recipeData.recipe.cookingTime,
      rest_time: recipeData.recipe.restTime,
      servings: recipeData.recipe.servings,
      instructions: recipeData.instructions,
    });

    if (recipeUpsertError) {
      throw recipeUpsertError;
    }

    if (recipeData.ingredients.length > 0) {
      const { error: ingredientsUpsertError } = await supabase.from("recipes_to_ingredients").upsert(
        recipeData.ingredients.map((ingredient) => ({
          recipe_id: recipeData.recipe.id,
          ingredient_id: ingredient.ingredientId,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
      );

      if (ingredientsUpsertError) {
        throw ingredientsUpsertError;
      }
    }
  };

  return {
    getRecipes,
    getRecipeById,
    upsertRecipe,
  };
}
