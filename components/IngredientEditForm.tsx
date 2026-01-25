import { BottomSheetPicker } from "@/components/BottomSheetPicker";
import { useFormIngredient } from "@/contexts/FormIngredientContext";
import { colors, typography } from "@/theme";
import { IngredientTag, ingredientTags, isIngredientTag, mapIngredientTagToName } from "@/types/ingredient";
import {
  isShoppingItemCategory,
  mapShoppingItemCategoryToName,
  shoppingItemCategories,
  ShoppingItemCategory,
} from "@/types/shopping/shopping-item-category";
import { capitalize } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IngredientEditFormProps = {
  onSave: () => Promise<void>;
  onCancel: () => void;
};

type PickerType = "category" | "tag" | "hidden";

export function IngredientEditForm({ onSave, onCancel }: IngredientEditFormProps) {
  const { isLoading, formIngredient, setFormIngredient } = useFormIngredient();

  const [showPicker, setShowPicker] = useState<PickerType>("hidden");
  const [previousCategory, setPreviousCategory] = useState<ShoppingItemCategory>("other");
  const [previousTag, setPreviousTag] = useState<IngredientTag | null>(null);

  const getPickerTitle = () => {
    switch (showPicker) {
      case "category":
        return "Catégorie";
      case "tag":
        return "Tag";
      default:
        return "";
    }
  };

  const getPickerValues = () => {
    switch (showPicker) {
      case "category":
        return { selected: formIngredient?.category ?? "other", previous: previousCategory };
      case "tag":
        return { selected: formIngredient?.tag ?? null, previous: previousTag };
      default:
        return { selected: null, previous: null };
    }
  };

  const getPickerOptions = () => {
    switch (showPicker) {
      case "category":
        return shoppingItemCategories.map((category) => ({
          label: mapShoppingItemCategoryToName(category),
          value: category,
        }));
      case "tag":
        return ingredientTags.map((tag) => ({
          label: capitalize(mapIngredientTagToName(tag)),
          value: tag,
        }));
      default:
        return [];
    }
  };

  const handlePickerSelect = (value?: string | null) => {
    switch (showPicker) {
      case "category":
        if (value && isShoppingItemCategory(value)) {
          setFormIngredient((prev) => (prev ? { ...prev, category: value } : null));
        } else {
          setFormIngredient((prev) => (prev ? { ...prev, category: "other" } : null));
        }
        break;
      case "tag":
        if (value && isIngredientTag(value)) {
          setFormIngredient((prev) => (prev ? { ...prev, tag: value } : null));
        } else {
          setFormIngredient((prev) => (prev ? { ...prev, tag: null } : null));
        }
        break;
    }
  };

  const openPicker = (pickerType: Exclude<PickerType, "hidden">) => {
    switch (pickerType) {
      case "category":
        setPreviousCategory(formIngredient?.category ?? "other");
        break;
      case "tag":
        setPreviousTag(formIngredient?.tag ?? null);
        break;
      default:
        throw new Error(`Impossible to open picker with type ${pickerType}`);
    }
    setShowPicker(pickerType);
  };

  const closePicker = () => {
    setShowPicker("hidden");
  };

  const handleSave = async () => {
    await onSave();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Ingrédient",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={onCancel} style={styles.actionButton} disabled={isLoading}>
              <Text style={[typography.subtitle, styles.cancelButtonText]}>Annuler</Text>
            </TouchableOpacity>
          ),
          headerRight: () => {
            const isDisabled = !formIngredient || !formIngredient.name || isLoading;
            return (
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.actionButton, isDisabled && styles.buttonDisabled]}
                disabled={isDisabled}
              >
                <Text style={[typography.subtitle, styles.saveButtonText, isDisabled && styles.buttonTextDisabled]}>
                  Valider
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      />
      <View style={styles.inputsContainer}>
        <View style={styles.inputGroup}>
          <Text style={[typography.body, styles.label]}>Nom</Text>
          <TextInput
            style={[typography.body, styles.input]}
            value={formIngredient?.name ? capitalize(formIngredient.name) : undefined}
            onChangeText={(value) => setFormIngredient((prev) => (prev ? { ...prev, name: value } : null))}
            placeholder="Nom de l'ingrédient"
            placeholderTextColor={colors.gray}
            autoFocus
            editable={!isLoading}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[typography.body, styles.label]}>Catégorie</Text>
          <TouchableOpacity onPress={() => openPicker("category")} style={styles.selector} disabled={isLoading}>
            <Text style={[typography.body, styles.pickerText, isLoading && styles.buttonDisabled]}>
              {mapShoppingItemCategoryToName(formIngredient?.category ?? "other")}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.gray400} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={[typography.body, styles.label]}>Tag</Text>
          <TouchableOpacity onPress={() => openPicker("tag")} style={styles.selector} disabled={isLoading}>
            <Text
              style={[
                typography.body,
                styles.pickerText,
                !formIngredient?.tag && styles.buttonTextDisabled,
                isLoading && styles.buttonDisabled,
              ]}
            >
              {formIngredient?.tag ? capitalize(mapIngredientTagToName(formIngredient.tag)) : "Sélectionner"}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.gray400} />
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheetPicker
        visible={showPicker !== "hidden"}
        title={getPickerTitle()}
        options={getPickerOptions()}
        selectedValue={getPickerValues().selected}
        previousValue={getPickerValues().previous}
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
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray200,
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  pickerText: {
    fontSize: 12,
  },
  actionButton: {
    paddingHorizontal: 8,
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
