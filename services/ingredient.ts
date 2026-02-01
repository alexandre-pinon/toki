import { DBRow, getDbResponseDataOrThrow, OmitCreatedAt, supabase } from "@/lib/supabase";
import { byName, Ingredient, IngredientListSection } from "@/types/ingredient";
import {
  byShoppingItemCategoryOrder,
  ShoppingItemCategory,
} from "@/types/shopping/shopping-item-category";

type DBIngredient = OmitCreatedAt<DBRow<"ingredients">>;
type DBOverrideIngredient = Omit<DBIngredient, "user_id" | "base_ingredient_id"> & {
  user_id: string;
  base_ingredient_id: string;
};

const isDBOverrideIngredient = (
  ingredient: DBIngredient,
): ingredient is DBOverrideIngredient => {
  return ingredient.user_id !== null && ingredient.base_ingredient_id !== null;
};

const fromDatabaseToDomain = (dbIngredient: DBIngredient): Ingredient => ({
  id: dbIngredient.id,
  name: dbIngredient.name,
  nameNormalized: dbIngredient.name_normalized,
  category: dbIngredient.category ?? "other",
  tag: dbIngredient.tag,
  userId: dbIngredient.user_id,
  baseIngredientId: dbIngredient.base_ingredient_id,
});

const fromDomainToDatabase = (ingredient: Ingredient): DBIngredient => ({
  id: ingredient.id,
  name: ingredient.name,
  name_normalized: ingredient.nameNormalized,
  category: ingredient.category,
  tag: ingredient.tag,
  user_id: ingredient.userId,
  base_ingredient_id: ingredient.baseIngredientId,
  is_deleted: false,
  updated_at: Temporal.Now.plainDateTimeISO().toString(),
});

const getUserActiveIngredients = async (userId: string): Promise<Ingredient[]> => {
  const dbResponse = await supabase
    .from("ingredients")
    .select("*")
    .or(`user_id.eq.${userId},user_id.is.null`);
  const ingredients = getDbResponseDataOrThrow(dbResponse);

  const baseIngredientIdsOverriden = new Set(
    ingredients.filter((i) => isDBOverrideIngredient(i)).map((i) => i.base_ingredient_id),
  );

  return ingredients
    .filter((i) => !i.is_deleted && !baseIngredientIdsOverriden.has(i.id))
    .map(fromDatabaseToDomain);
};

export const searchIngredient = async (
  userId: string,
  searchTerm: string,
): Promise<Ingredient[]> => {
  const sanitizedSearchTerm = searchTerm.trim().toLowerCase();

  const userIngredients = await getUserActiveIngredients(userId);

  return userIngredients
    .filter((i) => i.nameNormalized.includes(sanitizedSearchTerm))
    .slice(0, 10);
};

export const findIngredientByName = async (
  userId: string,
  name: string,
): Promise<Ingredient | null> => {
  const sanitizedName = name.trim().toLowerCase();

  const userIngredients = await getUserActiveIngredients(userId);

  return userIngredients.find((i) => i.nameNormalized === sanitizedName) ?? null;
};

export const getIngredientSections = async (
  userId: string,
): Promise<IngredientListSection[]> => {
  const ingredients = await getUserActiveIngredients(userId);

  const ingredientsByCategory = ingredients.reduce(
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
      data: items.sort(byName),
    }))
    .sort((a, b) => byShoppingItemCategoryOrder(a.title, b.title));
};

export const upsertIngredient = async (ingredient: Ingredient): Promise<Ingredient> => {
  const dbResponse = await supabase
    .from("ingredients")
    .upsert(fromDomainToDatabase(ingredient))
    .select("*")
    .single();

  const result = getDbResponseDataOrThrow(dbResponse);

  return fromDatabaseToDomain(result);
};

export const deleteIngredient = async (ingredientId: string): Promise<null> => {
  const dbResponse = await supabase.from("ingredients").delete().eq("id", ingredientId);

  return getDbResponseDataOrThrow(dbResponse);
};

export const createIngredientOverride = async (
  userId: string,
  ingredient: Omit<Ingredient, "userId">,
): Promise<Ingredient> => {
  const dbResponse = await supabase
    .from("ingredients")
    .insert(fromDomainToDatabase({ ...ingredient, userId }))
    .select("*")
    .single();

  const result = getDbResponseDataOrThrow(dbResponse);

  return fromDatabaseToDomain(result);
};
