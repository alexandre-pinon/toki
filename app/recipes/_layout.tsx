import { Loader } from "@/components/Loader";
import { CurrentRecipeProvider, useCurrentRecipe } from "@/contexts/CurrentRecipeContext";
import { FormRecipeProvider, useFormRecipe } from "@/contexts/FormRecipeContext";
import { colors, typography } from "@/theme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function RecipeDetailsLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <CurrentRecipeProvider id={id}>
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
    setFormIngredients,
    formInstructions,
    setFormInstructions,
    formCurrentIngredient,
    formCurrentInstruction,
    upsertRecipe,
    isLoading,
  } = useFormRecipe();

  const handleCancel = () => {
    router.dismissTo({ pathname: "./[id]", params: { id: formRecipe.id } });
  };

  const handleSave = () => {
    upsertRecipe();
    router.dismissTo({ pathname: "./[id]", params: { id: formRecipe.id } });
  };

  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit/[id]"
        options={{
          headerTitleStyle: typography.header,
          headerTitle,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.actionButton} disabled={isLoading}>
              <Text style={[typography.subtitle, styles.cancelButtonText]}>Annuler</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={styles.actionButton} disabled={isLoading}>
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
                  const indexToReplace = prev.findIndex(
                    (ingredient) => ingredient.ingredientId === formCurrentIngredient.ingredientId,
                  );

                  if (indexToReplace === -1) {
                    return [...prev, formCurrentIngredient];
                  }

                  return [...prev.slice(0, indexToReplace), formCurrentIngredient, ...prev.slice(indexToReplace + 1)];
                });

                router.push({
                  pathname: "../[id]",
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
  cancelButtonText: {
    color: colors.gray,
  },
  saveButtonText: {
    color: colors.primary,
  },
});
