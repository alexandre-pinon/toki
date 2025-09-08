import { useShoppingList } from "@/contexts/ShoppingListContext";
import { colors, typography } from "@/theme";
import {
  mapShoppingItemCategoryToImageSource,
  mapShoppingItemCategoryToName,
} from "@/types/shopping/shopping-item-category";
import { Image } from "expo-image";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { ShoppingListItem } from "./ShoppingListItem";

export function ShoppingList() {
  const { sections } = useShoppingList();

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
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={[typography.subtitle, styles.sectionTitle]}>{mapShoppingItemCategoryToName(title)}</Text>
          <Image source={mapShoppingItemCategoryToImageSource(title)} style={styles.sectionIcon} />
        </View>
      )}
      keyExtractor={(item) => item.ids[0]}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled
    />
  );
}

const styles = StyleSheet.create({
  listContent: {},
  sectionHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: colors.gray,
  },
  sectionIcon: {
    width: 16,
    height: 16,
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
