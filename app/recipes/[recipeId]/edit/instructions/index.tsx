import { useFormRecipe } from "@/contexts/CurrentFormRecipeContext";
import { colors, typography } from "@/theme";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditRecipeInstruction() {
  const { formInstructions, formCurrentInstruction, setFormCurrentInstruction } = useFormRecipe();

  const onChangeText = (value: string) => {
    setFormCurrentInstruction((prev) => ({ value, index: prev?.index ?? formInstructions.length }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textareaContainer}>
        <Text style={typography.subtitle}>Étape</Text>
        <TextInput
          style={[typography.body, styles.textarea]}
          value={formCurrentInstruction?.value}
          onChangeText={onChangeText}
          placeholder="Instruction..."
          placeholderTextColor={colors.gray}
          autoFocus
          multiline
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
  textareaContainer: {
    paddingHorizontal: 16,
    rowGap: 16,
  },
  textarea: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    minHeight: 100,
  },
  unitSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  unitText: {
    fontSize: 12,
  },
  pickerButtonPlaceholder: {
    color: colors.gray,
  },
});
