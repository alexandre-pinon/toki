import {
  emptyFilters,
  hasActiveFilters,
  RecipeFilters,
} from "@/types/recipe/recipe-filter";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type RecipeFilterContextType = {
  filters: RecipeFilters;
  setFilters: Dispatch<SetStateAction<RecipeFilters>>;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

const RecipeFilterContext = createContext<RecipeFilterContextType | null>(null);

export const RecipeFilterProvider = ({ children }: PropsWithChildren) => {
  const [filters, setFilters] = useState<RecipeFilters>(emptyFilters);

  const clearFilters = useCallback(() => {
    setFilters(emptyFilters);
  }, []);

  const contextValue = useMemo(
    () => ({
      filters,
      setFilters,
      clearFilters,
      hasActiveFilters: hasActiveFilters(filters),
    }),
    [filters, clearFilters],
  );

  return (
    <RecipeFilterContext.Provider value={contextValue}>
      {children}
    </RecipeFilterContext.Provider>
  );
};

export const useRecipeFilter = () => {
  const context = useContext(RecipeFilterContext);
  if (!context) {
    throw new Error("useRecipeFilter must be used within a RecipeFilterProvider");
  }
  return context;
};
