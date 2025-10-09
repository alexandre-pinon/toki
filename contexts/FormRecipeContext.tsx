import { RecipeTabName } from "@/components/RecipeTabs";
import { upsertRecipe } from "@/services/recipe";
import { parseMarmitonRecipe } from "@/services/recipe-parser";
import {
  createEmptyRecipeData,
  FormRecipeIngredient,
  RecipeDetails,
  RecipeIngredient,
  RecipeUpsertData,
} from "@/types/recipe/recipe";
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
import { useCurrentRecipe } from "./CurrentRecipeContext";
import { useRecipeList } from "./RecipeListContext";
import { useShoppingList } from "./ShoppingListContext";
import { useUpcomingMeals } from "./UpcomingMealsContext";

type FormRecipeContextType = {
  formRecipe: RecipeUpsertData["recipe"];
  setFormRecipe: Dispatch<SetStateAction<FormRecipeContextType["formRecipe"]>>;
  formIngredients: FormRecipeIngredient[];
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
  upsertRecipe: () => void;
  areAllIngredientsValid: boolean;
  importUrl: string;
  setImportUrl: Dispatch<SetStateAction<string>>;
  importRecipe: () => void;
};

const FormRecipeContext = createContext<FormRecipeContextType | null>(null);

type FormRecipeProviderProps = PropsWithChildren & {
  initialRecipeValues: RecipeDetails | null;
  recipeId: string;
};
export const FormRecipeProvider = ({ initialRecipeValues, recipeId, children }: FormRecipeProviderProps) => {
  const { refetchShoppingList } = useShoppingList();
  const { refetchUpcomingMeals } = useUpcomingMeals();
  const { refetchRecipes } = useRecipeList();
  const { refetchCurrentRecipe } = useCurrentRecipe();
  const { recipe, ingredients, instructions } = initialRecipeValues ?? createEmptyRecipeData(recipeId);
  const [isLoading, setIsLoading] = useState(false);

  const [formRecipe, setFormRecipe] = useState<FormRecipeContextType["formRecipe"]>(recipe);
  const [formIngredients, setFormIngredients] = useState<FormRecipeContextType["formIngredients"]>(ingredients);
  const [formInstructions, setFormInstructions] = useState(instructions);
  const [formCurrentIngredient, setFormCurrentIngredient] =
    useState<FormRecipeContextType["formCurrentIngredient"]>(null);
  const [formCurrentInstruction, setFormCurrentInstruction] =
    useState<FormRecipeContextType["formCurrentInstruction"]>(null);
  const [activeTab, setActiveTab] = useState<RecipeTabName>("ingredients");
  const [importUrl, setImportUrl] = useState("");

  const areAllIngredientsValid = useMemo(() => {
    const ingredientsWithId = formIngredients.filter((i): i is Omit<RecipeIngredient, "recipeId"> => !!i.ingredientId);
    return ingredientsWithId.length === formIngredients.length;
  }, [formIngredients]);

  const importRecipe = useCallback(async () => {
    if (!importUrl) return;

    try {
      setIsLoading(true);
      const res = await fetch(importUrl);
      const html = await res.text();
      const { recipe, ingredients, instructions } = await parseMarmitonRecipe(formRecipe.id, html);
      setFormRecipe(recipe);
      setFormIngredients(ingredients);
      setFormInstructions(instructions);
    } finally {
      setIsLoading(false);
    }
  }, [formRecipe.id, importUrl]);

  const upsertFormRecipe = useCallback(async () => {
    const ingredientsWithId = formIngredients.filter((i): i is Omit<RecipeIngredient, "recipeId"> => !!i.ingredientId);
    if (ingredientsWithId.length !== formIngredients.length) {
      return;
    }

    try {
      setIsLoading(true);
      await upsertRecipe({
        recipe: formRecipe,
        ingredients: ingredientsWithId,
        instructions: formInstructions,
      });
      await Promise.all([refetchCurrentRecipe(), refetchRecipes(), refetchUpcomingMeals(), refetchShoppingList()]);
    } finally {
      setIsLoading(false);
    }
  }, [
    formRecipe,
    formIngredients,
    formInstructions,
    refetchCurrentRecipe,
    refetchRecipes,
    refetchUpcomingMeals,
    refetchShoppingList,
  ]);

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
      upsertRecipe: upsertFormRecipe,
      areAllIngredientsValid,
      importUrl,
      setImportUrl,
      importRecipe,
    }),
    [
      formRecipe,
      formIngredients,
      formInstructions,
      formCurrentIngredient,
      formCurrentInstruction,
      activeTab,
      isLoading,
      upsertFormRecipe,
      areAllIngredientsValid,
      importUrl,
      importRecipe,
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
