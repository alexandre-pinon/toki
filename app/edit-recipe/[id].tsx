import { EditRecipeContent } from "@/components/EditRecipeContent";
import { EditRecipeError } from "@/components/EditRecipeError";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useEditRecipe } from "@/hooks/useEditRecipe";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipeDetails, isLoading, error } = useEditRecipe(id);

  if (error || (!isLoading && !recipeDetails)) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <EditRecipeError error={error} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {recipeDetails && <EditRecipeContent recipeDetails={recipeDetails} />}
      <LoadingOverlay visible={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
