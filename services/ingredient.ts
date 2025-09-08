import { supabase } from "@/lib/supabase";
import { Ingredient } from "@/types/ingredient";

export function useIngredientService() {
  const searchIngredient = async (searchTerm: string): Promise<Ingredient[]> => {
    const { data, error } = await supabase.from("ingredients").select("*").textSearch("name", searchTerm).limit(10);

    if (error) {
      throw error;
    }

    return data.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category ?? "other",
    }));
  };

  return {
    searchIngredient,
  };
}
