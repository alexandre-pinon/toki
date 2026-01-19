import { ShoppingList } from "@/components/ShoppingList";
import { colors } from "@/theme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "temporal-polyfill/global";

export default function ShoppingListScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ShoppingList />
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
    paddingTop: 16,
    paddingBottom: 48,
  },
});
