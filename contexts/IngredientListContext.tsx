import { getIngredientSections } from "@/services/ingredient";
import { IngredientListSection } from "@/types/ingredient";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

type IngredientListContextType = {
  ingredientSections: IngredientListSection[];
  isLoading: boolean;
  refetchIngredients: () => Promise<void>;
};

const IngredientListContext = createContext<IngredientListContextType | null>(null);

export const IngredientListProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ingredientSections, setIngredientSections] = useState<IngredientListSection[]>([]);

  const getIngredientListSections = useCallback(async () => {
    try {
      setIsLoading(true);
      const ingredientSections = await getIngredientSections();
      setIngredientSections(ingredientSections);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getIngredientListSections();
  }, [getIngredientListSections]);

  const contextValue = useMemo(
    () => ({
      ingredientSections,
      isLoading,
      refetchIngredients: getIngredientListSections,
    }),
    [ingredientSections, isLoading, getIngredientListSections],
  );

  return <IngredientListContext.Provider value={contextValue}>{children}</IngredientListContext.Provider>;
};

export const useIngredientList = () => {
  const context = useContext(IngredientListContext);
  if (!context) {
    throw new Error("useIngredientList must be used within a IngredientListProvider");
  }
  return context;
};
