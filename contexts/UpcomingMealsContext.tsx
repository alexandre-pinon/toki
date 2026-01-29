import { useAuth } from "@/contexts/AuthContext";
import { deleteMeal, getUpcomingMeals, updateDate } from "@/services/meal";
import { MealWithRecipe } from "@/types/weekly-meals/meal";
import { isNetworkError, showNetworkErrorAlert } from "@/utils/network-error";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useShoppingList } from "./ShoppingListContext";

type UpcomingMealsContextType = {
  upcomingMeals: MealWithRecipe[];
  isLoading: boolean;
  refetchUpcomingMeals: (options?: { skipLoading: boolean }) => Promise<void>;
  updateMealDate: (id: string, date: Temporal.PlainDate) => Promise<void>;
  deleteUpcomingMeal: (id: string) => Promise<void>;
};

const UpcomingMealsContext = createContext<UpcomingMealsContextType | null>(null);

export const UpcomingMealsProvider = ({ children }: PropsWithChildren) => {
  const { refetchShoppingList } = useShoppingList();
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
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        // Network errors silently ignored (offline banner informs user)
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user.id],
  );

  const updateMealDate = useCallback(
    async (id: string, date: Temporal.PlainDate) => {
      try {
        await updateDate(id, date);
        await Promise.all([getUserUpcomingMeals({ skipLoading: true }), refetchShoppingList()]);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        showNetworkErrorAlert();
      }
    },
    [getUserUpcomingMeals, refetchShoppingList],
  );

  const deleteUpcomingMeal = useCallback(
    async (id: string) => {
      try {
        await deleteMeal(id);
        await Promise.all([getUserUpcomingMeals({ skipLoading: true }), refetchShoppingList()]);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        showNetworkErrorAlert();
      }
    },
    [getUserUpcomingMeals, refetchShoppingList],
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
      deleteUpcomingMeal,
    }),
    [upcomingMeals, isLoading, getUserUpcomingMeals, updateMealDate, deleteUpcomingMeal],
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
