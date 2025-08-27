import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";
import { formatDuration, formatLastTimeDone } from "../utils/date";
import { Pill } from "./Pill";

type RecipeInfoProps = {
  name?: string;
  timesDone?: number;
  lastTimeDone?: Temporal.PlainDate;
  type?: string;
  servings: number;
  preparationTime?: number;
  cookingTime?: number;
  restTime?: number;
};

export function RecipeInfo({
  name,
  timesDone = 0,
  lastTimeDone,
  type,
  servings,
  preparationTime = 0,
  cookingTime = 0,
  restTime = 0,
}: RecipeInfoProps) {
  const timerImages = [
    require("../assets/images/clock.png"),
    require("../assets/images/ingredient_preparation.png"),
    require("../assets/images/clock_food.png"),
    require("../assets/images/cooking.png"),
  ];

  const timers = [
    { icon: "time-outline", label: formatDuration(preparationTime + cookingTime + restTime) },
    { icon: "nutrition-outline", label: formatDuration(preparationTime) },
    { icon: "alarm-outline", label: formatDuration(restTime) },
    { icon: "restaurant-outline", label: formatDuration(cookingTime) },
  ];

  return (
    <View style={styles.mainInfoContainer}>
      <View style={styles.headerRow}>
        <Text style={[typography.header, styles.title]}>{name || "Loading..."}</Text>
        <View style={styles.counter}>
          <Ionicons name="checkmark-circle" size={20} />
          <Text style={typography.body}>{timesDone}</Text>
        </View>
      </View>

      <Text style={[typography.body, styles.lastTimeDoneRow]}>
        Dernière fois faite : {formatLastTimeDone(lastTimeDone)}
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
          {type || "Loading..."}
        </Pill>
      </View>

      <View style={styles.servingsRow}>
        <View style={styles.servingsTextContainer}>
          <Image source={require("../assets/images/servings.png")} style={styles.servingsImage} />
          <Text style={typography.subtitle}>
            {servings} personne{servings > 1 ? "s" : ""}
          </Text>
        </View>
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
