import { Loader } from "@/components/Loader";
import { SearchBar } from "@/components/SearchBar";
import { UnderlinedListItem } from "@/components/UnderlinedListItem";
import { useAuth } from "@/contexts/AuthContext";
import { useFormIngredient } from "@/contexts/FormIngredientContext";
import { useFormRecipe } from "@/contexts/FormRecipeContext";
import { searchIngredient } from "@/services/ingredient";
import { colors, typography } from "@/theme";
import { createIngredient, Ingredient } from "@/types/ingredient";
import { UnitType } from "@/types/unit-type";
import { safeParseOptionalFloat } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeEditIngredientScreen() {
  const { session } = useAuth();
  const { index, name, quantity, unit } = useLocalSearchParams<{
    index?: string;
    name?: string;
    quantity?: string;
    unit?: UnitType;
  }>();
  const { setFormCurrentIngredient } = useFormRecipe();
  const { setFormIngredient } = useFormIngredient();
  const [searchTerm, setSearchTerm] = useState(name ?? "");
  const [results, setResults] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleAddNewIngredient = () => {
    if (!session) {
      return;
    }
    setFormIngredient(createIngredient(session.user.id, { name }));
    router.push({ pathname: "./ingredients/edit", params: { index, quantity, unit } });
  };

  const handlePressIngredient = (ingredient: Ingredient) => {
    setFormCurrentIngredient({
      ingredientId: ingredient.id,
      name: ingredient.name,
      category: ingredient.category,
      quantity: safeParseOptionalFloat(quantity),
      unit,
    });
    router.push({ pathname: "./ingredients/quantity", params: { index } });
  };

  useEffect(() => {
    const performSearch = async (query: string) => {
      if (query.length === 0 || !session?.user.id) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchIngredient(session.user.id, query);
        setResults(searchResults);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, session?.user.id]);

  const displaySearchResults = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (debouncedSearchTerm === "") {
      return (
        <View style={styles.centerContainer}>
          <Image source={require("@/assets/images/groceries.png")} style={styles.image} />
          <Text style={[typography.body, styles.imageText]}>
            Rechercher un ingrédient
          </Text>
        </View>
      );
    }

    if (results.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Image
            source={require("@/assets/images/empty-cart.png")}
            style={styles.image}
          />
          <Text style={[typography.body, styles.imageText]}>Aucun ingrédient trouvé</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressIngredient(item)}>
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
      <Stack.Screen
        options={{
          headerTitleStyle: typography.header,
          headerTitle: "Ingrédient",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
          headerRight: () => (
            <TouchableOpacity onPress={handleAddNewIngredient} style={styles.addButton}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <SearchBar query={{ value: searchTerm, set: setSearchTerm }} autoFocus />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {displaySearchResults()}
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
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
  addButton: {
    paddingHorizontal: 6,
  },
});
