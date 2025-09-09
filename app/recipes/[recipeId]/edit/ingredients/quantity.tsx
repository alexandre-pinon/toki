import { BottomSheetPicker } from "@/components/BottomSheetPicker";
import { useFormRecipe } from "@/contexts/CurrentFormRecipeContext";
import { colors, typography } from "@/theme";
import { mapShoppingItemCategoryToImageSource } from "@/types/shopping/shopping-item-category";
import { isUnitType, mapUnitTypeToName, UnitType, unitTypes } from "@/types/unit-type";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeEditIngredientQuantityScreen() {
  const { formCurrentIngredient, setFormCurrentIngredient } = useFormRecipe();

  const [showPicker, setShowPicker] = useState(false);
  const [previousUnit, setPreviousUnit] = useState<UnitType | undefined>();
  const [quantityString, setQuantityString] = useState(formCurrentIngredient?.quantity?.toString() ?? "");

  const handlePickerSelect = (value?: string) => {
    if (value && isUnitType(value)) {
      setFormCurrentIngredient((prev) => (prev ? { ...prev, unit: value } : null));
    } else {
      setFormCurrentIngredient((prev) => (prev ? { ...prev, unit: undefined } : null));
    }
  };

  const getPickerOptions = () => {
    return [
      { label: "Aucune", value: "" },
      ...unitTypes.map((unit) => ({
        label: mapUnitTypeToName(unit),
        value: unit,
      })),
    ];
  };

  const openPicker = () => {
    setPreviousUnit(formCurrentIngredient?.unit);
    setShowPicker(true);
  };

  const closePicker = () => {
    setShowPicker(false);
  };

  const onChangeQuantity = (value: string) => {
    setQuantityString(value);

    const quantity = Number.parseFloat(value);
    if (Number.isNaN(quantity)) return;

    setFormCurrentIngredient((prev) => {
      if (!prev) return null;
      return { ...prev, quantity };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          source={mapShoppingItemCategoryToImageSource(formCurrentIngredient?.category ?? "other")}
          style={styles.ingredientIcon}
        />
        <Text style={[typography.bodyLarge, styles.ingredientName]}>{formCurrentIngredient?.name ?? "ingrédient"}</Text>
      </View>

      <View style={styles.inputsContainer}>
        <View style={styles.inputGroup}>
          <Text style={[typography.body, styles.label]}>Quantité</Text>
          <TextInput
            style={[typography.body, styles.input]}
            value={quantityString}
            onChangeText={onChangeQuantity}
            placeholder="Quantité"
            placeholderTextColor={colors.gray}
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[typography.body, styles.label]}>Unité</Text>
          <TouchableOpacity onPress={openPicker} style={styles.unitSelector} disabled={!formCurrentIngredient}>
            <Text
              style={[typography.body, styles.unitText, !formCurrentIngredient?.unit && styles.pickerButtonPlaceholder]}
            >
              {formCurrentIngredient?.unit ? mapUnitTypeToName(formCurrentIngredient.unit) : "Sélectionner"}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.gray400} />
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheetPicker
        visible={showPicker}
        title={"Unité"}
        options={getPickerOptions()}
        selectedValue={formCurrentIngredient?.unit}
        previousValue={previousUnit}
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
    paddingHorizontal: 16,
    rowGap: 40,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  ingredientIcon: {
    width: 20,
    height: 20,
  },
  ingredientName: {
    textTransform: "capitalize",
  },
  inputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
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
