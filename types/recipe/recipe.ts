import { Ingredient } from "../ingredient";
import type { UnitType } from "../unit-type";
import type { RecipeType } from "./recipe-type";

export type Recipe = {
  id: string;
  name: string;
  type: RecipeType;
  imageUrl?: string;
  preparationTime?: number;
  cookingTime?: number;
  restTime?: number;
  servings: number;
  timesDone: number;
  lastTimeDone?: Temporal.PlainDate;
  userId: string;
};

export type RecipeDetails = {
  recipe: Recipe;
  ingredients: RecipeIngredient[];
  instructions: string[];
};

export type RecipeIngredient = {
  recipeId: string;
  quantity?: number;
  unit?: UnitType;
  ingredientId: Ingredient["id"];
  name: Ingredient["name"];
  category: Ingredient["category"];
};

export type RecipeUpsertData = {
  recipe: Omit<Recipe, "timesDone" | "lastTimeDone" | "userId"> & { imageType?: string };
  ingredients: Omit<RecipeIngredient, "recipeId" | "name" | "category">[];
  instructions: string[];
};

export const getTotalTime = (recipe: Pick<Recipe, "preparationTime" | "cookingTime" | "restTime">) => {
  return (recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0) + (recipe.restTime ?? 0);
};

export const createEmptyRecipeData = (
  recipeId: string,
): RecipeUpsertData & { ingredients: Omit<RecipeIngredient, "recipeId">[] } => {
  return {
    recipe: {
      id: recipeId,
      name: "Nouvelle recette",
      type: "main",
      servings: 4,
    },
    ingredients: [],
    instructions: [],
  };
};
