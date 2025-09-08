import { Loader } from "@/components/Loader";
import { FormRecipeProvider, useFormRecipe } from "@/contexts/CurrentFormRecipeContext";
import { CurrentRecipeProvider, useCurrentRecipe } from "@/contexts/CurrentRecipeContext";
import { colors, typography } from "@/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function RecipeDetailsLayout() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();

  return (
    <CurrentRecipeProvider recipeId={recipeId}>
      <RecipeDetailsStack />
    </CurrentRecipeProvider>
  );
}

const RecipeDetailsStack = () => {
  const { currentRecipe, isLoading } = useCurrentRecipe();

  if (isLoading || !currentRecipe) return <Loader />;

  return (
    <FormRecipeProvider initialRecipeValues={currentRecipe}>
      <RecipeEditStack headerTitle={currentRecipe.recipe.name} />
    </FormRecipeProvider>
  );
};

type RecipeEditStackProps = { headerTitle: string };
const RecipeEditStack = ({ headerTitle }: RecipeEditStackProps) => {
  const { upsertRecipe } = useFormRecipe();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit/index"
        options={{
          headerTitleStyle: typography.header,
          headerTitle,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
          headerRight: () => (
            <Pressable
              onPress={upsertRecipe}
              style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
            >
              <Text style={[typography.body, styles.saveButtonText]}>Valider</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.7,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
});
