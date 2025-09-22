import { useShoppingList } from "@/contexts/ShoppingListContext";
import { colors } from "@/theme";
import type { AggregatedShoppingItem } from "@/types/shopping/shopping-item";
import { formatQuantityAndUnit } from "@/types/unit-type";
import { mapPlainDateToDayName } from "@/utils/date";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { SwipeableItem } from "./SwipeableItem";
import { UnderlinedListItem } from "./UnderlinedListItem";

type ShoppingItemProps = AggregatedShoppingItem & { isLastItem?: boolean };

export function ShoppingListItem({
  ids,
  name,
  quantity,
  unit,
  earliestMealDate,
  checked,
  isLastItem,
}: ShoppingItemProps) {
  const { setChecked, deleteItem } = useShoppingList();
  const [isCheckLoading, setIsCheckLoading] = useState(false);

  const onDelete = () => {
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
            deleteItem(ids[0]);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const onEdit = () => {
    router.push({
      pathname: `../edit-item/[id]`,
      params: { id: ids[0] },
    });
  };

  const handleCheck = async () => {
    setIsCheckLoading(true);
    await setChecked(ids, !checked);
    setIsCheckLoading(false);
  };

  return (
    <SwipeableItem onEdit={onEdit} onDelete={onDelete} disabled={!!earliestMealDate}>
      <View style={styles.item}>
        {isCheckLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <Checkbox style={styles.checkbox} value={checked} onValueChange={handleCheck} color={colors.primary300} />
        )}

        <UnderlinedListItem
          title={name}
          subTitle={formatQuantityAndUnit(quantity, unit)}
          isLastItem={isLastItem}
          checked={checked}
          tag={earliestMealDate ? mapPlainDateToDayName(earliestMealDate) : undefined}
        />
      </View>
    </SwipeableItem>
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
