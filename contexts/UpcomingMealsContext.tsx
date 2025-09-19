import { useAuth } from "@/contexts/AuthContext";
import { getUpcomingMeals, updateDate } from "@/services/meal";
import { MealWithRecipe } from "@/types/weekly-meals/meal";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useShoppingList } from "./ShoppingListContext";

type UpcomingMealsContextType = {
  upcomingMeals: MealWithRecipe[];
  isLoading: boolean;
  refetchUpcomingMeals: (options?: { skipLoading: boolean }) => Promise<void>;
  updateMealDate: (id: string, date: Temporal.PlainDate) => Promise<void>;
};

const UpcomingMealsContext = createContext<UpcomingMealsContextType | null>(null);

export const UpcomingMealsProvider = ({ children }: PropsWithChildren) => {
  const { loadShoppingList } = useShoppingList();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingMeals, setUpcomingMeals] = useState<MealWithRecipe[]>([]);

  const getUserUpcomingMeals = useCallback(
    async (options?: { skipLoading: boolean }) => {
      if (!session?.user.id) {
        setUpcomingMeals([]);
        return;
      }

      try {
        setIsLoading(!options?.skipLoading);
        const meals = await getUpcomingMeals(session.user.id);
        setUpcomingMeals(meals);
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user.id],
  );

  const updateMealDate = useCallback(
    async (id: string, date: Temporal.PlainDate) => {
      try {
        // setIsLoading(true);
        await updateDate(id, date);
        await Promise.all([getUserUpcomingMeals({ skipLoading: true }), loadShoppingList()]);
      } finally {
        // setIsLoading(false);
      }
    },
    [getUserUpcomingMeals, loadShoppingList],
  );

  useEffect(() => {
    getUserUpcomingMeals();
  }, [getUserUpcomingMeals]);

  const contextValue = useMemo(
    () => ({
      upcomingMeals,
      isLoading,
      refetchUpcomingMeals: getUserUpcomingMeals,
      updateMealDate,
    }),
    [upcomingMeals, isLoading, getUserUpcomingMeals, updateMealDate],
  );

  return <UpcomingMealsContext.Provider value={contextValue}>{children}</UpcomingMealsContext.Provider>;
};

export const useUpcomingMeals = () => {
  const context = useContext(UpcomingMealsContext);
  if (!context) {
    throw new Error("useUpcomingMeals must be used within a UpcomingMealsProvider");
  }
  return context;
};
