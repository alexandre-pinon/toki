import { useAuth } from "@/contexts/AuthContext";
import { useRecipeService } from "@/services/recipe";
import type { Recipe } from "@/types/recipe/recipe";
import {
  createContext,
  PropsWithChildren,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useMemo,
} from "react";

type RecipeListContextType = {
  recipes: Recipe[];
  isLoading: boolean;
  refetch: () => void;
};

const RecipeListContext = createContext<RecipeListContextType | null>(null);

export const RecipeListProvider = ({ children }: PropsWithChildren) => {
  const { session } = useAuth();
  const { getRecipes } = useRecipeService();

  const [recipes, getUserRecipes, isLoading] = useActionState<Recipe[]>(() => {
    if (!session?.user?.id) {
      return [];
    }
    return getRecipes(session.user.id);
  }, []);

  useEffect(() => {
    startTransition(getUserRecipes);
  }, [session?.user?.id, getUserRecipes]);

  const contextValue = useMemo(
    () => ({
      recipes,
      isLoading,
      refetch: () => startTransition(getUserRecipes),
    }),
    [recipes, isLoading, getUserRecipes],
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
