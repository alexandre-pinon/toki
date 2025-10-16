import { SearchBar } from "@/components/SearchBar";
import { ShoppingItemCategorySectionHeader } from "@/components/ShoppingItemCategorySectionHeader";
import { UnderlinedListItem } from "@/components/UnderlinedListItem";
import { useFormIngredient } from "@/contexts/FormIngredientContext";
import { useIngredientList } from "@/contexts/IngredientListContext";
import { colors, typography } from "@/theme";
import { createIngredient, Ingredient, IngredientListSection } from "@/types/ingredient";
import { Ionicons } from "@expo/vector-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { uuid } from "expo-modules-core";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, SectionList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileIngredientsScreen() {
  const { isLoading, refetchIngredients, ingredientSections } = useIngredientList();
  const { setFormIngredient } = useFormIngredient();
  const [filteredIngredientSections, setFilteredIngredientSections] =
    useState<IngredientListSection[]>(ingredientSections);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handlePressIngredient = (ingredient: Ingredient) => {
    setFormIngredient(ingredient);
    router.push({
      pathname: "/recipes/edit/ingredients/edit",
      params: { id: uuid.v4(), from: "profile" }, //FIXME: ideally no recipeId needed here
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAdd = () => {
    setFormIngredient(createIngredient());
    router.push({
      pathname: "/recipes/edit/ingredients/edit",
      params: { id: uuid.v4(), from: "profile" }, //FIXME: ideally no recipeId needed here
    });
  };

  useEffect(() => {
    const filterIngredientSections = async (query: string) => {
      if (query.length === 0) {
        setFilteredIngredientSections(ingredientSections);
        return;
      }

      const filtered = [...ingredientSections]
        .map((section) => ({
          title: section.title,
          data: section.data.filter((ingredient) =>
            ingredient.nameNormalized.includes(debouncedSearchTerm.toLowerCase()),
          ),
        }))
        .filter((section) => section.data.length > 0);

      setFilteredIngredientSections(filtered);
    };

    filterIngredientSections(debouncedSearchTerm);
  }, [debouncedSearchTerm, ingredientSections]);

  const displaySearchResults = () => {
    return (
      <SectionList
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetchIngredients} tintColor={colors.primary200} />
        }
        sections={filteredIngredientSections}
        renderItem={({ item, section, index }) => (
          <TouchableOpacity onPress={() => handlePressIngredient(item)} style={styles.ingredientItemContainer}>
            <UnderlinedListItem title={item.name} isLastItem={index === section.data.length - 1} />
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => <ShoppingItemCategorySectionHeader category={title} />}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Ingrédients",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} disabled={isLoading} style={styles.headerButton}>
              <Ionicons name="chevron-back" size={28} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleAdd} style={styles.headerButton}>
              <Ionicons name="add" size={28} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <SearchBar query={{ value: searchTerm, set: setSearchTerm }} />
      {displaySearchResults()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    rowGap: 20,
  },
  ingredientItemContainer: {
    paddingLeft: 24,
  },
  headerButton: {
    marginLeft: 3,
  },
});
