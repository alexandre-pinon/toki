import {
	byShoppingItemCategoryOrder,
	type ShoppingItemCategory,
} from "@/types/shopping/shopping-item-category";
import { supabase } from "../lib/supabase";
import {
	byEarliestMealDate,
	type AggregatedShoppingItem,
	type ShoppingItem,
} from "../types/shopping/shopping-item";
import type { ShoppingListSection } from "../types/shopping/shopping-list";

export function useShoppingListService() {
	const getShoppingListItems = async (
		userId: string,
	): Promise<ShoppingListSection[]> => {
		const getShoppingItemsQuery = supabase
			.from("shopping_items")
			.select()
			.eq("user_id", userId)
			.is("meal_id", null);
		const getUpcomingMealsShoppingItemsQuery = supabase
			.from("upcoming_meals_shopping_items")
			.select()
			.eq("user_id", userId);

		const [
			{ data: items, error: itemsError },
			{
				data: upcomingMealsShoppingItems,
				error: upcomingMealsShoppingItemsError,
			},
		] = await Promise.all([
			getShoppingItemsQuery,
			getUpcomingMealsShoppingItemsQuery,
		]);

		if (itemsError || upcomingMealsShoppingItemsError) {
			throw itemsError ?? upcomingMealsShoppingItemsError;
		}

		const aggregatedItemsFromShoppingItems: AggregatedShoppingItem[] =
			items.map((item) => ({
				ids: [item.id],
				category: item.category,
				name: item.name,
				quantity: item.quantity ?? undefined,
				unit: item.unit ?? undefined,
				checked: item.checked,
				userId: item.user_id,
			}));
		const aggregatedItemsFromUpcomingMeals: AggregatedShoppingItem[] =
			upcomingMealsShoppingItems.map((item) => ({
				ids: item.ids ?? [],
				category: item.category ?? "other",
				name: item.name ?? "",
				unit: item.unit ?? undefined,
				quantity: item.quantity ?? undefined,
				earliestMealDate: item.meal_date
					? Temporal.PlainDate.from(item.meal_date)
					: undefined,
				checked: item.checked ?? false,
				userId: item.user_id ?? "",
			}));

		// Group items by category
		const itemsByCategory = [
			...aggregatedItemsFromUpcomingMeals,
			...aggregatedItemsFromShoppingItems,
		].reduce(
			(acc, item) => {
				if (!acc[item.category]) {
					acc[item.category] = [];
				}
				acc[item.category].push(item);
				return acc;
			},
			{} as Record<ShoppingItemCategory, AggregatedShoppingItem[]>,
		);

		return Object.entries(itemsByCategory)
			.map(([category, items]) => ({
				title: category as ShoppingItemCategory,
				data: items.sort(byEarliestMealDate),
			}))
			.sort((a, b) => byShoppingItemCategoryOrder(a.title, b.title));
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

	const setCheckedShoppingListItems = async (
		ids: string[],
		checked: boolean,
	) => {
		if (ids.length === 0) {
			return;
		}

		const { error } = await supabase
			.from("shopping_items")
			.update({ checked, updated_at: new Date().toISOString() })
			.in("id", ids);

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
		setCheckedShoppingListItems,
		deleteShoppingListItem,
	};
}
