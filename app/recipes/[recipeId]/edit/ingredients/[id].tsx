import { Loader } from "@/components/Loader";
import { SearchBar } from "@/components/SearchBar";
import { UnderlinedListItem } from "@/components/UnderlinedListItem";
import { useIngredientService } from "@/services/ingredient";
import { colors, typography } from "@/theme";
import { Ingredient } from "@/types/ingredient";
import { Image } from "expo-image";
import { startTransition, useActionState, useDeferredValue, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeEditIngredientScreen() {
  const { searchIngredient } = useIngredientService();
  const [searchQuery, setSearchQuery] = useState("");
  const defferedSearchTerm = useDeferredValue(searchQuery);
  const [results, search, isLoading] = useActionState<Ingredient[]>(() => searchIngredient(defferedSearchTerm), []);

  useEffect(() => {
    startTransition(search);
  }, [defferedSearchTerm, search]);

  const displayResults = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (searchQuery === "") {
      return (
        <View style={[styles.centerContainer]}>
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
        renderItem={({ item }) => <UnderlinedListItem title={item.name} />}
        keyExtractor={(item) => item.id}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar query={{ value: searchQuery, set: setSearchQuery }} />
      {displayResults()}
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
});
