import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { forwardRef, PropsWithChildren } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Swipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

type SwipeableItemProps = PropsWithChildren & {
  handleEdit: () => void;
  handleDelete: () => void;
  disabled?: boolean;
};

export const SwipeableItem = forwardRef<SwipeableMethods, SwipeableItemProps>(
  ({ children, handleEdit, handleDelete, disabled }, ref) => {
    const renderRightActions = () => {
      return (
        <View style={styles.actions}>
          <Pressable onPress={handleEdit} style={({ pressed }) => [styles.editAction, pressed && styles.actionPressed]}>
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
        ref={ref}
        renderRightActions={renderRightActions}
        rightThreshold={40}
        overshootRight={false}
        enabled={!(disabled ?? false)}
      >
        {children}
      </Swipeable>
    );
  },
);

SwipeableItem.displayName = "SwipeableItem";

export const styles = StyleSheet.create({
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
