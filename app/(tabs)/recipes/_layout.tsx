import { typography } from "@/theme";
import { Stack } from "expo-router";

export default function RecipesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Recettes",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
