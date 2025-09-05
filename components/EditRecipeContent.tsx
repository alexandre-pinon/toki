import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEditRecipe } from "../hooks/useEditRecipe";
import { colors, typography } from "../theme";
import type { RecipeDetails } from "../types/recipe/recipe";
import type { RecipeType } from "../types/recipe/recipe-type";
import { isRecipeType, mapRecipeTypeToName, recipeTypes } from "../types/recipe/recipe-type";
import { isUnitType, mapUnitTypeToName, unitTypes } from "../types/unit-type";
import { BottomSheetPicker } from "./BottomSheetPicker";
import { LoadingOverlay } from "./LoadingOverlay";

type EditRecipeContentProps = {
  recipeDetails: RecipeDetails;
};

type PickerType = "recipeType" | "unit" | "hide";

export function EditRecipeContent({ recipeDetails }: EditRecipeContentProps) {
  const { updateRecipe } = useEditRecipe(recipeDetails.recipe.id);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState(recipeDetails.recipe.name);
  const [type, setType] = useState<RecipeType>(recipeDetails.recipe.type);
  const [imageUrl, setImageUrl] = useState(recipeDetails.recipe.imageUrl);
  const [servings, setServings] = useState(recipeDetails.recipe.servings);
  const [preparationTime, setPreparationTime] = useState(recipeDetails.recipe.preparationTime || 0);
  const [cookingTime, setCookingTime] = useState(recipeDetails.recipe.cookingTime || 0);
  const [restTime, setRestTime] = useState(recipeDetails.recipe.restTime || 0);
  const [ingredients, setIngredients] = useState(recipeDetails.ingredients);
  const [instructions, setInstructions] = useState(recipeDetails.instructions);

  // Picker state
  const [showPicker, setShowPicker] = useState<PickerType>("hide");
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState<number>(-1);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await updateRecipe({
        name: name.trim(),
        type,
        imageUrl,
        preparationTime: preparationTime || undefined,
        cookingTime: cookingTime || undefined,
        restTime: restTime || undefined,
        servings,
        instructions: instructions.filter((instruction) => instruction.trim() !== ""),
        ingredients: ingredients.map((ingredient) => ({
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
      });
      router.back();
    } catch (error) {
      console.error("Error updating recipe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        recipeId: recipeDetails.recipe.id,
        ingredientId: "",
        name: "",
        quantity: undefined,
        unit: undefined,
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setIngredients(updatedIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const showRecipeTypePicker = () => {
    setShowPicker("recipeType");
  };

  const showUnitPicker = (ingredientIndex: number) => {
    setSelectedIngredientIndex(ingredientIndex);
    setShowPicker("unit");
  };

  const hidePicker = () => {
    setShowPicker("hide");
    setSelectedIngredientIndex(-1);
  };

  const handlePickerSelect = (value?: string) => {
    if (showPicker === "recipeType") {
      if (value && isRecipeType(value)) {
        setType(value);
      }
    } else if (showPicker === "unit") {
      if (selectedIngredientIndex >= 0) {
        const unit = value && isUnitType(value) ? value : undefined;
        updateIngredient(selectedIngredientIndex, "unit", unit);
      }
    }
  };

  const getPickerOptions = () => {
    if (showPicker === "recipeType") {
      return recipeTypes.map((recipeType) => ({
        label: mapRecipeTypeToName(recipeType),
        value: recipeType,
      }));
    } else if (showPicker === "unit") {
      return [
        { label: "Aucune", value: "" },
        ...unitTypes.map((unit) => ({
          label: mapUnitTypeToName(unit),
          value: unit,
        })),
      ];
    }
    return [];
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Recipe Name */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image source={require("../assets/images/pen_color.png")} style={styles.sectionIcon} />
            <Text style={[typography.subtitle]}>Nom</Text>
          </View>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Nom de la recette"
            placeholderTextColor={colors.gray400}
          />
        </View>

        {/* Recipe Image */}
        <View style={styles.section}>
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.recipeImage} contentFit="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color={colors.gray400} />
                <Text style={[typography.body, styles.imagePlaceholderText]}>Ajouter une image</Text>
              </View>
            )}
          </View>
        </View>

        {/* Servings */}
        <View style={styles.section}>
          <View style={styles.servingsRow}>
            <View style={styles.servingsInfo}>
              <Image source={require("../assets/images/servings.png")} style={styles.servingsIcon} />
              <Text style={[typography.subtitle]}>
                {servings} personne{servings > 1 ? "s" : ""}
              </Text>
            </View>
            <View style={styles.servingsControls}>
              <TouchableOpacity onPress={() => setServings(Math.max(1, servings - 1))} style={styles.servingsButton}>
                <Ionicons name="remove" size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setServings(servings + 1)} style={styles.servingsButton}>
                <Ionicons name="add" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Timers */}
        <View style={styles.timersRow}>
          <View style={styles.timerItem}>
            <Image source={require("../assets/images/clock.png")} style={styles.timeIcon} />
            <Text style={[typography.body, styles.timerLabel]}>
              {(preparationTime + cookingTime + restTime).toString()} min
            </Text>
          </View>
          <View style={styles.timerSeparator} />
          <View style={styles.timerItem}>
            <Image source={require("../assets/images/ingredient_preparation.png")} style={styles.timeIcon} />
            <TextInput
              style={[typography.body, styles.timeInput]}
              value={preparationTime.toString()}
              onChangeText={(text) => setPreparationTime(parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.timerItem}>
            <Image source={require("../assets/images/clock_food.png")} style={styles.timeIcon} />
            <TextInput
              style={[typography.body, styles.timeInput]}
              value={restTime.toString()}
              onChangeText={(text) => setRestTime(parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.timerItem}>
            <Image source={require("../assets/images/cooking.png")} style={styles.timeIcon} />
            <TextInput
              style={[typography.body, styles.timeInput]}
              value={cookingTime.toString()}
              onChangeText={(text) => setCookingTime(parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        </View>

        {/* Recipe Type */}
        <View style={styles.section}>
          <TouchableOpacity onPress={showRecipeTypePicker} style={styles.typeSelector}>
            <Text style={[typography.body, styles.typeText]}>{mapRecipeTypeToName(type)}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.gray400} />
          </TouchableOpacity>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={[typography.subtitle]}>Ingrédients</Text>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <TextInput
                style={styles.ingredientNameInput}
                value={ingredient.name}
                onChangeText={(text) => updateIngredient(index, "name", text)}
                placeholder="Nom de l'ingrédient"
                placeholderTextColor={colors.gray400}
              />
              <TextInput
                style={styles.ingredientQuantityInput}
                value={ingredient.quantity?.toString() || ""}
                onChangeText={(text) => updateIngredient(index, "quantity", parseFloat(text) || undefined)}
                placeholder="Qté"
                placeholderTextColor={colors.gray400}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={() => showUnitPicker(index)} style={styles.unitSelector}>
                <Text style={[typography.body, styles.unitText]}>
                  {ingredient.unit ? mapUnitTypeToName(ingredient.unit) : "Unité"}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.gray400} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeIngredient(index)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color={colors.alert} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
            <Text style={[typography.body, styles.addButtonText]}>+ Ajouter un ingrédient</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={[typography.subtitle]}>Instructions</Text>
          {instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionRow}>
              <Text style={[typography.body, styles.instructionNumber]}>{index + 1}.</Text>
              <TextInput
                style={styles.instructionInput}
                value={instruction}
                onChangeText={(text) => updateInstruction(index, text)}
                placeholder="Étape de préparation"
                placeholderTextColor={colors.gray400}
                multiline
              />
              <TouchableOpacity onPress={() => removeInstruction(index)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color={colors.alert} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addInstruction} style={styles.addButton}>
            <Text style={[typography.body, styles.addButtonText]}>+ Ajouter une instruction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomSheetPicker
        visible={showPicker !== "hide"}
        title={showPicker === "recipeType" ? "Type de recette" : "Unité"}
        onClose={hidePicker}
        onSelect={handlePickerSelect}
        options={getPickerOptions()}
      />

      <LoadingOverlay visible={isSaving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  nameInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray300,
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  imageContainer: {
    height: 200,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: 8,
    overflow: "hidden",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray100,
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: colors.gray400,
  },
  servingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  servingsInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  servingsIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
  },
  servingsControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  servingsButton: {
    padding: 4,
    marginHorizontal: 4,
    backgroundColor: colors.gray50,
    borderRadius: 99,
  },
  timersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingVertical: 14,
    backgroundColor: colors.contrast50,
  },
  timerItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 4,
  },
  timerSeparator: {
    width: 1,
    backgroundColor: colors.gray200,
  },
  timeIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  timeInput: {
    textAlign: "center",
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray300,
    borderRadius: 10,
    paddingVertical: 4,
    fontSize: 12,
    width: 60,
  },
  timerLabel: {
    fontSize: 12,
  },
  typeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
  },
  typeText: {},
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ingredientNameInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  ingredientQuantityInput: {
    width: 60,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    textAlign: "center",
  },
  unitSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    minWidth: 80,
  },
  unitText: {
    flex: 1,
    textAlign: "center",
  },
  removeButton: {
    padding: 4,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  instructionNumber: {
    width: 30,
    marginRight: 8,
    marginTop: 8,
    fontWeight: "600",
  },
  instructionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    minHeight: 40,
  },
  addButton: {
    marginTop: 8,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
});
