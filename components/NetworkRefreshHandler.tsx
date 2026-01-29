import { useIngredientList } from "@/contexts/IngredientListContext";
import { useNetwork } from "@/contexts/NetworkContext";
import { useRecipeList } from "@/contexts/RecipeListContext";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { useUpcomingMeals } from "@/contexts/UpcomingMealsContext";
import { useEffect, useRef } from "react";

export function NetworkRefreshHandler() {
  const { showReconnectedBanner } = useNetwork();
  const { refetchShoppingList } = useShoppingList();
  const { refetchUpcomingMeals } = useUpcomingMeals();
  const { refetchRecipes } = useRecipeList();
  const { refetchIngredients } = useIngredientList();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    // Refresh all data when reconnected (only once per reconnection)
    if (showReconnectedBanner && !hasRefreshed.current) {
      hasRefreshed.current = true;
      Promise.all([
        refetchShoppingList(),
        refetchUpcomingMeals({ skipLoading: true }),
        refetchRecipes({ skipLoading: true }),
        refetchIngredients(),
      ]);
    }

    // Reset the flag when banner goes away
    if (!showReconnectedBanner) {
      hasRefreshed.current = false;
    }
  }, [showReconnectedBanner, refetchShoppingList, refetchUpcomingMeals, refetchRecipes, refetchIngredients]);

  return null;
}
