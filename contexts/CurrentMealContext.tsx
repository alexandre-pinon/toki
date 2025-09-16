import { deleteMeal, getMealById, updateServings } from "@/services/meal";
import { useRecipeService } from "@/services/recipe";
import { Meal } from "@/types/menu/meal";
import { RecipeDetails } from "@/types/recipe/recipe";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

type CurrentMealContextType = {
  currentMeal: Meal | null;
  currentRecipe: RecipeDetails | null;
  isLoading: boolean;
  updateCurrentMealServings: (servings: number) => Promise<Meal>;
  deleteCurrentMeal: () => Promise<void>;
};

const CurrentMealContext = createContext<CurrentMealContextType | null>(null);

type CurrentMealProviderProps = PropsWithChildren & {
  id: string;
};
export const CurrentMealProvider = ({ id, children }: CurrentMealProviderProps) => {
  const { getRecipeById } = useRecipeService();
  const [isLoading, setIsLoading] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<RecipeDetails | null>(null);

  const getMealWithRecipe = useCallback(async () => {
    try {
      setIsLoading(true);
      const [meal, recipe] = await Promise.all([getMealById(id), getRecipeById(id)]);
      setCurrentMeal(meal);
      setCurrentRecipe(recipe);
    } finally {
      setIsLoading(false);
    }
  }, [id, getRecipeById]);

  const deleteCurrentMeal = useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteMeal(id);
      await refetchMeals();
    } finally {
      setIsLoading(false);
    }
  }, [id, refetchMeals]);

  useEffect(() => {
    getMealWithRecipe();
  }, [getMealWithRecipe]);

  const contextValue = useMemo(() => {
    return {
      currentMeal,
      currentRecipe,
      isLoading,
      updateCurrentMealServings: (servings: number) => updateServings(id, servings),
      deleteCurrentMeal,
    };
  }, [id, currentMeal, currentRecipe, isLoading, deleteCurrentMeal]);

  return <CurrentMealContext.Provider value={contextValue}>{children}</CurrentMealContext.Provider>;
};

export const useCurrentMeal = () => {
  const context = useContext(CurrentMealContext);
  if (!context) {
    throw new Error("useCurrentMeal must be used within a CurrentMealProvider");
  }
  return context;
};
