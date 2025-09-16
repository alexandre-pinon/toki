import { useAuth } from "@/contexts/AuthContext";
import { getRecipes, upsertRecipe } from "@/services/recipe";
import { createEmptyRecipeData, type Recipe } from "@/types/recipe/recipe";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

type RecipeListContextType = {
  recipes: Recipe[];
  isLoading: boolean;
  isAddRecipeLoading: boolean;
  refetchRecipes: () => Promise<void>;
  createNewRecipe: () => Promise<{ newRecipeId: string }>;
};

const RecipeListContext = createContext<RecipeListContextType | null>(null);

export const RecipeListProvider = ({ children }: PropsWithChildren) => {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddRecipeLoading, setIsAddRecipeLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const getUserRecipes = useCallback(async () => {
    if (!session?.user.id) {
      setRecipes([]);
      return;
    }

    try {
      setIsLoading(true);
      const recipes = await getRecipes(session.user.id);
      setRecipes(recipes);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user.id]);

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
    }),
    [recipes, isLoading, isAddRecipeLoading, getUserRecipes, createNewRecipe],
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
