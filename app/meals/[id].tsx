import { Loader } from "@/components/Loader";
import { RecipeHeader } from "@/components/RecipeHeader";
import { RecipeInfo } from "@/components/RecipeInfo";
import { RecipeIngredientList } from "@/components/RecipeIngredientList";
import { RecipeInstructionList } from "@/components/RecipeInstructionList";
import { RecipeTabName, RecipeTabs } from "@/components/RecipeTabs";
import { useCurrentMeal } from "@/contexts/CurrentMealContext";
import { colors } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MealScreen() {
  const { currentMeal, currentRecipe, incrementServings, decrementServings, deleteCurrentMeal, isLoading } =
    useCurrentMeal();
  const [tab, setTab] = useState<RecipeTabName>("instructions");

  if (isLoading || !currentMeal || !currentRecipe) return <Loader />;

  const { recipe, ingredients, instructions } = currentRecipe;

  const displayActiveTab = () => {
    switch (tab) {
      case "ingredients":
        return (
          <RecipeIngredientList
            ingredients={ingredients}
            quantityCoefficient={currentMeal.servings / currentRecipe.recipe.servings}
          />
        );
      case "instructions":
        return <RecipeInstructionList instructions={instructions} />;
    }
  };

  const onDelete = () => {
    Alert.alert(
      "Supprimer le repas",
      "Êtes-vous sûr de vouloir supprimer ce repas ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteCurrentMeal();
            router.back();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView>
        <RecipeHeader id={recipe.id} imageUrl={recipe.imageUrl} />
        <RecipeInfo
          recipe={recipe}
          meal={currentMeal}
          incrementServings={incrementServings}
          decrementServings={decrementServings}
        />
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
