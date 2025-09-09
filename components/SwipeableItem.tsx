import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Swipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

type SwipeableItemProps = PropsWithChildren & {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

export const SwipeableItem = ({ onEdit, onDelete, disabled, children }: SwipeableItemProps) => {
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  const onPressEdit = () => {
    swipeableRef.current?.close();
    onEdit();
  };

  const onPressDelete = () => {
    swipeableRef.current?.close();
    onDelete();
  };

  const renderRightActions = () => {
    return (
      <View style={styles.actions}>
        <Pressable onPress={onPressEdit} style={({ pressed }) => [styles.editAction, pressed && styles.actionPressed]}>
          <Ionicons name="pencil-outline" size={24} color="white" />
        </Pressable>
        <Pressable
          onPress={onPressDelete}
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
      enabled={!(disabled ?? false)}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
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
});
