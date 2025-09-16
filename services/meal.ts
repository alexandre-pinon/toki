import { DBRow, getDbResponseDataOrThrow, OmitDBTimestamps, supabase } from "@/lib/supabase";
import { Meal, MealCreateData, MealWithRecipe } from "@/types/menu/meal";

const fromDatabaseToDomain = (dbMeal: OmitDBTimestamps<DBRow<"meals">>): Meal => ({
  id: dbMeal.id,
  recipeId: dbMeal.recipe_id,
  date: Temporal.PlainDate.from(dbMeal.date),
  servings: dbMeal.servings,
  userId: dbMeal.user_id,
});

export const getUpcomingMeals = async (userId: string): Promise<MealWithRecipe[]> => {
  const today = Temporal.Now.plainDateISO().toString();

  const dbMeals = getDbResponseDataOrThrow(
    await supabase
      .from("meals")
      .select(
        `
        id,
        recipe_id,
        date,
        servings,
        user_id,
        recipes (
          id,
          name,
          type,
          image_url
        )
      `,
      )
      .eq("user_id", userId)
      .gte("date", today)
      .order("date")
      .order("recipes(name)"),
  );

  return dbMeals.map((dbMeal) => ({
    ...fromDatabaseToDomain(dbMeal),
    recipe: {
      id: dbMeal.recipes.id,
      name: dbMeal.recipes.name,
      type: dbMeal.recipes.type,
      imageUrl: dbMeal.recipes.image_url ?? undefined,
    },
  }));
};

export const createMeal = async (data: MealCreateData): Promise<Meal> => {
  const dbMeal = getDbResponseDataOrThrow(
    await supabase
      .from("meals")
      .insert({
        recipe_id: data.recipeId,
        date: data.date.toString(),
        servings: data.servings,
        updated_at: Temporal.Now.plainDateTimeISO().toString(),
      })
      .select("*")
      .single(),
  );

  return fromDatabaseToDomain(dbMeal);
};

export const getMealById = async (id: string): Promise<Meal> => {
  const dbMeal = getDbResponseDataOrThrow(await supabase.from("meals").select("*").eq("id", id).single());

  return fromDatabaseToDomain(dbMeal);
};

export const updateServings = async (id: string, servings: number): Promise<Meal> => {
  const dbMeal = getDbResponseDataOrThrow(
    await supabase.from("meals").update({ servings }).eq("id", id).select("*").single(),
  );

  //TODO: handle shopping list items update

  return fromDatabaseToDomain(dbMeal);
};

export const deleteMeal = async (id: string): Promise<void> => {
  getDbResponseDataOrThrow(await supabase.from("meals").delete().eq("id", id));
};
