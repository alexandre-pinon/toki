import { useRecipeList } from "@/contexts/RecipeListContext";
import { colors, commonStyles, typography } from "@/theme";
import type { Recipe } from "@/types/recipe/recipe";
import type { RecipeType } from "@/types/recipe/recipe-type";
import { mapRecipeTypeToName, recipeTypes } from "@/types/recipe/recipe-type";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { RecipeCard } from "./RecipeCard";
import { SearchBar } from "./SearchBar";
import { SwipeableItem } from "./SwipeableItem";

type RecipeListProps = {
  onPressRecipe: (recipe: Recipe) => void;
};
export function RecipeList({ onPressRecipe }: RecipeListProps) {
  const { recipes, deleteUserRecipe, isLoading, refetchRecipes } = useRecipeList();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<RecipeType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = [...recipes];

    if (searchQuery) {
      filtered = filtered.filter((recipe) => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((recipe) => recipe.type === selectedType);
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchQuery, selectedType]);

  const handleDeleteRecipe = useCallback(
    (recipeId: string, swipeable?: SwipeableMethods) => {
      Alert.alert(
        "Supprimer la recette",
        "Êtes-vous sûr de vouloir supprimer cette recette ?",
        [
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => {
              swipeable?.close();
            },
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              await deleteUserRecipe(recipeId);
            },
          },
        ],
        { cancelable: true },
      );
    },
    [deleteUserRecipe],
  );

  const renderItem = ({ item }: ListRenderItemInfo<Recipe>) => {
    return (
      <Animated.View style={[styles.recipeContainer, { boxShadow: commonStyles.boxShadow }]} entering={SlideInLeft}>
        <SwipeableItem
          onDelete={(swipeable) => handleDeleteRecipe(item.id, swipeable)}
          actionsStyles={{ borderRadius: 12 }}
        >
          <RecipeCard recipe={item} onPress={() => onPressRecipe(item)} />
        </SwipeableItem>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        query={{ value: searchQuery, set: setSearchQuery }}
        filters={{ value: showFilters, set: setShowFilters }}
      />
      {showFilters ? <FilterBar selectedType={selectedType} setSelectedType={setSelectedType} /> : null}
      {!isLoading && recipes.length === 0 ? (
        <RecipePlaceholder text="Vous n'avez pas encore de recettes ! 🍳" />
      ) : !isLoading && filteredRecipes.length === 0 ? (
        <RecipePlaceholder text="Aucune recette trouvée ! 🍳" />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetchRecipes} tintColor={colors.primary200} />
          }
          data={filteredRecipes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
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
  recipeContainer: {
    borderRadius: 12,
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
