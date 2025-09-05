import { LoadingOverlay } from "@/components/LoadingOverlay";
import { RecipeContent } from "@/components/RecipeContent";
import { RecipeError } from "@/components/RecipeError";
import { RecipeTabName } from "@/components/RecipeIngredientList";
import { useRecipeDetails } from "@/hooks/useRecipeDetails";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme";

export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipeDetails, isLoading, error } = useRecipeDetails(id);
  const [tab, setTab] = useState<RecipeTabName>("instructions");

  if (error || (!isLoading && !recipeDetails)) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <RecipeError error={error} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {recipeDetails && (
        <RecipeContent
          recipeDetails={recipeDetails}
          tab={tab}
          onTabChange={setTab}
          servings={recipeDetails.recipe.servings}
        />
      )}
      <LoadingOverlay visible={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
