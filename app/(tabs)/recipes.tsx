import { RecipeList } from "@/components/RecipeList";
import { useRecipeList } from "@/contexts/RecipeListContext";
import { colors, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipesScreen() {
  const { isAddRecipeLoading, createNewRecipe } = useRecipeList();

  const handleAddRecipe = async () => {
    const { newRecipeId } = await createNewRecipe();
    router.push({
      pathname: "../recipes/edit/[id]",
      params: { id: newRecipeId },
    });
  };

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
        <RecipeList
          onPressRecipe={(recipe) => router.push({ pathname: "../recipes/[id]", params: { id: recipe.id } })}
        />
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
  },
  addButton: {
    padding: 8,
  },
  addButtonIcon: {
    height: 24,
    width: 24,
    marginRight: 8,
  },
  loadingContainer: {
    marginRight: 16,
  },
});
