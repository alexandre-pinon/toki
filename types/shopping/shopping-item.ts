import type { UnitType } from "../unit-type";
import type { ShoppingItemCategory } from "./shopping-item-category";

export type ShoppingItem = {
	id: string;
	name: string;
	quantity: number;
	unit?: UnitType;
	checked: boolean;
	category: ShoppingItemCategory;
};
