import { useRecipes } from "@/hooks/useRecipes";
import type { Recipe } from "@/types/recipe/recipe";
import type { RecipeType } from "@/types/recipe/recipe-type";
import { mapRecipeTypeToName, recipeTypes } from "@/types/recipe/recipe-type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../theme";
import { Loader } from "./Loader";
import { RecipeCard } from "./RecipeCard";

export function RecipeList() {
  const { recipes, isLoading, error } = useRecipes();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<RecipeType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchQuery, selectedType]);

  const filterRecipes = () => {
    let filtered = [...recipes];

    if (searchQuery) {
      filtered = filtered.filter((recipe) => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((recipe) => recipe.type === selectedType);
    }

    setFilteredRecipes(filtered);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (recipes.length === 0) {
    return <RecipePlaceholder text="Vous n'avez pas encore de recettes ! 🍳" />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      {showFilters ? <FilterBar selectedType={selectedType} setSelectedType={setSelectedType} /> : null}
      {filteredRecipes.length > 0 ? (
        <FlatList
          data={filteredRecipes}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => router.push({ pathname: "/recipes/[recipeId]", params: { recipeId: item.id } })}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <RecipePlaceholder text="Aucune recette trouvée ! 🍳" />
      )}
    </View>
  );
}

const RecipePlaceholder = ({ text }: { text: string }) => {
  return (
    <View style={styles.centerContainer}>
      <Text style={[typography.body, styles.emptyText]}>{text}</Text>
    </View>
  );
};

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
};
const SearchBar = ({ searchQuery, setSearchQuery, showFilters, setShowFilters }: SearchBarProps) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, typography.body]}
          placeholder="Rechercher..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.gray}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="filter" size={20} color={colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type FilterBarProps = {
  selectedType: RecipeType | "all";
  setSelectedType: (type: RecipeType | "all") => void;
};
const FilterBar = ({ selectedType, setSelectedType }: FilterBarProps) => {
  return (
    <View style={styles.filterContainer}>
      <FlatList
        horizontal
        data={["all", ...recipeTypes]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, selectedType === item && styles.filterChipSelected]}
            onPress={() => setSelectedType(item as RecipeType | "all")}
          >
            <Text
              style={[
                typography.subtext,
                styles.filterChipText,
                selectedType === item && styles.filterChipTextSelected,
              ]}
            >
              {item === "all" ? "tous" : mapRecipeTypeToName(item as RecipeType)}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.gray,
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray300,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.black,
    fontSize: 16,
  },
  filterButton: {
    paddingLeft: 12,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterChipSelected: {
    backgroundColor: colors.primary400,
  },
  filterChipText: {
    color: colors.black,
    textTransform: "capitalize",
  },
  filterChipTextSelected: {
    color: colors.white,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
});
