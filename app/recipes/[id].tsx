import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Pill } from "@/components/Pill";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipeService } from "@/services/recipe";
import type { RecipeDetails } from "@/types/recipe/recipe";
import { formatQuantityAndUnit } from "@/types/unit-type";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography } from "../../theme";

export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { getRecipeById } = useRecipeService();
  const [tab, setTab] = useState<"instructions" | "ingredients">("instructions");
  const [servings, setServings] = useState(1);
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || !session?.user?.id) {
        setError("Missing recipe ID or user not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const details = await getRecipeById(id);
        setRecipeDetails(details);
        setServings(details.recipe.servings);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe");
        Alert.alert("Error", "Failed to load recipe details");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, session?.user?.id]);

  const timerImages = [
    require("../../assets/images/clock.png"),
    require("../../assets/images/ingredient_preparation.png"),
    require("../../assets/images/clock_food.png"),
    require("../../assets/images/cooking.png"),
  ];

  // Show error state
  if (error || (!loading && !recipeDetails)) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={[typography.header, styles.errorText]}>{error || "Recipe not found"}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={[typography.body, styles.retryButtonText]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { recipe, ingredients, instructions } = recipeDetails || {
    recipe: null,
    ingredients: [],
    instructions: [],
  };

  // Calculate timers based on recipe data
  const timers = [
    { icon: "time-outline", label: `${recipe?.preparationTime || 0} min` },
    { icon: "nutrition-outline", label: `${recipe?.cookingTime || 0} min` },
    { icon: "alarm-outline", label: "10 min" }, // Default value
    { icon: "restaurant-outline", label: "15 min" }, // Default value
  ];

  // Format last time done
  const formatLastTimeDone = (date?: Temporal.PlainDate) => {
    if (!date) return "Jamais faite";

    const now = Temporal.Now.plainDateISO();
    const diff = now.since(date);

    if (diff.days === 0) return "Aujourd'hui";
    if (diff.days === 1) return "Hier";
    if (diff.days < 7) return `il y a ${diff.days} jours`;
    if (diff.days < 30) return `il y a ${Math.floor(diff.days / 7)} semaines`;
    return `il y a ${Math.floor(diff.days / 30)} mois`;
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={recipe?.imageUrl ? { uri: recipe.imageUrl } : undefined}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
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
            <Text style={[typography.header, styles.title]}>{recipe?.name || "Loading..."}</Text>
            <View style={styles.counter}>
              <Ionicons name="checkmark-circle" size={20} />
              <Text style={typography.body}>{recipe?.timesDone || 0}</Text>
            </View>
          </View>

          <Text style={[typography.body, styles.lastTimeDoneRow]}>
            Dernière fois faite : {formatLastTimeDone(recipe?.lastTimeDone)}
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
              {recipe?.type || "Loading..."}
            </Pill>
          </View>

          <View style={styles.servingsRow}>
            <View style={styles.servingsTextContainer}>
              <Image
                source={require("../../assets/images/servings.png")}
                style={styles.servingsImage}
              />
              <Text style={typography.subtitle}>
                {servings} personne{servings > 1 ? "s" : ""}
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
              <Text style={[typography.body, styles.timerText]}>{timers[0].label}</Text>
            </View>
            <View style={styles.timerSeparator} />
            {timers.slice(1).map((timer, idx) => (
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
              {instructions.length > 0 ? (
                instructions.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <Text style={[typography.bodyLarge, styles.stepTitle]}>Étape {idx + 1}</Text>
                    <Text style={[typography.bodyLarge, styles.stepText]}>{step}</Text>
                  </View>
                ))
              ) : (
                <Text style={[typography.body, styles.noDataText]}>
                  Aucune instruction disponible
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.ingredientsTabContent}>
              {ingredients.length > 0 ? (
                ingredients.map((ingredient, idx) => (
                  <View key={idx} style={styles.ingredientRow}>
                    <Text style={[typography.body, styles.bulletText]}>{"\u2022"}</Text>
                    <Text style={[typography.body, styles.ingredientText]}>{ingredient.name}</Text>
                    {(ingredient.quantity || ingredient.unit) && (
                      <Text style={[typography.body, styles.ingredientSubtext]}>
                        {formatQuantityAndUnit(ingredient.quantity, ingredient.unit)}
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={[typography.body, styles.noDataText]}>
                  Aucun ingrédient disponible
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
  },
  noDataText: {
    textAlign: "center",
    color: colors.gray600,
    fontStyle: "italic",
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
