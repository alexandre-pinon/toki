import { colors, typography } from "@/theme";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

type PillProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Pill({ children, style, textStyle }: PillProps) {
  return (
    <View style={[styles.pill, style]}>
      <Text style={[typography.subtitle, styles.pillText, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.gray50,
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  pillText: {
    textTransform: "capitalize",
    fontSize: 12,
  },
});
