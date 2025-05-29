export const shoppingItemCategories = [
	"Autre",
	"Fruits & Légumes",
	"Viande",
	"Poisson",
	"Épices & Condiments",
	"Céréales",
	"Produits laitiers",
	"Dessert",
	"Œufs & Produits frais",
] as const;

export const isShoppingItemCategory = (
	value: string,
): value is ShoppingItemCategory => {
	return shoppingItemCategories.includes(value as ShoppingItemCategory);
};

export type ShoppingItemCategory = (typeof shoppingItemCategories)[number];
