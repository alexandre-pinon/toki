import { ScrollView } from "react-native";
import type { RecipeDetails } from "../types/recipe/recipe";
import { RecipeHeader } from "./RecipeHeader";
import { RecipeInfo } from "./RecipeInfo";
import { RecipeTab, RecipeTabs } from "./RecipeTabs";

type RecipeContentProps = {
  recipeDetails: RecipeDetails;
  tab: RecipeTab;
  onTabChange: (tab: RecipeTab) => void;
  servings: number;
};

export function RecipeContent({ recipeDetails, tab, onTabChange, servings }: RecipeContentProps) {
  const { recipe, ingredients, instructions } = recipeDetails;

  return (
    <ScrollView>
      <RecipeHeader imageUrl={recipe.imageUrl} />
      <RecipeInfo
        name={recipe.name}
        timesDone={recipe.timesDone}
        lastTimeDone={recipe.lastTimeDone}
        type={recipe.type}
        servings={servings}
        preparationTime={recipe.preparationTime}
        cookingTime={recipe.cookingTime}
      />
      <RecipeTabs
        tab={tab}
        onTabChange={onTabChange}
        instructions={instructions}
        ingredients={ingredients}
      />
    </ScrollView>
  );
}
