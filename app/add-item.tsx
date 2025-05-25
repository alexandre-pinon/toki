import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetPicker } from "./components/BottomSheetPicker";
import { colors, typography } from "./theme";
import type { ShoppingItemCategory } from "./types/shopping/shopping-item-category";
import {
  isShoppingItemCategory,
  shoppingItemCategories,
} from "./types/shopping/shopping-item-category";
import type { UnitType } from "./types/unit-type";
import { isUnitType, mapUnitTypeToName, unitTypes } from "./types/unit-type";

type PickerType = "unit" | "category" | "hide";

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<string | undefined>();
  const [unit, setUnit] = useState<UnitType | undefined>();
  const [category, setCategory] = useState<ShoppingItemCategory>("Autre");
  const [showPicker, setShowPicker] = useState<PickerType>("hide");
  const [previousUnit, setPreviousUnit] = useState<UnitType | undefined>();
  const [previousCategory, setPreviousCategory] = useState<ShoppingItemCategory>("Autre");

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("save", name, quantity, unit, category);
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
      value ? setCategory(isShoppingItemCategory(value) ? value : "Autre") : setCategory("Autre");
    }
  };

  const getPickerOptions = () => {
    if (showPicker === "unit") {
      return unitTypes.map((unit) => ({ label: mapUnitTypeToName(unit), value: unit }));
    }
    if (showPicker === "category") {
      return shoppingItemCategories.map((cat) => ({ label: cat, value: cat }));
    }

    return [];
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Nouvel article",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Platform.OS === "ios" ? "transparent" : colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[typography.body, styles.cancelButton]}>Annuler</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSave}
              disabled={!name.trim()}
              style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
            >
              <Text
                style={[
                  typography.body,
                  styles.saveButtonText,
                  !name.trim() && styles.saveButtonTextDisabled,
                ]}
              >
                Ajouter
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[typography.body, styles.label]}>Nom</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Pommes"
              placeholderTextColor={colors.grey}
              autoFocus
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
                placeholderTextColor={colors.grey}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.unitInput]}>
              <Text style={[typography.body, styles.label]}>Unité</Text>
              <Pressable onPress={showUnitPicker} style={styles.pickerButton}>
                <Text
                  style={[
                    typography.body,
                    unit ? styles.pickerButtonText : styles.pickerButtonPlaceholder,
                  ]}
                >
                  {unit ? mapUnitTypeToName(unit) : "Sélectionner"}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[typography.body, styles.label]}>Catégorie</Text>
            <Pressable onPress={showCategoryPicker} style={styles.pickerButton}>
              <Text style={[typography.body, styles.pickerButtonText]}>{category}</Text>
            </Pressable>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.grey,
  },
  input: {
    ...typography.body,
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  pickerButton: {
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  pickerButtonText: {
    color: colors.text,
  },
  pickerButtonPlaceholder: {
    color: colors.grey,
  },
  cancelButton: {
    color: colors.grey,
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
    color: colors.grey,
  },
});
