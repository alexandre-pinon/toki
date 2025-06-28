import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";

interface ProfileMenuItemProps {
  icon: React.ComponentType<{ color: string; size: number }>;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
  showBorder?: boolean;
}

export function ProfileMenuItem({
  icon,
  title,
  onPress,
  showChevron = true,
  showBorder = true,
}: ProfileMenuItemProps) {
  const IconComponent = icon;

  return (
    <Pressable style={({ pressed }) => [pressed && styles.itemPressed]} onPress={onPress}>
      <View style={[styles.item, showBorder && styles.itemWithBorder]}>
        <View style={styles.icon}>
          <IconComponent color={colors.primary} size={24} />
        </View>
        <Text style={styles.text}>{title}</Text>
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color={colors.gray} style={styles.chevron} />
        )}
      </View>
    </Pressable>
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
  itemPressed: {
    opacity: 0.7,
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
