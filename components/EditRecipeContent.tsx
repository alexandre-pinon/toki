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

export function EditRecipeContent({ recipeDetails }: EditRecipeContentProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [type, setType] = useState<RecipeType>(recipeDetails.recipe.type);
  const [previousType, setPreviousType] = useState<RecipeType | undefined>();

  const [name, setName] = useState(recipeDetails.recipe.name);
  const [imageUrl, setImageUrl] = useState(recipeDetails.recipe.imageUrl);
  const [servings, setServings] = useState(recipeDetails.recipe.servings);
  const [preparationTime, setPreparationTime] = useState(recipeDetails.recipe.preparationTime || 0);
  const [cookingTime, setCookingTime] = useState(recipeDetails.recipe.cookingTime || 0);
  const [restTime, setRestTime] = useState(recipeDetails.recipe.restTime || 0);

  const handlePickerSelect = (value?: string) => {
    if (value && isRecipeType(value)) {
      setType(value);
    }
  };

  const getPickerOptions = () => {
    return recipeTypes.map((recipeType) => ({
      label: mapRecipeTypeToName(recipeType),
      value: recipeType,
    }));
  };

  const openPicker = () => {
    setPreviousType(type);
    setShowPicker(true);
  };

  const closePicker = () => {
    setShowPicker(false);
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
          <TouchableOpacity onPress={openPicker} style={styles.typeSelector}>
            <Text style={[typography.body, styles.typeText]}>{mapRecipeTypeToName(type)}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.gray400} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomSheetPicker
        visible={showPicker}
        title={"Type de recette"}
        options={getPickerOptions()}
        selectedValue={type}
        previousValue={previousType}
        onSelect={handlePickerSelect}
        onClose={closePicker}
      />
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
});
