import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingListItem, type ShoppingListItemType } from "./components/ShoppingListItem";
import { colors, typography } from "./theme";

const dummyData: ShoppingListItemType[] = [
  {
    id: "1",
    name: "Banane",
    quantity: 1,
    unit: "kg",
    checked: false,
  },
  {
    id: "2",
    name: "Pomme",
    quantity: 2,
    unit: "",
    checked: true,
  },
  {
    id: "3",
    name: "Orange",
    quantity: 3,
    unit: "kg",
    checked: false,
  },
];

export default function ShoppingListScreen() {
  const [items, setItems] = useState(dummyData);

  const setChecked = (id: string, checked: boolean) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked } : item)));
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
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ShoppingListItem setChecked={setChecked} onDelete={handleDelete} {...item} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
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
  listContent: {
    paddingTop: 8,
  },
  addButton: {
    padding: 8,
    marginRight: -8,
  },
  addButtonPressed: {
    opacity: 0.7,
  },
  addButtonIcon: {
    width: 24,
    height: 24,
  },
});
