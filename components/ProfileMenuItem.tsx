import { colors, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ProfileMenuItemProps = {
  icon: React.ComponentType<{ color: string; size: number }>;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
  showBorder?: boolean;
};

export function ProfileMenuItem({ icon, title, onPress, showChevron = true, showBorder = true }: ProfileMenuItemProps) {
  const IconComponent = icon;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.item, showBorder && styles.itemWithBorder]}>
        <View style={styles.icon}>
          <IconComponent color={colors.primary} size={24} />
        </View>
        <Text style={styles.text}>{title}</Text>
        {showChevron && <Ionicons name="chevron-forward" size={16} color={colors.gray} style={styles.chevron} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  itemWithBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray300,
  },
  icon: {
    marginRight: 16,
  },
  text: {
    ...typography.body,
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
});
