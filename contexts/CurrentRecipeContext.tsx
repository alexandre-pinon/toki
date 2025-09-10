import { useRecipeService } from "@/services/recipe";
import { RecipeDetails } from "@/types/recipe/recipe";
import {
  createContext,
  PropsWithChildren,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useMemo,
} from "react";

type CurrentRecipeContextType = {
  currentRecipe: RecipeDetails | null;
  isLoading: boolean;
  refetch: () => void;
};

const CurrentRecipeContext = createContext<CurrentRecipeContextType | null>(null);

type CurrentRecipeProviderProps = PropsWithChildren & {
  id: string;
};
export const CurrentRecipeProvider = ({ id, children }: CurrentRecipeProviderProps) => {
  const { getRecipeById } = useRecipeService();

  const [currentRecipe, getCurrentRecipe, isLoading] = useActionState<RecipeDetails | null>(
    () => getRecipeById(id),
    null,
  );

  useEffect(() => {
    startTransition(getCurrentRecipe);
  }, [id, getCurrentRecipe]);

  const contextValue = useMemo(() => {
    return {
      currentRecipe,
      isLoading,
      refetch: () => startTransition(getCurrentRecipe),
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
