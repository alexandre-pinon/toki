import { useRecipeService } from "@/services/recipe";
import { Ingredient } from "@/types/ingredient";
import { RecipeDetails, RecipeUpsertData } from "@/types/recipe/recipe";
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState, useTransition } from "react";

type FormRecipeIngredient = RecipeUpsertData["ingredients"][number] & {
  readonly name: string;
  readonly category: Ingredient["category"];
};

type FormRecipeContextType = {
  formRecipe: RecipeUpsertData["recipe"];
  setFormRecipe: Dispatch<SetStateAction<FormRecipeContextType["formRecipe"]>>;
  formIngredients: FormRecipeIngredient[];
  setFormIngredients: Dispatch<SetStateAction<FormRecipeContextType["formIngredients"]>>;
  formInstructions: RecipeUpsertData["instructions"];
  setFormInstructions: Dispatch<SetStateAction<FormRecipeContextType["formInstructions"]>>;
  formCurrentIngredient: FormRecipeIngredient | null;
  setFormCurrentIngredient: Dispatch<SetStateAction<FormRecipeContextType["formCurrentIngredient"]>>;
  isLoading: boolean;
  upsertRecipe: () => void;
  resetForm: () => void;
};

const FormRecipeContext = createContext<FormRecipeContextType | null>(null);

type FormRecipeProviderProps = PropsWithChildren & {
  initialRecipeValues: RecipeDetails;
};
export const FormRecipeProvider = ({ initialRecipeValues, children }: FormRecipeProviderProps) => {
  const { upsertRecipe } = useRecipeService();
  const { recipe, ingredients, instructions } = initialRecipeValues;

  const [formRecipe, setFormRecipe] = useState<FormRecipeContextType["formRecipe"]>(recipe);
  const [formIngredients, setFormIngredients] = useState<FormRecipeContextType["formIngredients"]>(ingredients);
  const [formInstructions, setFormInstructions] = useState(instructions);
  const [formCurrentIngredient, setFormCurrentIngredient] =
    useState<FormRecipeContextType["formCurrentIngredient"]>(null);
  const [isLoading, startTransition] = useTransition();

  const resetForm = () => {
    setFormRecipe(recipe);
    setFormIngredients(ingredients);
    setFormInstructions(instructions);
    setFormCurrentIngredient(null);
  };

  return (
    <FormRecipeContext.Provider
      value={{
        formRecipe,
        setFormRecipe,
        formIngredients,
        setFormIngredients,
        formInstructions,
        setFormInstructions,
        formCurrentIngredient,
        setFormCurrentIngredient,
        isLoading,
        upsertRecipe: () =>
          startTransition(() =>
            upsertRecipe({
              recipe: formRecipe,
              ingredients: formIngredients,
              instructions: formInstructions,
            }),
          ),
        resetForm,
      }}
    >
      {children}
    </FormRecipeContext.Provider>
  );
};

export const useFormRecipe = () => {
  const context = useContext(FormRecipeContext);
  if (!context) {
    throw new Error("useFormRecipe must be used within a FormRecipeProvider");
  }
  return context;
};
