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
	ingredients: RecipeIngredient[];
	instructions: string[];
	timesDone: number;
	userId: string;
};

export type RecipeIngredient = {
	recipeId: string;
	ingredientId: string;
	quantity?: number;
	unit?: UnitType;
};
