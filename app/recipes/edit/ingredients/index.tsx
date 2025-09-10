import { Loader } from "@/components/Loader";
import { SearchBar } from "@/components/SearchBar";
import { UnderlinedListItem } from "@/components/UnderlinedListItem";
import { useFormRecipe } from "@/contexts/FormRecipeContext";
import { useIngredientService } from "@/services/ingredient";
import { colors, typography } from "@/theme";
import { Ingredient } from "@/types/ingredient";
import { useDebounce } from "@uidotdev/usehooks";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeEditIngredientScreen() {
  const { setFormCurrentIngredient } = useFormRecipe();
  const { searchIngredient } = useIngredientService();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const performSearch = async (query: string) => {
      if (query.length === 0) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchIngredient(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        throw new Error("Error searching ingredients");
      } finally {
        setIsLoading(false);
      }
    };

    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchIngredient]);

  const displaySearchResults = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (debouncedSearchTerm === "") {
      return (
        <View style={styles.centerContainer}>
          <Image source={require("@/assets/images/groceries.png")} style={styles.image} />
          <Text style={[typography.body, styles.imageText]}>Rechercher un ingrédient</Text>
        </View>
      );
    }

    if (results.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Image source={require("@/assets/images/empty-cart.png")} style={styles.image} />
          <Text style={[typography.body, styles.imageText]}>Aucun ingrédient trouvé</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setFormCurrentIngredient({ ingredientId: item.id, name: item.name, category: item.category });
              router.push({ pathname: "./ingredients/quantity" });
            }}
          >
            <UnderlinedListItem title={item.name} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar query={{ value: searchTerm, set: setSearchTerm }} autoFocus />
      {displaySearchResults()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
  },
  imageText: {
    color: colors.gray500,
  },
  noResultsText: {
    color: colors.gray,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
  },
});
