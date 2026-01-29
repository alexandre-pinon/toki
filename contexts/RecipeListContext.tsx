import { useAuth } from "@/contexts/AuthContext";
import { deleteRecipe, getRecipes } from "@/services/recipe";
import { type Recipe } from "@/types/recipe/recipe";
import { isNetworkError, showNetworkErrorAlert } from "@/utils/network-error";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useShoppingList } from "./ShoppingListContext";
import { useUpcomingMeals } from "./UpcomingMealsContext";

type RecipeListContextType = {
  recipes: Recipe[];
  isLoading: boolean;
  refetchRecipes: (options?: { skipLoading: boolean }) => Promise<void>;
  deleteUserRecipe: (id: string) => Promise<void>;
};

const RecipeListContext = createContext<RecipeListContextType | null>(null);

export const RecipeListProvider = ({ children }: PropsWithChildren) => {
  const { refetchShoppingList } = useShoppingList();
  const { refetchUpcomingMeals } = useUpcomingMeals();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const getUserRecipes = useCallback(
    async (options?: { skipLoading: boolean }) => {
      if (!session?.user.id) {
        setRecipes([]);
        return;
      }

      try {
        setIsLoading(!options?.skipLoading);
        const recipes = await getRecipes(session.user.id);
        setRecipes(recipes);
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

  const deleteUserRecipe = useCallback(
    async (id: string) => {
      try {
        await deleteRecipe(id);
        await Promise.all([getUserRecipes({ skipLoading: true }), refetchUpcomingMeals(), refetchShoppingList()]);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        showNetworkErrorAlert();
      }
    },
    [getUserRecipes, refetchUpcomingMeals, refetchShoppingList],
  );

  useEffect(() => {
    getUserRecipes();
  }, [getUserRecipes]);

  const contextValue = useMemo(
    () => ({
      recipes,
      isLoading,
      refetchRecipes: getUserRecipes,
      deleteUserRecipe,
    }),
    [recipes, isLoading, getUserRecipes, deleteUserRecipe],
  );

  return <RecipeListContext.Provider value={contextValue}>{children}</RecipeListContext.Provider>;
};

export const useRecipeList = () => {
  const context = useContext(RecipeListContext);
  if (!context) {
    throw new Error("useRecipeList must be used within a RecipeListProvider");
  }
  return context;
};
