import type { ShoppingItemCategory } from "@/types/shopping/shopping-item-category";
import type { Database } from "../lib/database.types";
import { supabase } from "../lib/supabase";
import type { ShoppingItem } from "../types/shopping/shopping-item";
import type { ShoppingListSection } from "../types/shopping/shopping-list";

type DbItem = Database["public"]["Tables"]["shopping_items"]["Row"];
type DbCategory = ShoppingItem["category"];

export function useShoppingListService() {
	const getShoppingListItems = async (): Promise<ShoppingListSection[]> => {
		const { data, error } = await supabase
			.from("shopping_items")
			.select("*")
			.order("category")
			.order("name");

		if (error) {
			throw error;
		}

		// Group items by category
		const itemsByCategory = (data as DbItem[]).reduce(
			(acc, item) => {
				if (!acc[item.category]) {
					acc[item.category] = [];
				}
				acc[item.category].push({
					...item,
					quantity: item.quantity ?? undefined,
					unit: item.unit ?? undefined,
					checked: Boolean(item.checked),
					userId: item.user_id,
				});
				return acc;
			},
			{} as Record<DbCategory, ShoppingItem[]>,
		);

		return Object.entries(itemsByCategory).map(([category, items]) => ({
			title: category as ShoppingItemCategory,
			data: items,
		}));
	};

	const addShoppingListItem = async (item: Omit<ShoppingItem, "id">) => {
		const { error } = await supabase.from("shopping_items").insert({
			name: item.name,
			quantity: item.quantity,
			unit: item.unit,
			checked: item.checked,
			category: item.category,
			user_id: item.userId,
		});

		if (error) {
			throw error;
		}
	};

	const updateShoppingListItem = async (
		id: string,
		item: Omit<ShoppingItem, "id">,
	) => {
		const { error } = await supabase
			.from("shopping_items")
			.update({
				name: item.name,
				quantity: item.quantity,
				unit: item.unit,
				checked: item.checked,
				category: item.category,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id);

		if (error) {
			throw error;
		}
	};

	const deleteShoppingListItem = async (id: string) => {
		const { error } = await supabase
			.from("shopping_items")
			.delete()
			.eq("id", id);

		if (error) {
			throw error;
		}
	};

	return {
		getShoppingListItems,
		addShoppingListItem,
		updateShoppingListItem,
		deleteShoppingListItem,
	};
}
