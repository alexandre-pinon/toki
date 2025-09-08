import { colors, typography } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { Pill } from "./Pill";

type UnderlinedListItemProps = {
  title: string;
  subTitle?: string;
  isLastItem?: boolean;
  checked?: boolean;
  tag?: string;
};

export function UnderlinedListItem({ title, subTitle, isLastItem, checked, tag }: UnderlinedListItemProps) {
  return (
    <View style={[styles.itemContent, !isLastItem && styles.itemContentWithBorder]}>
      <View style={styles.itemContentLeft}>
        <View style={styles.titleRow}>
          <Text style={[typography.body, styles.itemTitle, checked && styles.itemTitleChecked]}>{title}</Text>
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
  itemTitle: {
    textTransform: "capitalize",
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
    justifyContent: "space-between",
  },
});
