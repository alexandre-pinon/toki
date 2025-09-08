import { colors } from "@/theme";
import { ActivityIndicator, ActivityIndicatorProps, ColorValue, StyleSheet, View } from "react-native";

export const Loader = ({
  color = colors.primary,
  size = "large",
}: {
  color?: ColorValue;
  size?: ActivityIndicatorProps["size"];
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
