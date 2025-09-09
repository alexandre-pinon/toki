import { Loader } from "@/components/Loader";
import { FormRecipeProvider, useFormRecipe } from "@/contexts/CurrentFormRecipeContext";
import { CurrentRecipeProvider, useCurrentRecipe } from "@/contexts/CurrentRecipeContext";
import { colors, typography } from "@/theme";
import { router, Stack, useLocalSearchParams } from "expo-router";
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
  const {
    formRecipe,
    formIngredients,
    setFormIngredients,
    formInstructions,
    formCurrentIngredient,
    setFormCurrentIngredient,
    upsertRecipe,
    resetForm,
  } = useFormRecipe();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit/index"
        options={{
          headerTitleStyle: typography.header,
          headerTitle,
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                resetForm();
                router.back();
              }}
              style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
            >
              <Text style={[typography.subtitle, styles.cancelButtonText]}>Annuler</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                console.log({ formRecipe, formIngredients, formInstructions });
                // upsertRecipe()
              }}
              style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
            >
              <Text style={[typography.subtitle, styles.saveButtonText]}>Valider</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="edit/ingredients/index"
        options={{
          headerTitleStyle: typography.header,
          headerTitle: "Ingrédient",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
        }}
      />
      <Stack.Screen
        name="edit/ingredients/quantity"
        options={{
          headerTitleStyle: typography.header,
          headerTitle: "Quantité",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
          headerRight: () => (
            <Pressable
              onPress={() => {
                if (!formCurrentIngredient) return;

                setFormIngredients((prev) => {
                  const idxToReplace = prev.findIndex(
                    (ingredient) => ingredient.ingredientId === formCurrentIngredient.ingredientId,
                  );

                  if (idxToReplace === -1) {
                    return [...prev, formCurrentIngredient];
                  }

                  return [...prev.slice(0, idxToReplace), formCurrentIngredient, ...prev.slice(idxToReplace + 1)];
                });
                setFormCurrentIngredient(null);
                router.back();
              }}
              style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
            >
              <Text style={[typography.subtitle, styles.saveButtonText]}>Valider</Text>
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
  actionButton: {
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    color: colors.gray,
  },
  saveButtonText: {
    color: colors.primary,
  },
});
