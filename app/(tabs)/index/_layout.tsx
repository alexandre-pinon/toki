import { typography } from "@/theme";
import { Stack } from "expo-router";

export default function IndexLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Repas de la semaine",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
