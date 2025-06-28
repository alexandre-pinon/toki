import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { colors, typography } from "../theme";
import type { ShoppingItem } from "../types/shopping/shopping-item";
import { mapUnitTypeToName } from "../types/unit-type";

type ShoppingItemProps = ShoppingItem & { isLastItem?: boolean };

export function ShoppingListItem({
  id,
  name,
  quantity,
  unit,
  checked,
  isLastItem,
  userId,
}: ShoppingItemProps) {
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const { setChecked, deleteItem } = useShoppingList();
  const [isCheckLoading, setIsCheckLoading] = useState(false);

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
          onPress: () => {
            swipeableRef.current?.close();
            deleteItem(id, userId);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    swipeableRef.current?.close();
    router.push(`/edit-item/${id}`);
  };

  const handleCheck = async () => {
    setIsCheckLoading(true);
    await setChecked(id, !checked);
    setIsCheckLoading(false);
  };

  const renderRightActions = () => {
    return (
      <View style={styles.actions}>
        <Pressable
          onPress={handleEdit}
          style={({ pressed }) => [styles.editAction, pressed && styles.actionPressed]}
        >
          <Ionicons name="pencil-outline" size={24} color="white" />
        </Pressable>
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [styles.deleteAction, pressed && styles.actionPressed]}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </Pressable>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
    >
      <View style={styles.item}>
        {isCheckLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <Checkbox
            style={styles.checkbox}
            value={checked}
            onValueChange={handleCheck}
            color={colors.primary}
          />
        )}
        <View style={[styles.itemContent, !isLastItem && styles.itemContentWithBorder]}>
          <Text style={[typography.body, styles.itemTitle, checked && styles.itemTitleChecked]}>
            {name}
          </Text>
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
    backgroundColor: colors.white,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemContentWithBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGrey,
  },
  itemTitle: {
    textTransform: "capitalize",
  },
  itemTitleChecked: {
    textDecorationLine: "line-through",
    color: colors.gray,
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
  actions: {
    flexDirection: "row",
  },
  editAction: {
    backgroundColor: colors.info,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  deleteAction: {
    backgroundColor: colors.danger,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  actionPressed: {
    opacity: 0.8,
  },
  loadingContainer: {
    width: 22,
    height: 22,
    marginBottom: 16,
  },
});
