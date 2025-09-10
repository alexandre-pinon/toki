import { RecipeTabName } from "@/components/RecipeTabs";
import { useRecipeService } from "@/services/recipe";
import { RecipeDetails, RecipeIngredient, RecipeUpsertData } from "@/types/recipe/recipe";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useCurrentRecipe } from "./CurrentRecipeContext";
import { useRecipeList } from "./RecipeListContext";

type FormRecipeContextType = {
  formRecipe: RecipeUpsertData["recipe"];
  setFormRecipe: Dispatch<SetStateAction<FormRecipeContextType["formRecipe"]>>;
  formIngredients: Omit<RecipeIngredient, "recipeId">[];
  setFormIngredients: Dispatch<SetStateAction<FormRecipeContextType["formIngredients"]>>;
  formInstructions: RecipeUpsertData["instructions"];
  setFormInstructions: Dispatch<SetStateAction<FormRecipeContextType["formInstructions"]>>;
  formCurrentIngredient: Omit<RecipeIngredient, "recipeId"> | null;
  setFormCurrentIngredient: Dispatch<SetStateAction<FormRecipeContextType["formCurrentIngredient"]>>;
  formCurrentInstruction: { value: string; index: number } | null;
  setFormCurrentInstruction: Dispatch<SetStateAction<FormRecipeContextType["formCurrentInstruction"]>>;
  activeTab: RecipeTabName;
  setActiveTab: Dispatch<SetStateAction<FormRecipeContextType["activeTab"]>>;
  isLoading: boolean;
  upsertRecipe: (callBack?: () => void) => void;
};

const FormRecipeContext = createContext<FormRecipeContextType | null>(null);

type FormRecipeProviderProps = PropsWithChildren & {
  initialRecipeValues: RecipeDetails;
};
export const FormRecipeProvider = ({ initialRecipeValues, children }: FormRecipeProviderProps) => {
  const { refetch: refetchRecipeList } = useRecipeList();
  const { refetch: refetchCurrentRecipe } = useCurrentRecipe();
  const { upsertRecipe } = useRecipeService();
  const { recipe, ingredients, instructions } = initialRecipeValues;

  const [formRecipe, setFormRecipe] = useState<FormRecipeContextType["formRecipe"]>(recipe);
  const [formIngredients, setFormIngredients] = useState<FormRecipeContextType["formIngredients"]>(ingredients);
  const [formInstructions, setFormInstructions] = useState(instructions);
  const [formCurrentIngredient, setFormCurrentIngredient] =
    useState<FormRecipeContextType["formCurrentIngredient"]>(null);
  const [formCurrentInstruction, setFormCurrentInstruction] =
    useState<FormRecipeContextType["formCurrentInstruction"]>(null);
  const [activeTab, setActiveTab] = useState<RecipeTabName>("ingredients");
  const [isLoading, startTransition] = useTransition();

  const contextValue = useMemo(
    () => ({
      formRecipe,
      setFormRecipe,
      formIngredients,
      setFormIngredients,
      formInstructions,
      setFormInstructions,
      formCurrentIngredient,
      setFormCurrentIngredient,
      formCurrentInstruction,
      setFormCurrentInstruction,
      activeTab,
      setActiveTab,
      isLoading,
      upsertRecipe: () =>
        startTransition(async () => {
          await upsertRecipe({
            recipe: formRecipe,
            ingredients: formIngredients,
            instructions: formInstructions,
          });
          refetchCurrentRecipe();
          refetchRecipeList();
        }),
    }),
    [
      formRecipe,
      formIngredients,
      formInstructions,
      formCurrentIngredient,
      formCurrentInstruction,
      activeTab,
      isLoading,
      upsertRecipe,
      refetchCurrentRecipe,
      refetchRecipeList,
    ],
  );

  return <FormRecipeContext.Provider value={contextValue}>{children}</FormRecipeContext.Provider>;
};

export const useFormRecipe = () => {
  const context = useContext(FormRecipeContext);
  if (!context) {
    throw new Error("useFormRecipe must be used within a FormRecipeProvider");
  }
  return context;
};
