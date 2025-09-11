import { useRecipeService } from "@/services/recipe";
import { RecipeDetails } from "@/types/recipe/recipe";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRecipeList } from "./RecipeListContext";

type CurrentRecipeContextType = {
  currentRecipe: RecipeDetails | null;
  isLoading: boolean;
  refetchCurrentRecipe: () => Promise<void>;
  deleteCurrentRecipe: () => Promise<void>;
};

const CurrentRecipeContext = createContext<CurrentRecipeContextType | null>(null);

type CurrentRecipeProviderProps = PropsWithChildren & {
  id: string;
};
export const CurrentRecipeProvider = ({ id, children }: CurrentRecipeProviderProps) => {
  const { refetchRecipes } = useRecipeList();
  const { getRecipeById, deleteRecipe } = useRecipeService();
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<RecipeDetails | null>(null);

  const getCurrentRecipe = useCallback(async () => {
    try {
      setIsLoading(true);
      const recipe = await getRecipeById(id);
      setCurrentRecipe(recipe);
    } finally {
      setIsLoading(false);
    }
  }, [id, getRecipeById]);

  const deleteCurrentRecipe = useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteRecipe(id);
      await refetchRecipes();
    } finally {
      setIsLoading(false);
    }
  }, [id, deleteRecipe, refetchRecipes]);

  useEffect(() => {
    getCurrentRecipe();
  }, [getCurrentRecipe]);

  const contextValue = useMemo(() => {
    return {
      currentRecipe,
      isLoading,
      refetchCurrentRecipe: getCurrentRecipe,
      deleteCurrentRecipe,
    };
  }, [currentRecipe, isLoading, getCurrentRecipe, deleteCurrentRecipe]);

  return <CurrentRecipeContext.Provider value={contextValue}>{children}</CurrentRecipeContext.Provider>;
};

export const useCurrentRecipe = () => {
  const context = useContext(CurrentRecipeContext);
  if (!context) {
    throw new Error("useCurrentRecipe must be used within a CurrentRecipeProvider");
  }
  return context;
};
