import { FormIngredientProvider, useFormIngredient } from "@/contexts/FormIngredientContext";
import { IngredientListProvider } from "@/contexts/IngredientListContext";
import { colors, typography } from "@/theme";
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
  const { isLoading, formIngredient, upsertIngredient } = useFormIngredient();

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    console.log("SAVE INGREDIENT");
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
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={styles.actionButton} disabled={!formIngredient || isLoading}>
              <Text style={[typography.subtitle, styles.saveButtonText]}>Valider</Text>
            </TouchableOpacity>
          ),
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
});
