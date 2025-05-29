import { SectionList, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";
import type { ShoppingListSection } from "../types/shopping/shopping-list";
import { ShoppingListItem } from "./ShoppingListItem";

type ShoppingListProps = {
  sections: ShoppingListSection[];
  setChecked: (id: number, checked: boolean) => void;
  onDelete: (id: number) => void;
};

export function ShoppingList({ sections, setChecked, onDelete }: ShoppingListProps) {
  return (
    <SectionList
      sections={sections}
      renderItem={({ item, section, index }) => (
        <ShoppingListItem
          setChecked={setChecked}
          onDelete={onDelete}
          {...item}
          isLastItem={index === section.data.length - 1}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={[typography.subtitle, styles.sectionTitle]}>{title}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled
    />
  );
}

const styles = StyleSheet.create({
  listContent: {},
  sectionHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    color: colors.grey,
  },
});
