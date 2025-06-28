import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../../theme";

export default function ProfileStatisticsScreen() {
  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "Statistique",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.center}>
          <Text style={typography.header}>Statistique</Text>
          <Text style={typography.body}>Écran de statistiques utilisateur (placeholder)</Text>
        </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
  },
});
