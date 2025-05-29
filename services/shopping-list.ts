import { useSQLiteContext } from "expo-sqlite";
import type { ShoppingItem } from "../types/shopping/shopping-item";
import type { ShoppingListSection } from "../types/shopping/shopping-list";

export function useShoppingListService() {
	const db = useSQLiteContext();

	const getShoppingListItems = async (): Promise<ShoppingListSection[]> => {
		type DbItem = {
			id: string;
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
				item.quantity,
				item.unit ?? null,
				item.checked,
				item.category,
			],
		);
	};

	const updateShoppingListItem = async (id: string, checked: boolean) => {
		await db.runAsync(
			`
      UPDATE shopping_list_items
      SET checked = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
			[checked, id],
		);
	};

	const deleteShoppingListItem = async (id: string) => {
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
