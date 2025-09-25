import { BottomSheetPicker } from "@/components/BottomSheetPicker";
import { useFormIngredient } from "@/contexts/FormIngredientContext";
import { colors, typography } from "@/theme";
import {
  isShoppingItemCategory,
  mapShoppingItemCategoryToName,
  shoppingItemCategories,
  ShoppingItemCategory,
} from "@/types/shopping/shopping-item-category";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileIngredientsEditScreen() {
  const { isLoading, formIngredient, setFormIngredient } = useFormIngredient();

  const [showPicker, setShowPicker] = useState(false);
  const [previousCategory, setPreviousCategory] = useState<ShoppingItemCategory>("other");

  const getPickerOptions = () => {
    return shoppingItemCategories.map((category) => ({
      label: mapShoppingItemCategoryToName(category),
      value: category,
    }));
  };

  const handlePickerSelect = (value?: string) => {
    if (value && isShoppingItemCategory(value)) {
      setFormIngredient((prev) => (prev ? { ...prev, category: value } : null));
    } else {
      setFormIngredient((prev) => (prev ? { ...prev, category: "other" } : null));
    }
  };

  const openPicker = () => {
    setPreviousCategory(formIngredient?.category ?? "other");
    setShowPicker(true);
  };

  const closePicker = () => {
    setShowPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputsContainer}>
        <View style={styles.inputGroup}>
          <Text style={[typography.body, styles.label]}>Nom</Text>
          <TextInput
            style={[typography.body, styles.input]}
            value={formIngredient?.name}
            onChangeText={(value) => setFormIngredient((prev) => (prev ? { ...prev, name: value } : null))}
            placeholder="Nom de l'ingrédient"
            placeholderTextColor={colors.gray}
            autoFocus
            editable={!isLoading}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[typography.body, styles.label]}>Catégorie</Text>
          <TouchableOpacity onPress={openPicker} style={styles.categorySelector} disabled={isLoading}>
            <Text style={[typography.body, styles.categoryText, isLoading && styles.buttonDisabled]}>
              {mapShoppingItemCategoryToName(formIngredient?.category ?? "other")}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.gray400} />
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheetPicker
        visible={showPicker}
        title={"Catégorie"}
        options={getPickerOptions()}
        selectedValue={formIngredient?.category}
        previousValue={previousCategory}
        onSelect={handlePickerSelect}
        onClose={closePicker}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inputsContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: colors.gray,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryText: {
    fontSize: 12,
  },
  saveButton: {
    paddingHorizontal: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.primary,
  },
  saveButtonTextDisabled: {
    color: colors.gray,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
