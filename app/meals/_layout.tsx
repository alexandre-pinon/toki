import { CurrentMealProvider } from "@/contexts/CurrentMealContext";
import { Stack, useLocalSearchParams } from "expo-router";

export default function MealLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <CurrentMealProvider id={id}>
      <Stack>
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
      </Stack>
    </CurrentMealProvider>
  );
}
