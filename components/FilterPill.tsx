import { colors, typography } from "@/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type FilterPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const FilterPill = ({ label, selected, onPress }: FilterPillProps) => {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.pillSelected]}
      onPress={onPress}
    >
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 32,
    minWidth: 60,
    alignItems: "center",
  },
  pillSelected: {
    backgroundColor: colors.primary400,
  },
  pillText: {
    ...typography.subtext,
    color: colors.gray600,
    textTransform: "capitalize",
  },
  pillTextSelected: {
    color: colors.white,
  },
});
