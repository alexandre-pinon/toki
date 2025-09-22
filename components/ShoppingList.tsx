import { useShoppingList } from "@/contexts/ShoppingListContext";
import { colors, typography } from "@/theme";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { Loader } from "./Loader";
import { ShoppingItemCategorySectionHeader } from "./ShoppingItemCategorySectionHeader";
import { ShoppingListItem } from "./ShoppingListItem";

export function ShoppingList() {
  const { isLoading, sections } = useShoppingList();

  if (isLoading) {
    return <Loader />;
  }

  if (sections.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[typography.body, styles.emptyText]}>Vous n{"\&apos"}avez plus rien à acheter ! 🎉</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      renderItem={({ item, section, index }) => (
        <ShoppingListItem {...item} isLastItem={index === section.data.length - 1} />
      )}
      renderSectionHeader={({ section: { title } }) => <ShoppingItemCategorySectionHeader category={title} />}
      keyExtractor={(item) => item.ids[0]}
      stickySectionHeadersEnabled
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: colors.alert,
    textAlign: "center",
  },
  emptyText: {
    color: colors.gray,
    textAlign: "center",
  },
});
