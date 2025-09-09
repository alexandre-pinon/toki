import { Loader } from "@/components/Loader";
import { FormRecipeProvider, useFormRecipe } from "@/contexts/CurrentFormRecipeContext";
import { CurrentRecipeProvider, useCurrentRecipe } from "@/contexts/CurrentRecipeContext";
import { colors, typography } from "@/theme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

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
            <TouchableOpacity
              onPress={() => {
                resetForm();
                router.back();
              }}
              style={styles.actionButton}
            >
              <Text style={[typography.subtitle, styles.cancelButtonText]}>Annuler</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log({ formRecipe, formIngredients, formInstructions });
                // upsertRecipe()
              }}
              style={styles.actionButton}
            >
              <Text style={[typography.subtitle, styles.saveButtonText]}>Valider</Text>
            </TouchableOpacity>
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
            <TouchableOpacity
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
                router.replace({
                  pathname: "/recipes/[recipeId]/edit",
                  params: { recipeId: formRecipe.id },
                });
              }}
              style={styles.actionButton}
            >
              <Text style={[typography.subtitle, styles.saveButtonText]}>Valider</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
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
