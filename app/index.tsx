import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingList } from "../components/ShoppingList";
import { useShoppingList } from "../contexts/ShoppingListContext";
import { colors, typography } from "../theme";

export default function ShoppingListScreen() {
  const { sections, loadShoppingList, setChecked, handleDelete } = useShoppingList();

  useEffect(() => {
    loadShoppingList();
  }, []);

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
              onPress={() => router.push("/add-item")}
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
    height: 24,
    width: 24,
    marginRight: 8,
  },
});
