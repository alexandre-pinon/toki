import { colors, typography } from "@/theme";
import {
  mapShoppingItemCategoryToImageSource,
  mapShoppingItemCategoryToName,
  ShoppingItemCategory,
} from "@/types/shopping/shopping-item-category";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

type ShoppingItemCategorySectionHeaderProps = {
  category: ShoppingItemCategory;
};
export const ShoppingItemCategorySectionHeader = ({ category }: ShoppingItemCategorySectionHeaderProps) => (
  <View style={styles.sectionHeader}>
    <Text style={[typography.subtitle, styles.sectionTitle]}>{mapShoppingItemCategoryToName(category)}</Text>
    <Image source={mapShoppingItemCategoryToImageSource(category)} style={styles.sectionIcon} />
  </View>
);

const styles = StyleSheet.create({
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
});
