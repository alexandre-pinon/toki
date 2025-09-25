import { Loader } from "@/components/Loader";
import { SearchBar } from "@/components/SearchBar";
import { ShoppingItemCategorySectionHeader } from "@/components/ShoppingItemCategorySectionHeader";
import { UnderlinedListItem } from "@/components/UnderlinedListItem";
import { useFormIngredient } from "@/contexts/FormIngredientContext";
import { useIngredientList } from "@/contexts/IngredientListContext";
import { colors } from "@/theme";
import { Ingredient, IngredientListSection } from "@/types/ingredient";
import { useDebounce } from "@uidotdev/usehooks";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileIngredientsScreen() {
  const { isLoading, ingredientSections } = useIngredientList();
  const { setFormIngredient } = useFormIngredient();
  const [filteredIngredientSections, setFilteredIngredientSections] =
    useState<IngredientListSection[]>(ingredientSections);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handlePressIngredient = (ingredient: Ingredient) => {
    setFormIngredient(ingredient);
    router.push({ pathname: "./ingredients/edit" });
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
    if (isLoading) {
      return <Loader />;
    }

    return (
      <SectionList
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
});
