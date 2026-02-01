import { useAuth } from "@/contexts/AuthContext";
import { createIngredientOverride, upsertIngredient } from "@/services/ingredient";
import { Ingredient, isBaseIngredient } from "@/types/ingredient";
import { isNetworkError, showNetworkErrorAlert } from "@/utils/network-error";
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
  upsertIngredient: () => Promise<Ingredient | null>;
};

const FormIngredientContext = createContext<FormIngredientContextType | null>(null);

type FormIngredientProviderProps = PropsWithChildren;
export const FormIngredientProvider = ({ children }: FormIngredientProviderProps) => {
  const { session } = useAuth();
  const { refetchIngredients } = useIngredientList();
  const [isLoading, setIsLoading] = useState(false);

  const [formIngredient, setFormIngredient] = useState<Ingredient | null>(null);

  const upsertFormIngredient = useCallback(async () => {
    if (!formIngredient || !session) {
      return null;
    }

    try {
      setIsLoading(true);

      const toUpsert: Ingredient = {
        ...formIngredient,
        name: formIngredient.name.trim().toLowerCase(),
      };

      let upserted: Ingredient;
      if (isBaseIngredient(toUpsert)) {
        upserted = await createIngredientOverride(session.user.id, toUpsert);
      } else {
        upserted = await upsertIngredient(toUpsert);
      }

      await refetchIngredients();
      setIsLoading(false);

      return upserted;
    } catch (error) {
      setIsLoading(false);
      if (isNetworkError(error)) {
        showNetworkErrorAlert();
        return null;
      }
      if (error instanceof PostgrestError && error.code === "23505") {
        Alert.alert(`L'ingrédient '${formIngredient.name}' existe déjà`);
        return formIngredient;
      }
      throw error;
    }
  }, [formIngredient, session, refetchIngredients]);

  const contextValue = useMemo(
    () => ({
      formIngredient,
      setFormIngredient,
      isLoading,
      upsertIngredient: upsertFormIngredient,
    }),
    [formIngredient, isLoading, upsertFormIngredient],
  );

  return (
    <FormIngredientContext.Provider value={contextValue}>
      {children}
    </FormIngredientContext.Provider>
  );
};

export const useFormIngredient = () => {
  const context = useContext(FormIngredientContext);
  if (!context) {
    throw new Error("useFormIngredient must be used within a FormIngredientProvider");
  }
  return context;
};
