import { BottomSheetPicker } from "@/components/BottomSheetPicker";
import { RecipeTabName, RecipeTabs } from "@/components/RecipeTabs";
import { SwipeableItem } from "@/components/SwipeableItem";
import { UnderlinedListItem } from "@/components/UnderlinedListItem";
import { useFormRecipe } from "@/contexts/CurrentFormRecipeContext";
import { colors, typography } from "@/theme";
import { getTotalTime } from "@/types/recipe/recipe";
import { isRecipeType, mapRecipeTypeToName, RecipeType, recipeTypes } from "@/types/recipe/recipe-type";
import { formatQuantityAndUnit } from "@/types/unit-type";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeEditScreen() {
  const { formRecipe, setFormRecipe, formIngredients, setFormIngredients, formInstructions, setFormInstructions } =
    useFormRecipe();

  const [showPicker, setShowPicker] = useState(false);
  const [previousType, setPreviousType] = useState<RecipeType | undefined>();
  const [tab, setTab] = useState<RecipeTabName>("ingredients");

  const handlePickerSelect = (value?: string) => {
    if (value && isRecipeType(value)) {
      setFormRecipe((prev) => ({ ...prev, type: value }));
    }
  };

  const getPickerOptions = () => {
    return recipeTypes.map((recipeType) => ({
      label: mapRecipeTypeToName(recipeType),
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
    switch (tab) {
      case "ingredients":
        return (
          <>
            {formIngredients.map((ingredient, idx) => (
              <SwipeableItem
                key={ingredient.ingredientId}
                onEdit={() =>
                  router.push({
                    pathname: "./edit/ingredients/quantity",
                    params: { ingredientId: ingredient.ingredientId },
                  })
                }
                onDelete={() => setFormIngredients((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)])}
              >
                <View style={styles.listItemContainer}>
                  <UnderlinedListItem
                    title={ingredient.name}
                    subTitle={formatQuantityAndUnit(ingredient.quantity, ingredient.unit)}
                    isLastItem={idx === formIngredients.length - 1}
                  />
                </View>
              </SwipeableItem>
            ))}
            <View style={[styles.section, styles.addButtonContainer]}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push({ pathname: "./edit/ingredients" })}
              >
                <Ionicons name="add" size={12} color={colors.primary} />
                <Text style={styles.addButtonText}>Ajouter un ingrédient</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case "instructions":
        return (
          <>
            {formInstructions.map((instruction, idx) => (
              <SwipeableItem
                key={`edit-instruction-item-${idx}`}
                onEdit={() =>
                  router.push({
                    pathname: `./edit/instructions`,
                    params: { instruction },
                  })
                }
                onDelete={() => setFormInstructions((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)])}
              >
                <View style={styles.listItemContainer}>
                  <UnderlinedListItem
                    title={`Étape ${idx + 1}`}
                    subTitle={instruction}
                    isLastItem={idx === formInstructions.length - 1}
                  />
                </View>
              </SwipeableItem>
            ))}
            <View style={[styles.section, styles.addButtonContainer]}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push({ pathname: "./edit/instructions" })}
              >
                <Ionicons name="add" size={12} color={colors.primary} />
                <Text style={styles.addButtonText}>Ajouter une instruction</Text>
              </TouchableOpacity>
            </View>
          </>
        );
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
          <View style={styles.imageContainer}>
            {formRecipe.imageUrl ? (
              <Image source={{ uri: formRecipe.imageUrl }} style={styles.recipeImage} contentFit="cover" />
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
              <Image source={require("@/assets/images/servings.png")} style={styles.servingsIcon} />
              <Text style={[typography.subtitle]}>
                {formRecipe.servings} personne{formRecipe.servings > 1 ? "s" : ""}
              </Text>
            </View>
            <View style={styles.servingsControls}>
              <TouchableOpacity
                onPress={() => setFormRecipe((prev) => ({ ...prev, servings: Math.max(1, prev.servings - 1) }))}
                style={styles.servingsButton}
              >
                <Ionicons name="remove" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFormRecipe((prev) => ({ ...prev, servings: prev.servings + 1 }))}
                style={styles.servingsButton}
              >
                <Ionicons name="add" size={20} />
              </TouchableOpacity>
            </View>
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
            <Text style={[typography.body, styles.typeText]}>{mapRecipeTypeToName(formRecipe.type)}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.gray400} />
          </TouchableOpacity>
        </View>

        <RecipeTabs tab={tab} setTab={setTab} />
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
