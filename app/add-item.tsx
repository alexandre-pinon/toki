import { BottomSheetPicker } from "@/components/BottomSheetPicker";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { colors, commonStyles, typography } from "@/theme";
import type { ShoppingItemCategory } from "@/types/shopping/shopping-item-category";
import {
  isShoppingItemCategory,
  mapShoppingItemCategoryToName,
  shoppingItemCategories,
} from "@/types/shopping/shopping-item-category";
import type { UnitType } from "@/types/unit-type";
import { isUnitType, mapUnitTypeToName, unitTypes } from "@/types/unit-type";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PickerType = "unit" | "category" | "hide";

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<string | undefined>();
  const [unit, setUnit] = useState<UnitType | undefined>();
  const [category, setCategory] = useState<ShoppingItemCategory>("other");
  const [showPicker, setShowPicker] = useState<PickerType>("hide");
  const [previousUnit, setPreviousUnit] = useState<UnitType | undefined>();
  const [previousCategory, setPreviousCategory] = useState<ShoppingItemCategory>("other");
  const { addItem, isLoading } = useShoppingList();
  const { session } = useAuth();

  const handleSave = async () => {
    if (!name.trim()) return;
    if (!session) return;

    await addItem({
      name: name.trim().toLowerCase(),
      quantity: quantity ? Number.parseFloat(quantity) : 1,
      unit,
      checked: false,
      category,
      userId: session.user.id,
    });

    router.back();
  };

  const showUnitPicker = () => {
    setPreviousUnit(unit);
    setShowPicker("unit");
  };

  const showCategoryPicker = () => {
    setPreviousCategory(category);
    setShowPicker("category");
  };

  const hidePicker = () => {
    setShowPicker("hide");
  };

  const handlePickerSelect = (value?: string) => {
    if (showPicker === "unit") {
      value ? setUnit(isUnitType(value) ? value : undefined) : setUnit(undefined);
    } else if (showPicker === "category") {
      value ? setCategory(isShoppingItemCategory(value) ? value : "other") : setCategory("other");
    }
  };

  const getPickerOptions = () => {
    if (showPicker === "unit") {
      return [
        { label: "Aucune", value: "" },
        ...unitTypes.map((unit) => ({
          label: mapUnitTypeToName(unit),
          value: unit,
        })),
      ];
    }
    if (showPicker === "category") {
      return shoppingItemCategories.map((cat) => ({
        label: mapShoppingItemCategoryToName(cat),
        value: cat,
      }));
    }

    return [];
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Nouvel article",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerStyle: commonStyles.headerStyle,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
              <Text style={[typography.body, styles.cancelButton, isLoading && styles.buttonDisabled]}>Annuler</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSave}
              disabled={!name.trim() || isLoading}
              style={[styles.saveButton, (!name.trim() || isLoading) && styles.saveButtonDisabled]}
            >
              <Text
                style={[
                  typography.body,
                  styles.saveButtonText,
                  (!name.trim() || isLoading) && styles.saveButtonTextDisabled,
                ]}
              >
                Valider
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[typography.body, styles.label]}>Nom</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Pommes"
              placeholderTextColor={colors.gray}
              autoFocus
              editable={!isLoading}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.quantityInput]}>
              <Text style={[typography.body, styles.label]}>Quantité</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="1"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>

            <View style={[styles.inputGroup, styles.unitInput]}>
              <Text style={[typography.body, styles.label]}>Unité</Text>
              <TouchableOpacity onPress={showUnitPicker} style={styles.pickerButton} disabled={isLoading}>
                <Text
                  style={[
                    typography.body,
                    unit ? styles.pickerButtonText : styles.pickerButtonPlaceholder,
                    isLoading && styles.buttonDisabled,
                  ]}
                >
                  {unit ? mapUnitTypeToName(unit) : "Sélectionner"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[typography.body, styles.label]}>Catégorie</Text>
            <TouchableOpacity onPress={showCategoryPicker} style={styles.pickerButton} disabled={isLoading}>
              <Text style={[typography.body, styles.pickerButtonText, isLoading && styles.buttonDisabled]}>
                {mapShoppingItemCategoryToName(category)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <BottomSheetPicker
        visible={showPicker !== "hide"}
        title={showPicker === "unit" ? "Sélectionner une unité" : "Sélectionner une catégorie"}
        options={getPickerOptions()}
        selectedValue={showPicker === "unit" ? unit : category}
        previousValue={showPicker === "unit" ? previousUnit : previousCategory}
        onSelect={handlePickerSelect}
        onClose={hidePicker}
      />

      <LoadingOverlay visible={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  quantityInput: {
    flex: 1,
  },
  unitInput: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
    color: colors.gray,
  },
  input: {
    ...typography.body,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray300,
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  pickerButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray300,
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
    justifyContent: "center",
  },
  pickerButtonText: {
    color: colors.black,
  },
  pickerButtonPlaceholder: {
    color: colors.gray,
  },
  cancelButton: {
    color: colors.gray,
    paddingHorizontal: 8,
  },
  saveButton: {
    paddingHorizontal: 8,
  },
  saveButtonPressed: {
    opacity: 0.7,
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
