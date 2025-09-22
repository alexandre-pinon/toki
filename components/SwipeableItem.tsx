import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Swipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

type SwipeableItemProps = PropsWithChildren & {
  onEdit: () => void;
  onDelete?: () => void;
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
    if (onDelete) {
      onDelete();
    }
  };

  const renderRightActions = () => {
    return (
      <View style={styles.actions}>
        <TouchableOpacity onPress={onPressEdit} style={styles.editAction}>
          <Ionicons name="pencil-outline" size={24} color="white" />
        </TouchableOpacity>
        {onDelete && (
          <TouchableOpacity onPress={onPressDelete} style={styles.deleteAction}>
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
});
