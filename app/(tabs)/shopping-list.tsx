import { ShoppingList } from "@/components/ShoppingList";
import { colors, typography } from "@/theme";
import { router, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
              <Text style={[typography.body, styles.addButtonText]}>Ajouter</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
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
    paddingTop: 16,
    paddingBottom: 48,
  },
  addButton: {
    paddingRight: 16,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: 300,
  },

  addButtonIcon: {
    marginRight: 8,
  },
});
