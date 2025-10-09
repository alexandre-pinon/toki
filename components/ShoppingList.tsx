import { useShoppingList } from "@/contexts/ShoppingListContext";
import { colors, typography } from "@/theme";
import { RefreshControl, SectionList, StyleSheet, Switch, Text, View } from "react-native";
import { ShoppingItemCategorySectionHeader } from "./ShoppingItemCategorySectionHeader";
import { ShoppingListItem } from "./ShoppingListItem";

export function ShoppingList() {
  const { isLoading, showedSections, showCheckedItems, toggleCheckedItemsSwitch, refetchShoppingList } =
    useShoppingList();

  return (
    <>
      <View style={styles.switchContainer}>
        <Text style={[typography.body, styles.switchText]}>Voir tous les articles</Text>
        <Switch
          value={showCheckedItems}
          onValueChange={toggleCheckedItemsSwitch}
          trackColor={{ true: colors.primary }}
          ios_backgroundColor={colors.gray50}
        />
      </View>
      {!isLoading && showedSections.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={[typography.body, styles.emptyText]}>{"Vous n'avez plus rien à acheter ! 🎉"}</Text>
        </View>
      ) : (
        <SectionList
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetchShoppingList} tintColor={colors.primary200} />
          }
          sections={showedSections}
          renderItem={({ item, section, index }) => (
            <ShoppingListItem {...item} isLastItem={index === section.data.length - 1} />
          )}
          renderSectionHeader={({ section: { title } }) => <ShoppingItemCategorySectionHeader category={title} />}
          keyExtractor={(item) => item.ids[0]}
          stickySectionHeadersEnabled
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  switchText: {
    color: colors.gray,
  },
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
