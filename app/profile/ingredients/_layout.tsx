import { IngredientListProvider } from "@/contexts/IngredientListContext";
import { Stack } from "expo-router";

export default function ProfileIngredientsLayout() {
  return (
    <IngredientListProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </IngredientListProvider>
  );
}
