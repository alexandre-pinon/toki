import { colors, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function ShoppingListLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Liste de courses",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/add-item")} style={styles.addButton}>
              <Ionicons name="add" size={24} color={colors.primary} style={styles.addButtonIcon} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  addButton: {
    padding: 8,
  },
  addButtonIcon: {
    marginRight: 8,
  },
});
