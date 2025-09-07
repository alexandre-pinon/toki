import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { RecipeDetails } from "../types/recipe/recipe";
import { RecipeHeader } from "./RecipeHeader";
import { RecipeInfo } from "./RecipeInfo";
import { RecipeIngredientList } from "./RecipeIngredientList";
import { RecipeInstructionList } from "./RecipeInstructionList";
import { RecipeTabName, RecipeTabs } from "./RecipeTabs";

type RecipeContentProps = {
  recipeDetails: RecipeDetails;
  servings: number;
};

export function RecipeContent({ recipeDetails, servings }: RecipeContentProps) {
  const { recipe, ingredients, instructions } = recipeDetails;
  const [tab, setTab] = useState<RecipeTabName>("instructions");

  const displayActiveTab = () => {
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
      <RecipeTabs tab={tab} setTab={setTab} />
      <View style={styles.tabsContainer}>{displayActiveTab()}</View>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  tabsContainer: {
    padding: 24,
  },
});
