import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRecipes } from "../hooks/useRecipes";
import { colors, commonStyles, typography } from "../theme";
import { ArrowTopBottomIcon } from "./icons/ArrowTopBottomIcon";
import { RecipeCard } from "./RecipeCard";

export function StatisticsContent() {
  const { recipes, isLoading, error } = useRecipes();

  const sortedRecipes = useMemo(
    () => [...recipes].sort((a, b) => b.timesDone - a.timesDone),
    [recipes]
  );
  const top3 = useMemo(() => sortedRecipes.slice(0, 3), [sortedRecipes]);
  const bottom3 = useMemo(() => sortedRecipes.slice(-3).reverse(), [sortedRecipes]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={typography.subtitle}>Nombre de recette</Text>
        <Text style={styles.recipeCount}>{recipes.length}</Text>
      </View>

      <View>
        <View style={styles.sectionHeader}>
          <ArrowTopBottomIcon color={colors.success} size={24} direction="up" />
          <Text style={typography.subtitle}>Top 3</Text>
        </View>
        {top3.map((recipe) => (
          <View style={styles.recipeCardWrapper} key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </View>
        ))}
      </View>

      <View>
        <View style={styles.sectionHeader}>
          <ArrowTopBottomIcon color={colors.alert} size={24} direction="down" />
          <Text style={typography.subtitle}>Bottom 3</Text>
        </View>
        {bottom3.map((recipe) => (
          <View style={styles.recipeCardWrapper} key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    boxShadow: commonStyles.boxShadow,
  },
  recipeCount: {
    ...typography.headlineMedium,
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  recipeCardWrapper: {
    marginBottom: 16,
  },
});
