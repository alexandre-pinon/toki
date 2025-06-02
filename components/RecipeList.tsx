import { RecipeCard } from "@/components/RecipeCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipeService } from "@/services/recipe";
import type { Recipe } from "@/types/recipe/recipe";
import type { RecipeType } from "@/types/recipe/recipe-type";
import { recipeTypes } from "@/types/recipe/recipe-type";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, typography } from "../theme";

export function RecipeList() {
  const { session } = useAuth();
  const { getRecipes } = useRecipeService();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<RecipeType | "all">("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    loadRecipes(session.user.id);
  }, [session]);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchQuery, selectedType]);

  const loadRecipes = async (userId: string) => {
    try {
      setIsLoading(true);
      const data = await getRecipes(userId);
      setRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((recipe) => recipe.type === selectedType);
    }

    setFilteredRecipes(filtered);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[typography.body, styles.emptyText]}>
          Vous n'avez pas encore de recettes ! 🍳
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, typography.body]}
          placeholder="Rechercher une recette..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.grey}
        />
      </View>
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={["all", ...recipeTypes]}
          renderItem={({ item }) => (
            <Text
              style={[
                styles.filterChip,
                typography.subtext,
                selectedType === item && styles.filterChipSelected,
              ]}
              onPress={() => setSelectedType(item as RecipeType | "all")}
            >
              {item === "all" ? "Tous" : item}
            </Text>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>
      <FlatList
        data={filteredRecipes}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
  },
  emptyText: {
    color: colors.grey,
    textAlign: "center",
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    color: colors.text.primary,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    color: colors.background,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
});
