import { colors, typography } from "@/theme";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type RecipeTabsProps = {
  onTabChange: (tab: RecipeTabName) => void;
  tab: RecipeTabName;
};

export type RecipeTabName = "ingredients" | "instructions";

export function RecipeTabs({ tab, onTabChange }: RecipeTabsProps) {
  return (
    <View style={styles.tabsRow}>
      <TouchableOpacity style={styles.tabButton} onPress={() => onTabChange("instructions")}>
        <Text style={[typography.header, styles.tabText, tab === "instructions" && styles.tabTextActive]}>
          Instructions
        </Text>
        <View style={[styles.tabIndicator, tab === "instructions" && styles.tabIndicatorActive]} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabButton} onPress={() => onTabChange("ingredients")}>
        <Text style={[typography.header, styles.tabText, tab === "ingredients" && styles.tabTextActive]}>
          Ingrédients
        </Text>
        <View style={[styles.tabIndicator, tab === "ingredients" && styles.tabIndicatorActive]} />
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  tabIndicator: {
    width: 55,
    height: 1,
    backgroundColor: "transparent",
  },
  tabIndicatorActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontWeight: "300",
  },
  tabTextActive: {
    color: colors.primary,
  },
});
