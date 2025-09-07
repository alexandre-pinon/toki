import { RecipeError } from "@/components/RecipeError";
import { CurrentRecipeProvider } from "@/contexts/CurrentRecipeContext";
import { ErrorBoundaryProps, Stack, useLocalSearchParams } from "expo-router";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <RecipeError error={error.message} />;
}

export default function RecipeDetailsLayout() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();

  return (
    <CurrentRecipeProvider recipeId={recipeId}>
      <Stack>
        <Stack.Screen options={{ headerShown: false }} />
      </Stack>
    </CurrentRecipeProvider>
  );
}
