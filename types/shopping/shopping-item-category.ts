export const shoppingItemCategories = [
	"meat",
	"fish",
	"fruits_vegetables",
	"cereals",
	"condiment",
	"dairy_products",
	"desserts",
	"other",
] as const;

/**
 * Sort shopping item categories by order in shoppingItemCategories array
 */
export const byShoppingItemCategoryOrder = (
	a: ShoppingItemCategory,
	b: ShoppingItemCategory,
) => {
	if (shoppingItemCategories.indexOf(a) > shoppingItemCategories.indexOf(b)) {
		return 1;
	}
	if (shoppingItemCategories.indexOf(a) < shoppingItemCategories.indexOf(b)) {
		return -1;
	}
	return 0;
};

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

export const mapShoppingItemCategoryToImageSource = (
	category: ShoppingItemCategory,
): string => {
	switch (category) {
		case "fruits_vegetables":
			return require("../../assets/images/fruits_vegetables.png");
		case "meat":
			return require("../../assets/images/meat.png");
		case "fish":
			return require("../../assets/images/fish.png");
		case "condiment":
			return require("../../assets/images/condiment.png");
		case "cereals":
			return require("../../assets/images/cereals.png");
		case "dairy_products":
			return require("../../assets/images/dairy_products.png");
		case "desserts":
			return require("../../assets/images/desserts.png");
		case "other":
			return require("../../assets/images/other.png");
		default:
			throw new Error(`Unknown category: ${category}`);
	}
};

export type ShoppingItemCategory = (typeof shoppingItemCategories)[number];
