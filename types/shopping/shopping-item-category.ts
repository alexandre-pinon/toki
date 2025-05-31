export const shoppingItemCategories = [
	"other",
	"fruits_vegetables",
	"meat",
	"fish",
	"condiment",
	"cereals",
	"dairy_products",
	"desserts",
] as const;

export const isShoppingItemCategory = (
	value: string,
): value is ShoppingItemCategory => {
	return shoppingItemCategories.includes(value as ShoppingItemCategory);
};

export const mapShoppingItemCategoryToName = (
	category: ShoppingItemCategory,
): string => {
	switch (category) {
		case "fruits_vegetables":
			return "Fruits & Légumes";
		case "meat":
			return "Viande";
		case "fish":
			return "Poisson";
		case "condiment":
			return "Épices & Condiments";
		case "cereals":
			return "Céréales";
		case "dairy_products":
			return "Produits laitiers";
		case "desserts":
			return "Dessert";
		case "other":
			return "Autre";
		default:
			return category;
	}
};

export type ShoppingItemCategory = (typeof shoppingItemCategories)[number];
