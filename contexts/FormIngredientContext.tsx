import { upsertIngredient } from "@/services/ingredient";
import { Ingredient } from "@/types/ingredient";
import { PostgrestError } from "@supabase/supabase-js";
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
import { Alert } from "react-native";
import { useIngredientList } from "./IngredientListContext";

type FormIngredientContextType = {
  formIngredient: Ingredient | null;
  setFormIngredient: Dispatch<SetStateAction<Ingredient | null>>;
  isLoading: boolean;
  upsertIngredient: () => void;
};

const FormIngredientContext = createContext<FormIngredientContextType | null>(null);

type FormIngredientProviderProps = PropsWithChildren;
export const FormIngredientProvider = ({ children }: FormIngredientProviderProps) => {
  const { refetchIngredients } = useIngredientList();
  const [isLoading, setIsLoading] = useState(false);

  const [formIngredient, setFormIngredient] = useState<Ingredient | null>(null);

  const upsertFormIngredient = useCallback(async () => {
    if (!formIngredient) return;

    try {
      setIsLoading(true);
      await upsertIngredient({ ...formIngredient, name: formIngredient.name.toLowerCase() });
      await refetchIngredients();
    } catch (error) {
      if (error instanceof PostgrestError && error.code === "23505") {
        return Alert.alert(`L'ingrédient '${formIngredient.name}' existe déjà`);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [formIngredient, refetchIngredients]);

  const contextValue = useMemo(
    () => ({
      formIngredient,
      setFormIngredient,
      isLoading,
      upsertIngredient: upsertFormIngredient,
    }),
    [formIngredient, isLoading, upsertFormIngredient],
  );

  return <FormIngredientContext.Provider value={contextValue}>{children}</FormIngredientContext.Provider>;
};

export const useFormIngredient = () => {
  const context = useContext(FormIngredientContext);
  if (!context) {
    throw new Error("useFormIngredient must be used within a FormIngredientProvider");
  }
  return context;
};
