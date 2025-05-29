import { runMigrations } from "@/db/run-migrations";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { SQLiteDatabase, SQLiteOpenOptions } from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ShoppingListProvider } from "../contexts/ShoppingListContext";
import { colors } from "../theme";

const options: SQLiteOpenOptions = {
  libSQLOptions: {
    url: process.env.EXPO_PUBLIC_TURSO_DATABASE_URL ?? "",
    authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN ?? "",
  },
};

const onInit = async (db: SQLiteDatabase) => {
  try {
    const result = await db.getFirstAsync<{ user_version: number } | null>("PRAGMA user_version");
    const currentDbVersion = result?.user_version ?? 0;
    console.log("Current DB version:", currentDbVersion);
    const newVersion = await runMigrations(db, currentDbVersion);
    console.log("New DB version:", newVersion);

    if (newVersion > currentDbVersion) {
      await db.execAsync(`PRAGMA user_version = ${newVersion}`);
    }

    console.log("Syncing database...");
    await db.syncLibSQL();
    console.log("Database synced successfully");
  } catch (e) {
    console.error("Database initialization error:", e);
  }
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SQLiteProvider databaseName="toki-dev" options={options} onInit={onInit}>
        <ShoppingListProvider>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.grey,
              tabBarStyle: {
                backgroundColor: colors.background,
                borderTopColor: colors.lightGrey,
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Course",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="cart-outline" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="recipe"
              options={{
                title: "Recette",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="restaurant-outline" size={size} color={color} />
                ),
              }}
            />
          </Tabs>
        </ShoppingListProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
