import { useRecipeService } from "@/services/recipe";
import { RecipeDetails, RecipeUpsertData } from "@/types/recipe/recipe";
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState, useTransition } from "react";

type FormRecipeContextType = {
  formRecipe: RecipeUpsertData["recipe"];
  setFormRecipe: Dispatch<SetStateAction<FormRecipeContextType["formRecipe"]>>;
  formIngredients: (RecipeUpsertData["ingredients"][number] & { readonly name: string })[];
  setFormIngredients: Dispatch<SetStateAction<FormRecipeContextType["formIngredients"]>>;
  formInstructions: RecipeUpsertData["instructions"];
  setFormInstructions: Dispatch<SetStateAction<FormRecipeContextType["formInstructions"]>>;
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
  const [isLoading, startTransition] = useTransition();

  const resetForm = () => {
    setFormRecipe(recipe);
    setFormIngredients(ingredients);
    setFormInstructions(instructions);
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
