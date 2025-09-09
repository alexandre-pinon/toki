import { supabase } from "@/lib/supabase";
import { Ingredient } from "@/types/ingredient";
import { useCallback } from "react";

export function useIngredientService() {
  const searchIngredient = useCallback(async (searchTerm: string): Promise<Ingredient[]> => {
    const sanitizedSearchTerm = searchTerm.trim().toLowerCase();
    const { data, error } = await supabase
      .from("ingredients")
      .select("*")
      .like("name_normalized", `%${sanitizedSearchTerm}%`)
      .limit(10);

    if (error) {
      throw error;
    }

    return data.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category ?? "other",
    }));
  }, []);

  return {
    searchIngredient,
  };
}
