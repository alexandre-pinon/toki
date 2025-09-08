import { colors, typography } from "@/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RecipeTabsProps = {
  setTab: (tab: RecipeTabName) => void;
  tab: RecipeTabName;
};

export type RecipeTabName = "ingredients" | "instructions";

export function RecipeTabs({ tab, setTab }: RecipeTabsProps) {
  return (
    <View style={styles.tabsRow}>
      <TouchableOpacity style={styles.tabButton} onPress={() => setTab("instructions")}>
        <Text style={[typography.header, styles.tabText, tab === "instructions" && styles.tabTextActive]}>
          Instructions
        </Text>
        <View style={[styles.tabIndicator, tab === "instructions" && styles.tabIndicatorActive]} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabButton} onPress={() => setTab("ingredients")}>
        <Text style={[typography.header, styles.tabText, tab === "ingredients" && styles.tabTextActive]}>
          Ingrédients
        </Text>
        <View style={[styles.tabIndicator, tab === "ingredients" && styles.tabIndicatorActive]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  tabButton: {
    alignItems: "center",
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
