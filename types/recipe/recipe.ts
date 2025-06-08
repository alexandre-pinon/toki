import type { UnitType } from "../unit-type";
import type { RecipeType } from "./recipe-type";

export type Recipe = {
	id: string;
	name: string;
	type: RecipeType;
	imageUrl?: string;
	preparationTime?: number;
	cookingTime?: number;
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
	ingredientId: string;
	quantity?: number;
	unit?: UnitType;
};
