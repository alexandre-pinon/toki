import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatisticsContent } from "../../components/StatisticsContent";
import { colors, typography } from "../../theme";

export default function ProfileStatisticsScreen() {
  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "Statistiques",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <StatisticsContent />
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
  },
});
