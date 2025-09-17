import { useAuth } from "@/contexts/AuthContext";
import { getUpcomingMeals } from "@/services/meal";
import { MealWithRecipe } from "@/types/weekly-meals/meal";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

type UpcomingMealsContextType = {
  upcomingMeals: MealWithRecipe[];
  isLoading: boolean;
  refetchUpcomingMeals: () => Promise<void>;
};

const UpcomingMealsContext = createContext<UpcomingMealsContextType | null>(null);

export const UpcomingMealsProvider = ({ children }: PropsWithChildren) => {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingMeals, setUpcomingMeals] = useState<MealWithRecipe[]>([]);

  const getUserUpcomingMeals = useCallback(async () => {
    if (!session?.user.id) {
      setUpcomingMeals([]);
      return;
    }

    try {
      setIsLoading(true);
      const meals = await getUpcomingMeals(session.user.id);
      setUpcomingMeals(meals);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user.id]);

  useEffect(() => {
    getUserUpcomingMeals();
  }, [getUserUpcomingMeals]);

  const contextValue = useMemo(
    () => ({
      upcomingMeals,
      isLoading,
      refetchUpcomingMeals: getUserUpcomingMeals,
    }),
    [upcomingMeals, isLoading, getUserUpcomingMeals],
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
