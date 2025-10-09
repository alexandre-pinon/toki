import { colors, typography } from "@/theme";
import { capitalize } from "@/utils/string";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { Pill } from "./Pill";

type UnderlinedListItemProps = {
  title: string;
  withTitleIcon?: boolean;
  subTitle?: string;
  isLastItem?: boolean;
  checked?: boolean;
  tag?: string;
};

export function UnderlinedListItem({
  title,
  withTitleIcon,
  subTitle,
  isLastItem,
  checked,
  tag,
}: UnderlinedListItemProps) {
  return (
    <View style={[styles.itemContent, !isLastItem && styles.itemContentWithBorder]}>
      <View style={styles.itemContentLeft}>
        <View style={styles.titleRow}>
          <Text style={[typography.body, checked && styles.itemTitleChecked]}>{capitalize(title)}</Text>
          {withTitleIcon && <Image source={require("@/assets/images/warning.png")} style={styles.titleIcon} />}
        </View>
        {subTitle && <Text style={[typography.subtext, checked && styles.itemSubtitleChecked]}>{subTitle}</Text>}
      </View>
      {tag && <Pill>{tag}</Pill>}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
  },
  itemContentLeft: {
    gap: 4,
  },
  itemContentWithBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray300,
  },
  itemTitleChecked: {
    textDecorationLine: "line-through",
    color: colors.gray,
  },
  itemSubtitleChecked: {
    color: colors.gray300,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleIcon: {
    width: 12,
    height: 12,
  },
});
