import { getDbResponseDataOrThrow, supabase } from "@/lib/supabase";
import type { Recipe, RecipeDetails, RecipeUpsertData } from "@/types/recipe/recipe";
import { byShoppingItemCategoryOrder } from "@/types/shopping/shopping-item-category";
import mime from "mime";
import { useCallback, useMemo } from "react";
import { useImageService } from "./image";

export function useRecipeService() {
  const { uploadImage, removeImage } = useImageService();

  const getRecipes = useCallback(async (userId: string): Promise<Recipe[]> => {
    const recipes = getDbResponseDataOrThrow(
      await supabase.from("recipes").select("*").eq("user_id", userId).order("name"),
    );

    return recipes.map((recipe) => ({
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
  }, []);

  const getRecipeById = useCallback(async (id: string): Promise<RecipeDetails> => {
    const recipe = getDbResponseDataOrThrow(await supabase.from("recipes").select("*").eq("id", id).single());
    const recipeIngredients = getDbResponseDataOrThrow(
      await supabase
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
        .eq("recipe_id", id)
        .order("ingredients(name)"),
    );

    if (
      !Array.isArray(recipe?.instructions) ||
      !recipe.instructions.every((instruction) => typeof instruction === "string")
    ) {
      throw new Error("Invalid recipe instructions format");
    }

    return {
      recipe: {
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
      },
      ingredients: recipeIngredients
        .map((item) => ({
          recipeId: id,
          ingredientId: item.ingredients.id,
          quantity: item.quantity ?? undefined,
          unit: item.unit ?? undefined,
          name: item.ingredients.name,
          category: item.ingredients.category ?? "other",
        }))
        .sort((a, b) => byShoppingItemCategoryOrder(a.category, b.category)),
      instructions: recipe.instructions,
    };
  }, []);

  const upsertRecipe = useCallback(
    async ({ recipe, ingredients, instructions }: RecipeUpsertData): Promise<void> => {
      if (recipe.imageUrl && recipe.imageType && recipe.imageUrl.startsWith("file://")) {
        const filePath = `recipes/${recipe.id}.${mime.getExtension(recipe.imageType)}`;
        const uploadedImagePath = await uploadImage(recipe.imageUrl, filePath, recipe.imageType);
        recipe.imageUrl = uploadedImagePath;
      }

      getDbResponseDataOrThrow(
        await supabase.from("recipes").upsert({
          id: recipe.id,
          name: recipe.name,
          type: recipe.type,
          image_url: recipe.imageUrl,
          preparation_time: recipe.preparationTime,
          cooking_time: recipe.cookingTime,
          rest_time: recipe.restTime,
          servings: recipe.servings,
          instructions: instructions,
          updated_at: Temporal.Now.plainDateTimeISO().toString(),
        }),
      );

      const ingredientsToDelete = getDbResponseDataOrThrow(
        await supabase
          .from("recipes_to_ingredients")
          .select("*")
          .eq("recipe_id", recipe.id)
          .not("ingredient_id", "in", `(${ingredients.map((ingredient) => ingredient.ingredientId).join(",")})`),
      );

      if (ingredientsToDelete.length > 0) {
        getDbResponseDataOrThrow(
          await supabase
            .from("recipes_to_ingredients")
            .delete()
            .eq("recipe_id", recipe.id)
            .in(
              "ingredient_id",
              ingredientsToDelete.map(({ ingredient_id }) => ingredient_id),
            ),
        );
      }

      if (ingredients.length > 0) {
        getDbResponseDataOrThrow(
          await supabase.from("recipes_to_ingredients").upsert(
            ingredients.map((ingredient) => ({
              recipe_id: recipe.id,
              ingredient_id: ingredient.ingredientId,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              updated_at: Temporal.Now.plainDateTimeISO().toString(),
            })),
          ),
        );
      }
    },
    [uploadImage],
  );

  const deleteRecipe = useCallback(
    async (id: string) => {
      const deletedRecipe = getDbResponseDataOrThrow(
        await supabase.from("recipes").delete().eq("id", id).select("*").single(),
      );

      if (deletedRecipe.image_url) {
        const fileExtension = deletedRecipe.image_url.split(".").at(-1);
        await removeImage(`recipes/${id}.${fileExtension}`);
      }
    },
    [removeImage],
  );

  return useMemo(
    () => ({ getRecipes, getRecipeById, upsertRecipe, deleteRecipe }),
    [getRecipes, getRecipeById, upsertRecipe, deleteRecipe],
  );
}
