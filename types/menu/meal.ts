import { RecipeType } from "../recipe/recipe-type";

export type Meal = {
  id: string;
  recipeId: string;
  date: Temporal.PlainDate;
  servings: number;
  userId: string;
};

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

export type MealCreateData = Omit<Meal, "id" | "userId">;
