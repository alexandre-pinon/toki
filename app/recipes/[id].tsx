import { Loader } from "@/components/Loader";
import { RecipeHeader } from "@/components/RecipeHeader";
import { RecipeInfo } from "@/components/RecipeInfo";
import { RecipeIngredientList } from "@/components/RecipeIngredientList";
import { RecipeInstructionList } from "@/components/RecipeInstructionList";
import { RecipeTabName, RecipeTabs } from "@/components/RecipeTabs";
import { useCurrentRecipe } from "@/contexts/CurrentRecipeContext";
import { colors } from "@/theme";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeDetailsScreen() {
  const { currentRecipe, isLoading } = useCurrentRecipe();
  const [tab, setTab] = useState<RecipeTabName>("ingredients");

  if (isLoading || !currentRecipe) return <Loader />;

  const { recipe, ingredients, instructions } = currentRecipe;

  const displayActiveTab = () => {
    switch (tab) {
      case "ingredients":
        return <RecipeIngredientList ingredients={ingredients} />;
      case "instructions":
        return <RecipeInstructionList instructions={instructions} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView>
        <RecipeHeader id={recipe.id} imageUrl={recipe.imageUrl} />
        <RecipeInfo recipe={recipe} />
        <RecipeTabs tab={tab} setTab={setTab} />
        <View style={styles.tabsContainer}>{displayActiveTab()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabsContainer: {
    padding: 24,
  },
});
