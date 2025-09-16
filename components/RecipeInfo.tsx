import { colors, typography } from "@/theme";
import { Meal } from "@/types/menu/meal";
import { getTotalTime, Recipe } from "@/types/recipe/recipe";
import { mapRecipeTypeToName } from "@/types/recipe/recipe-type";
import { formatDuration, formatLastTimeDone, mapPlainDateToDayName } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { Pill } from "./Pill";
import { ServingsInput } from "./ServingsInput";

type RecipeInfoProps = {
  recipe: Recipe;
  meal?: Meal;
  incrementServings?: () => void;
  decrementServings?: () => void;
};

export function RecipeInfo({ recipe, meal, incrementServings, decrementServings }: RecipeInfoProps) {
  const timerImages = [
    require("@/assets/images/clock.png"),
    require("@/assets/images/ingredient_preparation.png"),
    require("@/assets/images/clock_food.png"),
    require("@/assets/images/cooking.png"),
  ];

  const timers = [
    { icon: "time-outline", label: formatDuration(getTotalTime(recipe)) },
    { icon: "nutrition-outline", label: formatDuration(recipe.preparationTime) },
    { icon: "alarm-outline", label: formatDuration(recipe.restTime) },
    { icon: "restaurant-outline", label: formatDuration(recipe.cookingTime) },
  ];

  const displayServings = () => {
    if (meal) {
      return `${meal.servings} personne${meal.servings > 1 ? "s" : ""}`;
    }
    return `${recipe.servings} personne${recipe.servings > 1 ? "s" : ""}`;
  };

  return (
    <View style={styles.mainInfoContainer}>
      <View style={styles.headerRow}>
        <Text style={[typography.header, styles.title]}>{recipe.name}</Text>
        <View style={styles.counter}>
          <Ionicons name="checkmark-circle" size={20} />
          <Text style={typography.body}>{recipe.timesDone}</Text>
        </View>
      </View>

      <Text style={[typography.body, styles.lastTimeDoneRow]}>
        Dernière fois faite : {formatLastTimeDone(recipe.lastTimeDone)}
      </Text>

      <View style={styles.tagsRow}>
        <Pill style={styles.tagPill} textStyle={{ fontWeight: "200" }}>
          {mapRecipeTypeToName(recipe.type)}
        </Pill>
        {meal && (
          <Pill style={styles.tagPill} textStyle={{ fontWeight: "200" }}>
            {mapPlainDateToDayName(meal.date)}
          </Pill>
        )}
      </View>

      <View style={styles.servingsRow}>
        <View style={styles.servingsTextContainer}>
          <Image source={require("@/assets/images/servings.png")} style={styles.servingsImage} />
          <Text style={typography.subtitle}>{displayServings()}</Text>
        </View>
        {meal && incrementServings && decrementServings && (
          <ServingsInput onTapPlus={incrementServings} onTapMinus={decrementServings} />
        )}
      </View>

      <View style={styles.timersRow}>
        <View style={styles.timerItem}>
          <Image source={timerImages[0]} style={styles.timerImage} />
          <Text style={[typography.body, styles.timerText]}>{timers[0].label}</Text>
        </View>
        <View style={styles.timerSeparator} />
        {timers.slice(1).map((timer, index) => (
          <View key={timer.icon} style={styles.timerItem}>
            <Image source={timerImages[index + 1]} style={styles.timerImage} />
            <Text style={[typography.body, styles.timerText]}>{timer.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: "400",
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
  tagsRow: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 24,
    columnGap: 8,
  },
  tagPill: {
    backgroundColor: colors.contrast50,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  timersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingVertical: 14,
    backgroundColor: colors.contrast50,
  },
  timerItem: {
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  timerSeparator: {
    width: 1,
    backgroundColor: colors.gray200,
  },
  timerImage: {
    width: 24,
    height: 24,
  },
  timerText: {
    fontSize: 12,
  },
});
