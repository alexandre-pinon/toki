import { Stack } from "expo-router";
import { colors, typography } from "../../theme";

export default function ShoppingLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: typography.header,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
      }}
    />
  );
}
