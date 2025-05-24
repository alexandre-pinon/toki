import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "./theme";

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const handleSave = () => {
    // TODO: Implement save functionality
    router.back();
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
              <TextInput
                style={styles.input}
                value={unit}
                onChangeText={setUnit}
                placeholder="kg"
                placeholderTextColor={colors.grey}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  cancelButton: {
    color: colors.primary,
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
