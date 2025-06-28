import type { AggregatedShoppingItem, ShoppingItem } from "./shopping-item";
import type { ShoppingItemCategory } from "./shopping-item-category";

export type ShoppingListSection = {
	title: ShoppingItemCategory;
	data: AggregatedShoppingItem[];
};
