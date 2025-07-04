import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MealList } from "../../components/MealList";
import { colors, typography } from "../../theme";

export default function WeeklyMealsScreen() {
  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <MealList />
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
    marginTop: 24,
  },
});
