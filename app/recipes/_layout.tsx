import { Loader } from "@/components/Loader";
import { CurrentRecipeProvider, useCurrentRecipe } from "@/contexts/CurrentRecipeContext";
import { FormRecipeProvider, useFormRecipe } from "@/contexts/FormRecipeContext";
import { colors, typography } from "@/theme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function RecipeDetailsLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <CurrentRecipeProvider id={id}>
      <RecipeDetailsStack id={id} />
    </CurrentRecipeProvider>
  );
}

const RecipeDetailsStack = ({ id }: { id: string }) => {
  const { currentRecipe, isLoading } = useCurrentRecipe();

  if (isLoading) return <Loader />;

  return (
    <FormRecipeProvider initialRecipeValues={currentRecipe} recipeId={id}>
      <RecipeEditStack headerTitle={currentRecipe?.recipe.name} recipeExists={!!currentRecipe} />
    </FormRecipeProvider>
  );
};

type RecipeEditStackProps = { headerTitle?: string; recipeExists: boolean };
const RecipeEditStack = ({ headerTitle, recipeExists }: RecipeEditStackProps) => {
  const {
    formRecipe,
    setFormIngredients,
    formInstructions,
    setFormInstructions,
    formCurrentIngredient,
    formCurrentInstruction,
    upsertRecipe,
    isLoading,
    areAllIngredientsValid,
    importRecipe,
  } = useFormRecipe();

  const handleCancel = () => {
    if (recipeExists) {
      router.dismissTo({ pathname: "../[id]", params: { id: formRecipe.id } });
    } else {
      router.dismissTo({ pathname: ".." });
    }
  };

  const handleSaveRecipe = () => {
    upsertRecipe();
    router.dismissTo({ pathname: "./[id]", params: { id: formRecipe.id } });
  };

  const handleImportRecipe = async () => {
    importRecipe();
    router.back();
  };

  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />

      <Stack.Screen
        name="edit/[id]"
        options={{
          headerTitleStyle: typography.header,
          headerTitle: headerTitle ?? "Nouvelle recette",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleCancel}
              style={[styles.actionButton, isLoading && styles.buttonDisabled]}
              disabled={isLoading}
            >
              <Text style={[typography.subtitle, styles.cancelButtonText]}>Annuler</Text>
            </TouchableOpacity>
          ),
          headerRight: () => {
            const isDisabled = !areAllIngredientsValid || isLoading;
            return (
              <TouchableOpacity
                onPress={() => {
                  if (isDisabled) {
                    Alert.alert(
                      "Ingrédients invalides",
                      "Certains ingrédients n'existent pas encore dans votre liste, ajouter les pour valider cette recette",
                    );
                  } else {
                    handleSaveRecipe();
                  }
                }}
                style={[styles.actionButton, isDisabled && styles.buttonDisabled]}
              >
                <Text style={[typography.subtitle, styles.saveButtonText, isDisabled && styles.buttonTextDisabled]}>
                  Valider
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Stack.Screen
        name="edit/import"
        options={{
          headerTitleStyle: typography.header,
          headerTitle: "Importer",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleImportRecipe}
              style={[styles.actionButton, isLoading && styles.buttonDisabled]}
              disabled={isLoading}
            >
              <Text style={[typography.subtitle, styles.saveButtonText]}>Valider</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="edit/instructions/index"
        options={{
          headerTitleStyle: typography.header,
          headerTitle: `Étape ${(formCurrentInstruction?.index ?? formInstructions.length) + 1}`,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                if (!formCurrentInstruction) return;

                setFormInstructions((prev) => [
                  ...prev.slice(0, formCurrentInstruction.index),
                  formCurrentInstruction.value,
                  ...prev.slice(formCurrentInstruction.index + 1),
                ]);

                router.push({
                  pathname: "./[id]",
                  params: { id: formRecipe.id },
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
  addButton: {
    paddingHorizontal: 6,
  },
  cancelButtonText: {
    color: colors.gray,
  },
  saveButtonText: {
    color: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: colors.gray,
  },
});
