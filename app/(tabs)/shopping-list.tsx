import { ShoppingList } from "@/components/ShoppingList";
import { colors, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "temporal-polyfill/global";

export default function ShoppingListScreen() {
  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/add-item")} style={styles.addButton}>
              <Ionicons name="add" size={24} color={colors.primary} style={styles.addButtonIcon} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <ShoppingList />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  addButton: {
    padding: 8,
  },
  addButtonIcon: {
    height: 24,
    width: 24,
    marginRight: 8,
  },
});
