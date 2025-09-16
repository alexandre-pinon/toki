import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export type ServingsInputProps = {
  onTapPlus: () => void;
  onTapMinus: () => void;
};
export const ServingsInput = ({ onTapPlus, onTapMinus }: ServingsInputProps) => {
  return (
    <View style={styles.servingsControls}>
      <TouchableOpacity onPress={onTapMinus} style={styles.servingsButton}>
        <Ionicons name="remove" size={20} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onTapPlus} style={styles.servingsButton}>
        <Ionicons name="add" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  servingsControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  servingsButton: {
    padding: 4,
    marginHorizontal: 4,
    backgroundColor: colors.gray50,
    borderRadius: 99,
  },
});
