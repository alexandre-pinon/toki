import { StatisticsContent } from "@/components/StatisticsContent";
import { colors, typography } from "@/theme";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileStatisticsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        name="statistics"
        options={{
          title: "Statistiques",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
        }}
      />
      <StatisticsContent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
