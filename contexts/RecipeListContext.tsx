import { useAuth } from "@/contexts/AuthContext";
import { deleteRecipe, getRecipes, upsertRecipe } from "@/services/recipe";
import { createEmptyRecipeData, type Recipe } from "@/types/recipe/recipe";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useShoppingList } from "./ShoppingListContext";
import { useUpcomingMeals } from "./UpcomingMealsContext";

type RecipeListContextType = {
  recipes: Recipe[];
  isLoading: boolean;
  isAddRecipeLoading: boolean;
  refetchRecipes: (options?: { skipLoading: boolean }) => Promise<void>;
  createNewRecipe: () => Promise<{ newRecipeId: string }>;
  deleteUserRecipe: (id: string) => Promise<void>;
};

const RecipeListContext = createContext<RecipeListContextType | null>(null);

export const RecipeListProvider = ({ children }: PropsWithChildren) => {
  const { loadShoppingList } = useShoppingList();
  const { refetchUpcomingMeals } = useUpcomingMeals();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddRecipeLoading, setIsAddRecipeLoading] = useState(false);
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
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user.id],
  );

  const createNewRecipe = useCallback(async () => {
    try {
      setIsAddRecipeLoading(true);
      const newRecipeData = createEmptyRecipeData();
      await upsertRecipe(newRecipeData);
      await getUserRecipes();
      return { newRecipeId: newRecipeData.recipe.id };
    } finally {
      setIsAddRecipeLoading(false);
    }
  }, [getUserRecipes]);

  const deleteUserRecipe = useCallback(
    async (id: string) => {
      await deleteRecipe(id);
      await Promise.all([getUserRecipes({ skipLoading: true }), refetchUpcomingMeals(), loadShoppingList()]);
    },
    [getUserRecipes, refetchUpcomingMeals, loadShoppingList],
  );

  useEffect(() => {
    getUserRecipes();
  }, [getUserRecipes]);

  const contextValue = useMemo(
    () => ({
      recipes,
      isLoading,
      isAddRecipeLoading,
      refetchRecipes: getUserRecipes,
      createNewRecipe,
      deleteUserRecipe,
    }),
    [recipes, isLoading, isAddRecipeLoading, getUserRecipes, createNewRecipe, deleteUserRecipe],
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
