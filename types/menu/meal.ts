export type Meal = {
	id: string;
	recipeId: string;
	date: Temporal.PlainDate;
	servings: number;
	userId: string;
};
