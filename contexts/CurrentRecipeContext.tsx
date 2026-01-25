import { findRecipeById } from "@/services/recipe";
import { RecipeDetails } from "@/types/recipe/recipe";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

type CurrentRecipeContextType = {
  currentRecipe: RecipeDetails | null;
  isLoading: boolean;
  refetchCurrentRecipe: () => Promise<void>;
};

const CurrentRecipeContext = createContext<CurrentRecipeContextType | null>(null);

type CurrentRecipeProviderProps = PropsWithChildren & {
  id: string;
};
export const CurrentRecipeProvider = ({ id, children }: CurrentRecipeProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<RecipeDetails | null>(null);

  const getCurrentRecipe = useCallback(async () => {
    try {
      setIsLoading(true);
      const recipe = await findRecipeById(id);
      setCurrentRecipe(recipe);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getCurrentRecipe();
  }, [getCurrentRecipe]);

  const contextValue = useMemo(() => {
    return {
      currentRecipe,
      isLoading,
      refetchCurrentRecipe: getCurrentRecipe,
    };
  }, [currentRecipe, isLoading, getCurrentRecipe]);

  return <CurrentRecipeContext.Provider value={contextValue}>{children}</CurrentRecipeContext.Provider>;
};

export const useCurrentRecipe = () => {
  const context = useContext(CurrentRecipeContext);
  if (!context) {
    throw new Error("useCurrentRecipe must be used within a CurrentRecipeProvider");
  }
  return context;
};
