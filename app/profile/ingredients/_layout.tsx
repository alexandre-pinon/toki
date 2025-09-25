import { FormIngredientProvider, useFormIngredient } from "@/contexts/FormIngredientContext";
import { IngredientListProvider } from "@/contexts/IngredientListContext";
import { colors, typography } from "@/theme";
import { createEmptyIngredient } from "@/types/ingredient";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ProfileIngredientsLayout() {
  return (
    <IngredientListProvider>
      <FormIngredientProvider>
        <ProfileIngredientsStack />
      </FormIngredientProvider>
    </IngredientListProvider>
  );
}

const ProfileIngredientsStack = () => {
  const { isLoading, formIngredient, setFormIngredient, upsertIngredient } = useFormIngredient();

  const handleCancel = () => {
    router.back();
  };

  const handleAdd = () => {
    setFormIngredient(createEmptyIngredient());
    router.push({ pathname: "./ingredients/edit" });
  };

  const handleSave = () => {
    upsertIngredient();
    router.push({ pathname: "./" });
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Ingrédients",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} disabled={isLoading}>
              <Ionicons name="chevron-back" size={28} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleAdd} style={styles.actionButton}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Ingrédient",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.actionButton} disabled={isLoading}>
              <Text style={[typography.subtitle, styles.cancelButtonText]}>Annuler</Text>
            </TouchableOpacity>
          ),
          headerRight: () => {
            const isDisabled = !formIngredient || !formIngredient.name || isLoading;
            return (
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.actionButton, isDisabled && styles.saveButtonDisabled]}
                disabled={isDisabled}
              >
                <Text style={[typography.subtitle, styles.saveButtonText, isDisabled && styles.saveButtonTextDisabled]}>
                  Valider
                </Text>
              </TouchableOpacity>
            );
          },
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
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonTextDisabled: {
    color: colors.gray,
  },
});
