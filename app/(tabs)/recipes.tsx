import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeList } from "../../components/RecipeList";
import { colors, typography } from "../../theme";

export default function RecipesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Recettes",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
        }}
      />
      <RecipeList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
