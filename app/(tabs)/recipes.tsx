import { RecipeList } from "@/components/RecipeList";
import { useRecipeList } from "@/contexts/RecipeListContext";
import { colors, typography } from "@/theme";
import { Recipe } from "@/types/recipe/recipe";
import { Ionicons } from "@expo/vector-icons";
import { uuid } from "expo-modules-core";
import { router, Stack } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipesScreen() {
  const { isAddRecipeLoading } = useRecipeList();

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
          headerRight: () =>
            isAddRecipeLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
                <Ionicons name="add" size={24} color={colors.primary} style={styles.addButtonIcon} />
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
    padding: 8,
  },
  addButtonIcon: {
    marginRight: 8,
  },
  loadingContainer: {
    marginRight: 16,
  },
});
