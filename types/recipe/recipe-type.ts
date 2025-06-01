export const recipeTypes = [
	"starter",
	"main",
	"side",
	"dessert",
	"drink",
	"sauce",
] as const;

export type RecipeType = (typeof recipeTypes)[number];
