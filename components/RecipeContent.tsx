import { ScrollView, StyleSheet, View } from "react-native";
import type { RecipeDetails } from "../types/recipe/recipe";
import { RecipeHeader } from "./RecipeHeader";
import { RecipeInfo } from "./RecipeInfo";
import { RecipeIngredientList } from "./RecipeIngredientList";
import { RecipeTabName, RecipeTabs } from "./RecipeTabs";
import { RecipeInstructionList } from "./RecipeInstructionList";

type RecipeContentProps = {
  recipeDetails: RecipeDetails;
  tab: RecipeTabName;
  onTabChange: (tab: RecipeTabName) => void;
  servings: number;
};

export function RecipeContent({ recipeDetails, tab, onTabChange, servings }: RecipeContentProps) {
  const { recipe, ingredients, instructions } = recipeDetails;

  const showActiveTab = () => {
    switch (tab) {
      case "ingredients":
        return <RecipeIngredientList ingredients={ingredients} />;
      case "instructions":
        return <RecipeInstructionList instructions={instructions} />;
    }
  };

  return (
    <ScrollView>
      <RecipeHeader imageUrl={recipe.imageUrl} recipeId={recipe.id} />
      <RecipeInfo
        name={recipe.name}
        timesDone={recipe.timesDone}
        lastTimeDone={recipe.lastTimeDone}
        type={recipe.type}
        servings={servings}
        preparationTime={recipe.preparationTime}
        cookingTime={recipe.cookingTime}
        restTime={recipe.restTime}
      />
      <RecipeTabs tab={tab} onTabChange={onTabChange} />
      <View style={styles.tabsContainer}>{showActiveTab()}</View>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  tabsContainer: {
    padding: 24,
  },
});
