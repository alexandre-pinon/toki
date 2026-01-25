import { useIngredientList } from "@/contexts/IngredientListContext";
import { useRecipeFilter } from "@/contexts/RecipeFilterContext";
import { useRecipeList } from "@/contexts/RecipeListContext";
import { getRecipeIngredients } from "@/services/recipe";
import { colors, commonStyles, typography } from "@/theme";
import { Ingredient, IngredientTag } from "@/types/ingredient";
import type { Recipe, RecipeIngredient } from "@/types/recipe/recipe";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, ListRenderItemInfo, RefreshControl, StyleSheet, Text, View } from "react-native";
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
  const { filters, hasActiveFilters } = useRecipeFilter();
  const { ingredientSections } = useIngredientList();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipeIngredientsCache, setRecipeIngredientsCache] = useState<Map<string, RecipeIngredient[]>>(new Map());

  // Create a map of ingredient id to ingredient for quick lookup
  const ingredientMap = useMemo(() => {
    const map = new Map<string, Ingredient>();
    ingredientSections.forEach((section) => {
      section.data.forEach((ingredient) => {
        map.set(ingredient.id, ingredient);
      });
    });
    return map;
  }, [ingredientSections]);

  // Load recipe ingredients when ingredient tag filters are active
  useEffect(() => {
    const loadRecipeIngredients = async () => {
      if (filters.cerealTags.length === 0 && filters.proteinTags.length === 0) {
        return;
      }

      const recipesToLoad = recipes.filter((r) => !recipeIngredientsCache.has(r.id));
      if (recipesToLoad.length === 0) return;

      const newCache = new Map(recipeIngredientsCache);
      await Promise.all(
        recipesToLoad.map(async (recipe) => {
          try {
            const ingredients = await getRecipeIngredients(recipe.id);
            newCache.set(recipe.id, ingredients);
          } catch {
            newCache.set(recipe.id, []);
          }
        }),
      );
      setRecipeIngredientsCache(newCache);
    };

    loadRecipeIngredients();
  }, [recipes, filters.cerealTags.length, filters.proteinTags.length, recipeIngredientsCache]);

  // Check if a recipe has any ingredient with the given tags
  const recipeHasIngredientTag = useCallback(
    (recipeId: string, tags: IngredientTag[]): boolean => {
      if (tags.length === 0) return true;

      const ingredients = recipeIngredientsCache.get(recipeId);
      if (!ingredients) return true; // Don't filter out if we haven't loaded ingredients yet

      return ingredients.some((ri) => {
        const ingredient = ingredientMap.get(ri.ingredientId);
        return ingredient?.tag && tags.includes(ingredient.tag);
      });
    },
    [recipeIngredientsCache, ingredientMap],
  );

  useEffect(() => {
    let filtered = [...recipes];

    if (searchQuery) {
      filtered = filtered.filter((recipe) => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (filters.types.length > 0) {
      filtered = filtered.filter((recipe) => filters.types.includes(recipe.type));
    }

    if (filters.cerealTags.length > 0) {
      filtered = filtered.filter((recipe) => recipeHasIngredientTag(recipe.id, filters.cerealTags));
    }

    if (filters.proteinTags.length > 0) {
      filtered = filtered.filter((recipe) => recipeHasIngredientTag(recipe.id, filters.proteinTags));
    }

    if (filters.lastDone) {
      const now = Temporal.Now.plainDateISO();
      const threeMonthsAgo = now.subtract({ months: 3 });
      const oneMonthAgo = now.subtract({ months: 1 });

      switch (filters.lastDone) {
        case "more_than_3_months":
          filtered = filtered.filter(
            (r) => !r.lastTimeDone || Temporal.PlainDate.compare(r.lastTimeDone, threeMonthsAgo) < 0,
          );
          break;
        case "more_than_1_month":
          filtered = filtered.filter(
            (r) => !r.lastTimeDone || Temporal.PlainDate.compare(r.lastTimeDone, oneMonthAgo) < 0,
          );
          break;
        case "less_than_1_month":
          filtered = filtered.filter(
            (r) => r.lastTimeDone && Temporal.PlainDate.compare(r.lastTimeDone, oneMonthAgo) >= 0,
          );
          break;
      }
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchQuery, filters, recipeHasIngredientTag]);

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

  const handleFilterPress = useCallback(() => {
    router.push("/recipes/filters");
  }, []);

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
        onFilterPress={handleFilterPress}
        hasActiveFilters={hasActiveFilters}
      />
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
});
