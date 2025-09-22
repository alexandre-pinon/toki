import { IngredientListItem } from "@/components/IngredientListItem";
import { Loader } from "@/components/Loader";
import { SearchBar } from "@/components/SearchBar";
import { ShoppingItemCategorySectionHeader } from "@/components/ShoppingItemCategorySectionHeader";
import { useIngredientList } from "@/contexts/IngredientListContext";
import { colors } from "@/theme";
import { useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileIngredientsScreen() {
  const { isLoading, ingredientSections } = useIngredientList();
  const [searchTerm, setSearchTerm] = useState("");

  const displaySearchResults = () => {
    if (isLoading) {
      return <Loader />;
    }

    return (
      <SectionList
        sections={ingredientSections}
        renderItem={({ item, section, index }) => (
          <View style={styles.ingredientItemContainer}>
            <IngredientListItem {...item} isLastItem={index === section.data.length - 1} />
          </View>
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
