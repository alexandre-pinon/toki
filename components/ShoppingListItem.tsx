import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { colors, typography } from "../theme";
import type { ShoppingItem } from "../types/shopping/shopping-item";
import { mapUnitTypeToName } from "../types/unit-type";

type ShoppingItemProps = ShoppingItem & {
  setChecked: (id: string, checked: boolean) => void;
  onDelete?: (id: string) => void;
  isLastItem?: boolean;
};

export function ShoppingListItem({
  id,
  name,
  quantity,
  unit,
  checked,
  setChecked,
  onDelete,
  isLastItem,
}: ShoppingItemProps) {
  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'article",
      "Êtes-vous sûr de vouloir supprimer cet article ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => onDelete?.(id),
        },
      ],
      { cancelable: true }
    );
  };

  const renderRightActions = () => {
    return (
      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [styles.deleteAction, pressed && styles.deleteActionPressed]}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} rightThreshold={40} overshootRight={false}>
      <View style={styles.item}>
        <Checkbox
          style={styles.checkbox}
          value={checked}
          onValueChange={() => setChecked(id, !checked)}
          color={colors.primary}
        />
        <View style={[styles.itemContent, !isLastItem && styles.itemContentWithBorder]}>
          <Text style={[typography.body, checked && styles.itemTitleChecked]}>{name}</Text>
          <Text
            style={[typography.subtext, checked && styles.itemSubtitleChecked, styles.itemSubtitle]}
          >
            {quantity} {mapUnitTypeToName(unit)}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingLeft: 24,
    gap: 16,
    backgroundColor: colors.background,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemContentWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  itemTitleChecked: {
    textDecorationLine: "line-through",
    color: colors.grey,
  },
  itemSubtitleChecked: {
    color: colors.lightGrey,
  },
  itemSubtitle: {
    marginBottom: 16,
  },
  checkbox: {
    marginBottom: 16,
    borderRadius: 6,
    borderWidth: 1.5,
    width: 22,
    height: 22,
  },
  deleteAction: {
    backgroundColor: colors.danger,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  deleteActionPressed: {
    opacity: 0.8,
  },
});
