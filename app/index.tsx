import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingList } from "./components/ShoppingList";
import { colors, typography } from "./theme";
import type { ShoppingListSection } from "./types/shopping/shopping-list";

const dummyData: ShoppingListSection[] = [
  {
    title: "Fruits & Légumes",
    data: [
      {
        id: "1",
        name: "Banane",
        quantity: 1,
        unit: "kg",
        checked: false,
        category: "Fruits & Légumes",
      },
      {
        id: "2",
        name: "Pomme",
        quantity: 2,
        checked: true,
        category: "Fruits & Légumes",
      },
      {
        id: "3",
        name: "Orange",
        quantity: 3,
        unit: "kg",
        checked: false,
        category: "Fruits & Légumes",
      },
      {
        id: "6",
        name: "Oignon",
        quantity: 4,
        checked: false,
        category: "Fruits & Légumes",
      },
      {
        id: "7",
        name: "Ail",
        quantity: 2,
        unit: "clove",
        checked: false,
        category: "Fruits & Légumes",
      },
    ],
  },
  {
    title: "Viande",
    data: [
      {
        id: "4",
        name: "Poulet",
        quantity: 1,
        unit: "kg",
        checked: false,
        category: "Viande",
      },
    ],
  },
  {
    title: "Poisson",
    data: [
      {
        id: "5",
        name: "Saumon",
        quantity: 2,
        unit: "piece",
        checked: false,
        category: "Poisson",
      },
    ],
  },
  {
    title: "Produits laitiers",
    data: [
      {
        id: "8",
        name: "Œufs",
        quantity: 6,
        checked: false,
        category: "Produits laitiers",
      },
    ],
  },
  {
    title: "Épices & Condiments",
    data: [
      {
        id: "9",
        name: "Sel",
        quantity: 1,
        unit: "pinch",
        checked: false,
        category: "Épices & Condiments",
      },
      {
        id: "10",
        name: "Poivre",
        quantity: 1,
        unit: "pinch",
        checked: false,
        category: "Épices & Condiments",
      },
    ],
  },
];

export default function ShoppingListScreen() {
  const [sections, setSections] = useState(dummyData);

  const setChecked = (id: string, checked: boolean) => {
    setSections(
      sections.map((section) => ({
        ...section,
        data: section.data.map((item) => (item.id === id ? { ...item, checked } : item)),
      }))
    );
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log("Delete item:", id);
  };

  const handleAddItem = () => {
    router.push("/add-item");
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "Liste de courses",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Platform.OS === "ios" ? "transparent" : colors.background,
          },
          headerRight: () => (
            <Pressable
              onPress={handleAddItem}
              style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            >
              <Ionicons name="add" size={24} color={colors.primary} style={styles.addButtonIcon} />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ShoppingList sections={sections} setChecked={setChecked} onDelete={handleDelete} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  addButton: {
    padding: 8,
  },
  addButtonPressed: {
    opacity: 0.7,
  },
  addButtonIcon: {
    width: 24,
    height: 24,
  },
});
