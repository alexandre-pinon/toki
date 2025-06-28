import type { UnitType } from "../unit-type";
import type { ShoppingItemCategory } from "./shopping-item-category";

export type ShoppingItem = {
	id: string;
	name: string;
	quantity?: number;
	unit?: UnitType;
	checked: boolean;
	category: ShoppingItemCategory;
	userId: string;
};

export type AggregatedShoppingItem = {
	readonly ids: string[];
	readonly category: ShoppingItemCategory;
	readonly name: string;
	readonly unit?: UnitType;
	readonly quantity?: number;
	readonly earliestMealDate?: Temporal.PlainDate;
	readonly checked: boolean;
	readonly userId: string;
};
