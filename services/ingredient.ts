import { getDbResponseDataOrThrow, supabase } from "@/lib/supabase";
import { Ingredient } from "@/types/ingredient";

export const searchIngredient = async (searchTerm: string): Promise<Ingredient[]> => {
  const sanitizedSearchTerm = searchTerm.trim().toLowerCase();
  const ingredients = getDbResponseDataOrThrow(
    await supabase.from("ingredients").select("*").like("name_normalized", `%${sanitizedSearchTerm}%`).limit(10),
  );

  return ingredients.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    category: ingredient.category ?? "other",
  }));
};
