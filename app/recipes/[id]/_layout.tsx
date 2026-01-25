import { CurrentRecipeProvider } from "@/contexts/CurrentRecipeContext";
import { Stack, useLocalSearchParams } from "expo-router";

export default function RecipeDetailLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <CurrentRecipeProvider id={id}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </CurrentRecipeProvider>
  );
}
