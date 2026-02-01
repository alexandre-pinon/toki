import { DBRow, getDbResponseDataOrThrow, OmitDBTimestamps, supabase } from "@/lib/supabase";
import { Ingredient, IngredientListSection } from "@/types/ingredient";
import { byShoppingItemCategoryOrder, ShoppingItemCategory } from "@/types/shopping/shopping-item-category";

type DBIngredient = OmitDBTimestamps<DBRow<"ingredients">> & {
  user_id: string | null;
  base_ingredient_id: string | null;
  is_deleted: boolean;
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

/**
 * Get effective ingredients for a user:
 * - User's own ingredients (not deleted)
 * - User's overrides of base ingredients (not deleted)
 * - Base ingredients that haven't been overridden by this user
 */
const getEffectiveIngredients = async (userId: string): Promise<Ingredient[]> => {
  // 1. Get user's ingredients (own + overrides, not deleted)
  const userIngredients = getDbResponseDataOrThrow(
    await supabase
      .from("ingredients")
      .select("*")
      .eq("user_id", userId)
      .eq("is_deleted", false),
  ) as DBIngredient[];

  // 2. Get IDs of base ingredients that user has overridden
  const overriddenBaseIds = userIngredients
    .filter((i) => i.base_ingredient_id !== null)
    .map((i) => i.base_ingredient_id as string);

  // 3. Get base ingredients not overridden by user
  let baseQuery = supabase.from("ingredients").select("*").is("user_id", null);

  if (overriddenBaseIds.length > 0) {
    baseQuery = baseQuery.not("id", "in", `(${overriddenBaseIds.join(",")})`);
  }

  const baseIngredients = getDbResponseDataOrThrow(await baseQuery) as DBIngredient[];

  // 4. Merge and return
  return [...userIngredients, ...baseIngredients].map(fromDatabaseToDomain);
};

export const searchIngredient = async (userId: string, searchTerm: string): Promise<Ingredient[]> => {
  const sanitizedSearchTerm = searchTerm.trim().toLowerCase();

  // Get all effective ingredients and filter by search term
  const allIngredients = await getEffectiveIngredients(userId);

  return allIngredients
    .filter((i) => i.nameNormalized.includes(sanitizedSearchTerm))
    .slice(0, 10);
};

export const findIngredientByName = async (userId: string, name: string): Promise<Ingredient | null> => {
  const sanitizedName = name.trim().toLowerCase();

  // Get all effective ingredients and find exact match
  const allIngredients = await getEffectiveIngredients(userId);

  return allIngredients.find((i) => i.nameNormalized === sanitizedName) ?? null;
};

export const getIngredientSections = async (userId: string): Promise<IngredientListSection[]> => {
  const ingredients = await getEffectiveIngredients(userId);

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
      data: items.sort((a, b) => a.nameNormalized.localeCompare(b.nameNormalized)),
    }))
    .sort((a, b) => byShoppingItemCategoryOrder(a.title, b.title));
};

export const upsertIngredient = async (ingredient: Ingredient): Promise<Ingredient> => {
  const result = getDbResponseDataOrThrow(
    await supabase
      .from("ingredients")
      .upsert({
        id: ingredient.id,
        name: ingredient.name,
        name_normalized: ingredient.nameNormalized,
        category: ingredient.category,
        tag: ingredient.tag,
        user_id: ingredient.userId,
        base_ingredient_id: ingredient.baseIngredientId,
        updated_at: Temporal.Now.plainDateTimeISO().toString(),
      })
      .select("*")
      .single(),
  ) as DBIngredient;

  return fromDatabaseToDomain(result);
};

export const deleteIngredient = async (ingredientId: string): Promise<void> => {
  getDbResponseDataOrThrow(
    await supabase.from("ingredients").delete().eq("id", ingredientId),
  );
};

/**
 * Create an override of a base ingredient for a user.
 * This copies the base ingredient's values and links it via base_ingredient_id.
 * The recipe migration trigger will automatically update the user's recipes.
 */
export const createIngredientOverride = async (
  userId: string,
  baseIngredient: Ingredient,
  overrides?: Partial<Pick<Ingredient, "name" | "category" | "tag">>,
): Promise<Ingredient> => {
  const result = getDbResponseDataOrThrow(
    await supabase
      .from("ingredients")
      .insert({
        name: overrides?.name ?? baseIngredient.name,
        name_normalized: (overrides?.name ?? baseIngredient.name).trim().toLowerCase(),
        category: overrides?.category ?? baseIngredient.category,
        tag: overrides?.tag ?? baseIngredient.tag,
        user_id: userId,
        base_ingredient_id: baseIngredient.id,
        updated_at: Temporal.Now.plainDateTimeISO().toString(),
      })
      .select("*")
      .single(),
  ) as DBIngredient;

  return fromDatabaseToDomain(result);
};

/**
 * Soft-delete a base ingredient for a user.
 * Creates an override with is_deleted = true.
 */
export const hideBaseIngredient = async (userId: string, baseIngredientId: string): Promise<void> => {
  getDbResponseDataOrThrow(
    await supabase.from("ingredients").insert({
      name: "hidden", // Required field, but won't be displayed
      name_normalized: `hidden_${baseIngredientId}`,
      user_id: userId,
      base_ingredient_id: baseIngredientId,
      is_deleted: true,
      updated_at: Temporal.Now.plainDateTimeISO().toString(),
    }),
  );
};
