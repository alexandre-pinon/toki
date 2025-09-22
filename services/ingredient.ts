import { DBRow, getDbResponseDataOrThrow, OmitDBTimestamps, supabase } from "@/lib/supabase";
import { Ingredient, IngredientListSection } from "@/types/ingredient";
import { byShoppingItemCategoryOrder, ShoppingItemCategory } from "@/types/shopping/shopping-item-category";

const fromDatabaseToDomain = (dbIngredient: OmitDBTimestamps<DBRow<"ingredients">>): Ingredient => ({
  id: dbIngredient.id,
  name: dbIngredient.name,
  category: dbIngredient.category ?? "other",
});

export const searchIngredient = async (searchTerm: string): Promise<Ingredient[]> => {
  const sanitizedSearchTerm = searchTerm.trim().toLowerCase();
  const ingredients = getDbResponseDataOrThrow(
    await supabase.from("ingredients").select("*").like("name_normalized", `%${sanitizedSearchTerm}%`).limit(10),
  );

  return ingredients.map(fromDatabaseToDomain);
};

export const getIngredientSections = async (): Promise<IngredientListSection[]> => {
  //FIXME: paginate result somehow
  const ingredients = getDbResponseDataOrThrow(await supabase.from("ingredients").select("*").limit(1000));

  const ingredientsByCategory = ingredients.map(fromDatabaseToDomain).reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<ShoppingItemCategory, Ingredient[]>,
  );

  return Object.entries(ingredientsByCategory)
    .map(([category, items]) => ({
      title: category as ShoppingItemCategory,
      data: items,
    }))
    .sort((a, b) => byShoppingItemCategoryOrder(a.title, b.title));
};
