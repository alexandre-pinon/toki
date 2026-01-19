import { MealList } from "@/components/MealList";
import { colors } from "@/theme";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WeeklyMealsScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container}>
        <MealList onPressMeal={(meal) => router.push({ pathname: "../../meals/[id]", params: { id: meal.id } })} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingBottom: 48,
  },
});
