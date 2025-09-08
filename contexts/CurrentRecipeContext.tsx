import { useRecipeService } from "@/services/recipe";
import { RecipeDetails } from "@/types/recipe/recipe";
import { createContext, PropsWithChildren, startTransition, useActionState, useContext, useEffect } from "react";

type CurrentRecipeContextType = {
  currentRecipe: RecipeDetails | null;
  isLoading: boolean;
  refetch: () => void;
};

const CurrentRecipeContext = createContext<CurrentRecipeContextType | null>(null);

type CurrentRecipeProviderProps = PropsWithChildren & {
  recipeId: string;
};
export const CurrentRecipeProvider = ({ recipeId, children }: CurrentRecipeProviderProps) => {
  const { getRecipeById } = useRecipeService();

  const [currentRecipe, getCurrentRecipe, isLoading] = useActionState<RecipeDetails | null>(
    () => getRecipeById(recipeId),
    null,
  );

  useEffect(() => {
    startTransition(getCurrentRecipe);
  }, [recipeId, getCurrentRecipe]);

  return (
    <CurrentRecipeContext.Provider
      value={{
        currentRecipe,
        isLoading,
        refetch: () => startTransition(getCurrentRecipe),
      }}
    >
      {children}
    </CurrentRecipeContext.Provider>
  );
};

export const useCurrentRecipe = () => {
  const context = useContext(CurrentRecipeContext);
  if (!context) {
    throw new Error("useCurrentRecipe must be used within a CurrentRecipeProvider");
  }
  return context;
};
