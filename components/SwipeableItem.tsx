import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Swipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

type SwipeableItemProps = PropsWithChildren & {
  onEdit?: () => void;
  onDelete?: (swipeable?: SwipeableMethods) => void;
  disabled?: boolean;
  actionsStyles?: ViewStyle;
};

export const SwipeableItem = ({ onEdit, onDelete, disabled, actionsStyles, children }: SwipeableItemProps) => {
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  const onPressEdit = () => {
    swipeableRef.current?.close();
    if (onEdit) {
      onEdit();
    }
  };

  const onPressDelete = () => {
    swipeableRef.current?.close();
    if (onDelete) {
      onDelete();
    }
  };

  const handleSwipeableOpen = () => {
    if (swipeableRef.current && onDelete && !onEdit) {
      onDelete(swipeableRef.current);
    }
  };

  const renderRightActions = () => {
    return (
      <View style={[styles.actions]}>
        {onEdit && (
          <TouchableOpacity onPress={onPressEdit} style={[styles.editAction, actionsStyles]}>
            <Ionicons name="pencil-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            onPress={onPressDelete}
            style={[styles.deleteAction, !onEdit && styles.fullWidth, actionsStyles]}
          >
            <Ionicons name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      enabled={!(disabled ?? false)}
      onSwipeableOpen={handleSwipeableOpen}
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
  fullWidth: {
    paddingRight: 28,
    alignItems: "flex-end",
    width: "100%",
  },
});
