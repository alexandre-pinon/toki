import { Pill } from "@/components/Pill";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography } from "../../theme";

const fakeRecipe = {
  imageUrl: require("../../assets/images/desserts.png"),
  name: "Pâtes au saumon",
  lastTimeDone: "il y a 40 jours",
  type: "Plat",
  timesDone: 36,
  servings: 3,
  timers: [
    { icon: "time-outline", label: "65 min" },
    { icon: "nutrition-outline", label: "40 min" },
    { icon: "alarm-outline", label: "10 min" },
    { icon: "restaurant-outline", label: "15 min" },
  ],
  instructions: [
    "Lorem ipsum dolor sit amet consectetur. Auctor in nulla enim vel urna.",
    "Lorem ipsum dolor sit amet consectetur.",
    "Lorem ipsum dolor sit amet consectetur. Scelerisque velit sit proin amet eu ut. Luctus cras a vel est adipiscing faucibus nibh integer diam.",
  ],
  ingredients: [
    {
      id: "1",
      name: "Pâtes",
      quantity: 200,
      unit: "g",
    },
    {
      id: "2",
      name: "Crème fraîche",
      quantity: 20,
      unit: "cl",
    },
    {
      id: "3",
      name: "Saumon fumé",
      quantity: 100,
      unit: "g",
    },
    {
      id: "4",
      name: "Oignon",
      quantity: 1,
    },
    {
      id: "5",
      name: "Sel",
    },
    {
      id: "6",
      name: "Poivre",
    },
  ],
};

export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<"instructions" | "ingredients">("instructions");
  const [servings, setServings] = useState(fakeRecipe.servings);
  const insets = useSafeAreaInsets();
  // TODO: Fetch real recipe by id
  const recipe = fakeRecipe;

  const handleIncreaseServings = () => {
    setServings((prev) => prev + 1);
  };

  const handleDecreaseServings = () => {
    if (servings > 1) {
      setServings((prev) => prev - 1);
    }
  };

  const timerImages = [
    require("../../assets/images/clock.png"),
    require("../../assets/images/ingredient_preparation.png"),
    require("../../assets/images/clock_food.png"),
    require("../../assets/images/cooking.png"),
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={recipe.imageUrl} style={styles.image} resizeMode="cover" />
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top }]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={14} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.editButton, { top: insets.top }]}>
            <Image source={require("../../assets/images/pen.png")} style={styles.editButtonImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.mainInfoContainer}>
          <View style={styles.headerRow}>
            <Text style={[typography.header, styles.title]}>{recipe.name}</Text>
            <View style={styles.counter}>
              <Ionicons name="checkmark-circle" size={20} />
              <Text style={typography.body}>{recipe.timesDone}</Text>
            </View>
          </View>

          <Text style={[typography.body, styles.lastTimeDoneRow]}>
            Dernière fois faite : {recipe.lastTimeDone}
          </Text>

          <View style={styles.typeRow}>
            <Pill
              style={{
                backgroundColor: colors.contrast50,
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
              textStyle={{ fontWeight: "200" }}
            >
              {recipe.type}
            </Pill>
          </View>

          <View style={styles.servingsRow}>
            <View style={styles.servingsTextContainer}>
              <Image
                source={require("../../assets/images/servings.png")}
                style={styles.servingsImage}
              />
              <Text style={typography.subtitle}>
                {recipe.servings} personne{recipe.servings > 1 ? "s" : ""}
              </Text>
            </View>
            {/* <View style={styles.servingsControls}>
              <TouchableOpacity
                style={[styles.servingsButton]}
                onPress={handleDecreaseServings}
                disabled={servings <= 1}
              >
                <Ionicons name="remove" size={16} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.servingsButton} onPress={handleIncreaseServings}>
                <Ionicons name="add" size={16} />
              </TouchableOpacity>
            </View> */}
          </View>

          <View style={styles.timersRow}>
            <View style={styles.timerItem}>
              <Image source={timerImages[0]} style={styles.timerImage} />
              <Text style={[typography.body, styles.timerText]}>{recipe.timers[0].label}</Text>
            </View>
            <View style={styles.timerSeparator} />
            {recipe.timers.slice(1).map((timer, idx) => (
              <View key={idx} style={styles.timerItem}>
                <Image source={timerImages[idx + 1]} style={styles.timerImage} />
                <Text style={[typography.body, styles.timerText]}>{timer.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            <TouchableOpacity style={styles.tabButton} onPress={() => setTab("instructions")}>
              <Text
                style={[
                  typography.header,
                  styles.tabText,
                  tab === "instructions" && styles.tabTextActive,
                ]}
              >
                Instructions
              </Text>
              <View
                style={[styles.tabIndicator, tab === "instructions" && styles.tabIndicatorActive]}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton} onPress={() => setTab("ingredients")}>
              <Text
                style={[
                  typography.header,
                  styles.tabText,
                  tab === "ingredients" && styles.tabTextActive,
                ]}
              >
                Ingrédients
              </Text>
              <View
                style={[styles.tabIndicator, tab === "ingredients" && styles.tabIndicatorActive]}
              />
            </TouchableOpacity>
          </View>
          {tab === "instructions" ? (
            <View style={styles.instructionsTabContent}>
              {recipe.instructions.map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <Text style={[typography.bodyLarge, styles.stepTitle]}>Étape {idx + 1}</Text>
                  <Text style={[typography.bodyLarge, styles.stepText]}>{step}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.ingredientsTabContent}>
              {recipe.ingredients.map((ingredient, idx) => (
                <View key={idx} style={styles.ingredientRow}>
                  <Text style={[typography.body, styles.bulletText]}>{"\u2022"}</Text>
                  <Text style={[typography.body, styles.ingredientText]}>{ingredient.name}</Text>
                  {ingredient.quantity && (
                    <Text style={[typography.body, styles.ingredientSubtext]}>
                      {ingredient.quantity}
                    </Text>
                  )}
                  {ingredient.unit && (
                    <Text style={[typography.body, styles.ingredientSubtext]}>
                      {ingredient.unit}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    width: "100%",
    height: width * 0.65,
    position: "relative",
    backgroundColor: colors.gray100,
  },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    position: "absolute",
    left: 20,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 10,
  },
  editButton: {
    position: "absolute",
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 10,
  },
  editButtonImage: {
    width: 14,
    height: 14,
  },
  mainInfoContainer: {
    paddingVertical: 24,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingHorizontal: 24,
  },
  title: {
    flex: 1,
    fontWeight: "600",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  lastTimeDoneRow: {
    color: colors.gray600,
    paddingHorizontal: 24,
  },
  typeRow: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  servingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  servingsImage: {
    width: 16,
    height: 16,
  },
  servingsTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  servingsControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  servingsButton: {
    padding: 8,
    borderRadius: 24,
    backgroundColor: colors.gray50,
  },
  timersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingVertical: 16,
    backgroundColor: colors.contrast50,
  },
  timerItem: {
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  timerSeparator: {
    width: 1,
    height: 48,
    backgroundColor: colors.gray200,
  },
  timerImage: {
    width: 24,
    height: 24,
  },
  timerText: {
    fontSize: 12,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  tabsRow: {
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  tabIndicator: {
    width: 55,
    height: 1,
    backgroundColor: "transparent",
  },
  tabIndicatorActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontWeight: "300",
  },
  tabTextActive: {
    color: colors.primary,
  },
  instructionsTabContent: {
    gap: 24,
  },
  ingredientsTabContent: {},
  stepRow: {
    gap: 4,
  },
  stepTitle: {
    fontSize: 14,
  },
  stepText: {
    fontSize: 14,
    color: colors.gray600,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bulletText: {
    fontSize: 24,
  },
  ingredientText: {
    marginHorizontal: 8,
  },
  ingredientSubtext: {
    color: colors.gray600,
  },
});
