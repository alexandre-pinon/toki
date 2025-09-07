import { EditRecipeContent } from "@/components/EditRecipeContent";
import { EditRecipeError } from "@/components/EditRecipeError";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useEditRecipe } from "@/hooks/useEditRecipe";
import { colors, typography } from "@/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditRecipeScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { recipeDetails, isLoading, error } = useEditRecipe(recipeId);

  if (error || (!isLoading && !recipeDetails)) {
    return (
      <View style={styles.root}>
        <Header />
        <SafeAreaView style={styles.container}>
          <EditRecipeError error={error} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Header headerTitle={recipeDetails?.recipe.name} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        {recipeDetails && <EditRecipeContent recipeDetails={recipeDetails} />}
        <LoadingOverlay visible={isLoading} />
      </SafeAreaView>
    </View>
  );
}

type HeaderProps = {
  headerTitle?: string;
};
const Header = ({ headerTitle }: HeaderProps) => (
  <Stack.Screen
    options={{
      headerTitleStyle: typography.header,
      headerTitle: headerTitle ?? "Edit recipe",
      headerShadowVisible: false,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: colors.black,
      headerRight: () => (
        <Pressable
          onPress={() => {
            console.log("validate edit");
          }}
          style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
        >
          <Text style={[typography.body, styles.saveButtonText]}>Valider</Text>
        </Pressable>
      ),
    }}
  />
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
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
