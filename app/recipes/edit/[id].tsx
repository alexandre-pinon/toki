import { BottomSheetPicker } from "@/components/BottomSheetPicker";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { RecipeTabs } from "@/components/RecipeTabs";
import { ServingsInput } from "@/components/ServingsInput";
import { SwipeableItem } from "@/components/SwipeableItem";
import { UnderlinedListItem } from "@/components/UnderlinedListItem";
import { useFormRecipe } from "@/contexts/FormRecipeContext";
import { colors, typography } from "@/theme";
import { getTotalTime } from "@/types/recipe/recipe";
import { isRecipeType, mapRecipeTypeToName, RecipeType, recipeTypes } from "@/types/recipe/recipe-type";
import { formatQuantityAndUnit } from "@/types/unit-type";
import { capitalize } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeEditScreen() {
  const {
    formRecipe,
    setFormRecipe,
    formIngredients,
    setFormIngredients,
    formInstructions,
    setFormInstructions,
    setFormCurrentIngredient,
    setFormCurrentInstruction,
    activeTab,
    setActiveTab,
    isLoading,
  } = useFormRecipe();

  const [showPicker, setShowPicker] = useState(false);
  const [previousType, setPreviousType] = useState<RecipeType | undefined>();

  const handlePickerSelect = (value?: string) => {
    if (value && isRecipeType(value)) {
      setFormRecipe((prev) => ({ ...prev, type: value }));
    }
  };

  const getPickerOptions = () => {
    return recipeTypes.map((recipeType) => ({
      label: capitalize(mapRecipeTypeToName(recipeType)),
      value: recipeType,
    }));
  };

  const openPicker = () => {
    setPreviousType(formRecipe.type);
    setShowPicker(true);
  };

  const closePicker = () => {
    setShowPicker(false);
  };

  const displayActiveTab = () => {
    switch (activeTab) {
      case "ingredients":
        return (
          <>
            {formIngredients.map((ingredient, index) => (
              <SwipeableItem
                key={ingredient.ingredientId}
                onEdit={() => {
                  setFormCurrentIngredient(ingredient);
                  router.push({ pathname: "./ingredients/quantity" });
                }}
                onDelete={() => setFormIngredients((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])}
              >
                <View style={styles.listItemContainer}>
                  <UnderlinedListItem
                    title={ingredient.name}
                    subTitle={formatQuantityAndUnit(ingredient.quantity, ingredient.unit)}
                    isLastItem={index === formIngredients.length - 1}
                  />
                </View>
              </SwipeableItem>
            ))}
            <View style={[styles.section, styles.addButtonContainer]}>
              <TouchableOpacity style={styles.addButton} onPress={() => router.push({ pathname: "./ingredients" })}>
                <Ionicons name="add" size={12} color={colors.primary} />
                <Text style={styles.addButtonText}>Ajouter un ingrédient</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case "instructions":
        return (
          <>
            {formInstructions.map((instruction, index) => (
              <SwipeableItem
                key={`edit-instruction-item-${index}`}
                onEdit={() => {
                  setFormCurrentInstruction({ value: instruction, index });
                  router.push({ pathname: `./instructions` });
                }}
                onDelete={() => setFormInstructions((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])}
              >
                <View style={styles.listItemContainer}>
                  <UnderlinedListItem
                    title={`Étape ${index + 1}`}
                    subTitle={instruction}
                    isLastItem={index === formInstructions.length - 1}
                  />
                </View>
              </SwipeableItem>
            ))}
            <View style={[styles.section, styles.addButtonContainer]}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setFormCurrentInstruction(null);
                  router.push({ pathname: "./instructions" });
                }}
              >
                <Ionicons name="add" size={12} color={colors.primary} />
                <Text style={styles.addButtonText}>Ajouter une étape</Text>
              </TouchableOpacity>
            </View>
          </>
        );
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      if (!result.assets.at(0)?.mimeType) {
        Alert.alert("Erreur", "Veuillez sélectionner une image valide.");
        return;
      }

      setFormRecipe((prev) => ({
        ...prev,
        imageUrl: result.assets.at(0)?.uri,
        imageType: result.assets.at(0)?.mimeType,
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView}>
        {/* Recipe Name */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image source={require("@/assets/images/pen_color.png")} style={styles.sectionIcon} />
            <Text style={[typography.subtitle]}>Nom</Text>
          </View>
          <TextInput
            style={styles.nameInput}
            value={formRecipe.name}
            onChangeText={(name) => setFormRecipe((prev) => ({ ...prev, name }))}
            placeholder="Nom de la recette"
            placeholderTextColor={colors.gray400}
          />
        </View>

        {/* Recipe Image */}
        <View style={styles.section}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {formRecipe.imageUrl ? (
              <Image source={{ uri: formRecipe.imageUrl }} style={styles.recipeImage} contentFit="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color={colors.gray400} />
                <Text style={[typography.body, styles.imagePlaceholderText]}>Ajouter une image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Servings */}
        <View style={styles.section}>
          <View style={styles.servingsRow}>
            <View style={styles.servingsInfo}>
              <Image source={require("@/assets/images/servings.png")} style={styles.servingsIcon} />
              <Text style={[typography.subtitle]}>
                {formRecipe.servings} personne{formRecipe.servings > 1 ? "s" : ""}
              </Text>
            </View>
            <ServingsInput
              onTapMinus={() => setFormRecipe((prev) => ({ ...prev, servings: Math.max(1, prev.servings - 1) }))}
              onTapPlus={() => setFormRecipe((prev) => ({ ...prev, servings: prev.servings + 1 }))}
            />
          </View>
        </View>

        {/* Timers */}
        <View style={styles.timersRow}>
          <View style={styles.timerItem}>
            <Image source={require("@/assets/images/clock.png")} style={styles.timeIcon} />
            <Text style={[typography.body, styles.timerLabel]}>{getTotalTime(formRecipe).toString()} min</Text>
          </View>
          <View style={styles.timerSeparator} />
          <View style={styles.timerItem}>
            <Image source={require("@/assets/images/ingredient_preparation.png")} style={styles.timeIcon} />
            <TextInput
              style={[typography.body, styles.timeInput]}
              value={(formRecipe.preparationTime ?? 0).toString()}
              onChangeText={(time) => setFormRecipe((prev) => ({ ...prev, preparationTime: +time }))}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.timerItem}>
            <Image source={require("@/assets/images/clock_food.png")} style={styles.timeIcon} />
            <TextInput
              style={[typography.body, styles.timeInput]}
              value={(formRecipe.restTime ?? 0).toString()}
              onChangeText={(time) => setFormRecipe((prev) => ({ ...prev, restTime: +time }))}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <View style={styles.timerItem}>
            <Image source={require("@/assets/images/cooking.png")} style={styles.timeIcon} />
            <TextInput
              style={[typography.body, styles.timeInput]}
              value={(formRecipe.cookingTime ?? 0).toString()}
              onChangeText={(time) => setFormRecipe((prev) => ({ ...prev, cookingTime: +time }))}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        </View>

        {/* Recipe Type */}
        <View style={styles.section}>
          <TouchableOpacity onPress={openPicker} style={styles.typeSelector}>
            <Text style={[typography.body, styles.typeText]}>{capitalize(mapRecipeTypeToName(formRecipe.type))}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.gray400} />
          </TouchableOpacity>
        </View>

        <RecipeTabs tab={activeTab} setTab={setActiveTab} />
        <View style={styles.tabSection}>{displayActiveTab()}</View>
      </ScrollView>

      <BottomSheetPicker
        visible={showPicker}
        title={"Type de recette"}
        options={getPickerOptions()}
        selectedValue={formRecipe.type}
        previousValue={previousType}
        onSelect={handlePickerSelect}
        onClose={closePicker}
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
  tabSection: {
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
    borderColor: colors.gray200,
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  imageContainer: {
    height: 255,
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
    borderColor: colors.gray200,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray200,
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  typeText: {
    fontSize: 12,
  },
  listItemContainer: {
    paddingLeft: 20,
  },
  addButtonText: {
    color: colors.primary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  addButtonContainer: {
    alignItems: "center",
  },
});
