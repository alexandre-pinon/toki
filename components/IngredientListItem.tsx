import { Ingredient } from "@/types/ingredient";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { SwipeableItem } from "./SwipeableItem";
import { UnderlinedListItem } from "./UnderlinedListItem";

type IngredientItemProps = Ingredient & { isLastItem?: boolean };

export function IngredientListItem({ id, name, category, isLastItem }: IngredientItemProps) {
  const onEdit = () => {
    router.push({
      pathname: `./ingredients/edit/[id]`,
      params: { id, name, category },
    });
  };

  return (
    <SwipeableItem onEdit={onEdit}>
      <UnderlinedListItem title={name} isLastItem={isLastItem} />
    </SwipeableItem>
  );
}

const styles = StyleSheet.create({});
