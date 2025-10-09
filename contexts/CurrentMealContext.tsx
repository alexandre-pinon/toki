import { getMealById, updateServings } from "@/services/meal";
import { getRecipeById } from "@/services/recipe";
import { RecipeDetails } from "@/types/recipe/recipe";
import { Meal } from "@/types/weekly-meals/meal";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useShoppingList } from "./ShoppingListContext";

type CurrentMealContextType = {
  currentMeal: Meal | null;
  currentRecipe: RecipeDetails | null;
  isLoading: boolean;
  incrementServings: () => void;
  decrementServings: () => void;
};

const CurrentMealContext = createContext<CurrentMealContextType | null>(null);

type CurrentMealProviderProps = PropsWithChildren & {
  id: string;
};
export const CurrentMealProvider = ({ id, children }: CurrentMealProviderProps) => {
  const { refetchShoppingList } = useShoppingList();
  const [isLoading, setIsLoading] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<RecipeDetails | null>(null);
  const [servingsPendingUpdates, setServingsPendingUpdates] = useState<("increment" | "decrement")[]>([]);
  const [isProcessingServingsUpdate, setIsProcessingServingsUpdate] = useState(false);

  const getMealWithRecipe = useCallback(async () => {
    try {
      setIsLoading(true);
      const meal = await getMealById(id);
      const recipe = await getRecipeById(meal.recipeId);
      setCurrentMeal(meal);
      setCurrentRecipe(recipe);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const incrementServings = useCallback(() => {
    setCurrentMeal((prev) => {
      if (!prev) return null;
      return { ...prev, servings: prev.servings + 1 };
    });
    if (currentMeal) {
      setServingsPendingUpdates((prev) => [...prev, "increment"]);
    }
  }, [currentMeal]);

  const decrementServings = useCallback(() => {
    setCurrentMeal((prev) => {
      if (!prev) return null;
      return { ...prev, servings: Math.max(1, prev.servings - 1) };
    });
    if (currentMeal && currentMeal.servings > 1) {
      setServingsPendingUpdates((prev) => [...prev, "decrement"]);
    }
  }, [currentMeal]);

  const processServingsUpdates = useCallback(async () => {
    if (!currentMeal || !(servingsPendingUpdates.length > 0) || isProcessingServingsUpdate) {
      return;
    }

    const nextPendingUpdate = servingsPendingUpdates[0];
    try {
      setIsProcessingServingsUpdate(true);
      await updateServings(currentMeal.id, currentMeal.servings);
    } catch {
      setCurrentMeal((prev) => {
        if (!prev) return null;
        return { ...prev, servings: prev.servings - (nextPendingUpdate === "increment" ? 1 : -1) };
      });
    } finally {
      setServingsPendingUpdates((prev) => prev.slice(1));
      setIsProcessingServingsUpdate(false);
    }

    await refetchShoppingList();
  }, [currentMeal, isProcessingServingsUpdate, servingsPendingUpdates, refetchShoppingList]);

  useEffect(() => {
    getMealWithRecipe();
  }, [getMealWithRecipe]);

  useEffect(() => {
    processServingsUpdates();
  }, [processServingsUpdates]);

  const contextValue = useMemo(() => {
    return {
      currentMeal,
      currentRecipe,
      isLoading,
      incrementServings,
      decrementServings,
    };
  }, [currentMeal, currentRecipe, isLoading, incrementServings, decrementServings]);

  return <CurrentMealContext.Provider value={contextValue}>{children}</CurrentMealContext.Provider>;
};

export const useCurrentMeal = () => {
  const context = useContext(CurrentMealContext);
  if (!context) {
    throw new Error("useCurrentMeal must be used within a CurrentMealProvider");
  }
  return context;
};
