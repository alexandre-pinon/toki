import { useFormRecipe } from "@/contexts/FormRecipeContext";
import { colors, typography } from "@/theme";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeImportScreen() {
  const { isLoading, importUrl, setImportUrl } = useFormRecipe();

  useEffect(() => {
    setImportUrl("");
    openBrowserAsync(process.env.EXPO_PUBLIC_RECIPE_IMPORT_PROVIDER_URL!);
  }, [setImportUrl]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={[typography.body, styles.label]}>Lien</Text>
        <TextInput
          style={[typography.body, styles.input]}
          value={importUrl}
          onChangeText={setImportUrl}
          placeholder="Coller votre url"
          placeholderTextColor={colors.gray}
          editable={!isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inputContainer: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
    color: colors.gray,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray200,
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
});
