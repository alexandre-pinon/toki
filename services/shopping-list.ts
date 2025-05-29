import { useSQLiteContext } from "expo-sqlite";
import type { ShoppingItem } from "../types/shopping/shopping-item";
import type { ShoppingListSection } from "../types/shopping/shopping-list";

export function useShoppingListService() {
	const db = useSQLiteContext();

	const getShoppingListItems = async (): Promise<ShoppingListSection[]> => {
		type DbItem = {
			id: number;
			name: string;
			quantity: number;
			unit: ShoppingItem["unit"];
			checked: boolean;
			category: ShoppingItem["category"];
		};

		const result = await db.getAllAsync<DbItem>(`
      SELECT id, name, quantity, unit, checked, category
      FROM shopping_list_items
      ORDER BY category, name
    `);

		// Group items by category
		const itemsByCategory = result.reduce(
			(acc, item) => {
				if (!acc[item.category]) {
					acc[item.category] = [];
				}
				acc[item.category].push({
					...item,
					checked: Boolean(item.checked), // stored as 0 or 1 in db
				});
				return acc;
			},
			{} as Record<ShoppingItem["category"], ShoppingItem[]>,
		);

		return Object.entries(itemsByCategory).map(([category, items]) => ({
			title: category as ShoppingItem["category"],
			data: items,
		}));
	};

	const addShoppingListItem = async (item: Omit<ShoppingItem, "id">) => {
		await db.runAsync(
			`
      INSERT INTO shopping_list_items (name, quantity, unit, checked, category)
      VALUES (?, ?, ?, ?, ?)
    `,
			[
				item.name,
				item.quantity ?? null,
				item.unit ?? null,
				item.checked,
				item.category,
			],
		);
	};

	const updateShoppingListItem = async (
		id: number,
		item: Omit<ShoppingItem, "id">,
	) => {
		await db.runAsync(
			`
      UPDATE shopping_list_items
      SET name = ?, quantity = ?, unit = ?, checked = ?, category = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
			[
				item.name,
				item.quantity ?? null,
				item.unit ?? null,
				item.checked,
				item.category,
				id,
			],
		);
	};

	const deleteShoppingListItem = async (id: number) => {
		await db.runAsync(
			`
      DELETE FROM shopping_list_items
      WHERE id = ?
    `,
			[id],
		);
	};

	return {
		getShoppingListItems,
		addShoppingListItem,
		updateShoppingListItem,
		deleteShoppingListItem,
	};
}
