import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MealList } from "../../components/MealList";
import { colors, typography } from "../../theme";
import { Stack } from "expo-router";

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
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    marginTop: 24,
  },
});
