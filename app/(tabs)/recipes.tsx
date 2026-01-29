import { RecipeList } from "@/components/RecipeList";
import { colors, typography } from "@/theme";
import { Recipe } from "@/types/recipe/recipe";
import { uuid } from "expo-modules-core";
import { router, Stack } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipesScreen() {
  const handleAddRecipe = async () => {
    router.push({
      pathname: "/recipes/edit/[id]",
      params: { id: uuid.v4() },
    });
  };

  const handlePressRecipe = useCallback((recipe: Recipe) => {
    router.push({ pathname: "/recipes/[id]", params: { id: recipe.id } });
  }, []);

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
              <Text style={[typography.body, styles.addButtonText]}>Ajouter</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <RecipeList onPressRecipe={handlePressRecipe} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingBottom: 48,
  },
  addButton: {
    paddingRight: 16,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: 300,
  },
  loadingContainer: {
    marginRight: 16,
  },
});
