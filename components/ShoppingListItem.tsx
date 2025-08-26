import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { colors, typography } from "../theme";
import type { AggregatedShoppingItem } from "../types/shopping/shopping-item";
import { formatQuantityAndUnit } from "../types/unit-type";
import { mapPlainDateToDayName } from "../utils/date";
import { Pill } from "./Pill";

type ShoppingItemProps = AggregatedShoppingItem & { isLastItem?: boolean };

export function ShoppingListItem({
  ids,
  name,
  quantity,
  unit,
  earliestMealDate,
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
            deleteItem(ids[0], userId);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    swipeableRef.current?.close();
    router.push(`/edit-item/${ids[0]}`);
  };

  const handleCheck = async () => {
    setIsCheckLoading(true);
    await setChecked(ids, !checked, userId);
    setIsCheckLoading(false);
  };

  const renderRightActions = () => {
    return (
      <View style={styles.actions}>
        <Pressable
          onPress={handleEdit}
          disabled={!!earliestMealDate}
          style={({ pressed }) => [styles.editAction, pressed && styles.actionPressed]}
        >
          <Ionicons name="pencil-outline" size={24} color="white" />
        </Pressable>
        <Pressable
          onPress={handleDelete}
          disabled={!!earliestMealDate}
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
          <View style={styles.itemContentLeft}>
            <View style={styles.titleRow}>
              <Text style={[typography.body, styles.itemTitle, checked && styles.itemTitleChecked]}>
                {name}
              </Text>
            </View>
            <Text style={[typography.subtext, checked && styles.itemSubtitleChecked]}>
              {formatQuantityAndUnit(quantity, unit)}
            </Text>
          </View>
          {earliestMealDate && <Pill>{mapPlainDateToDayName(earliestMealDate)}</Pill>}
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    backgroundColor: colors.white,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  itemContentLeft: {
    gap: 4,
  },
  itemContentWithBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray300,
  },
  itemTitle: {
    textTransform: "capitalize",
  },
  itemTitleChecked: {
    textDecorationLine: "line-through",
    color: colors.gray,
  },
  itemSubtitleChecked: {
    color: colors.gray300,
  },
  checkbox: {
    borderRadius: 6,
    borderWidth: 1.5,
    width: 22,
    height: 22,
  },
  actions: {
    flexDirection: "row",
  },
  editAction: {
    backgroundColor: colors.contrast500,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  deleteAction: {
    backgroundColor: colors.alert,
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
