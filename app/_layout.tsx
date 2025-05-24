import { runMigrations } from "@/db/run-migrations";
import { Stack } from "expo-router";
import type { SQLiteDatabase, SQLiteOpenOptions } from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const options: SQLiteOpenOptions = {
  libSQLOptions: {
    url: process.env.EXPO_PUBLIC_TURSO_DATABASE_URL ?? "",
    authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN ?? "",
  },
};

const onInit = async (db: SQLiteDatabase) => {
  try {
    // Always sync libSQL first to prevent conflicts between local and remote databases
    await db.syncLibSQL();
  } catch (e) {
    console.log("Error onInit syncing libSQL:", e);
  }

  // Retrieve the current database version using PRAGMA.
  const result = await db.getFirstAsync<{ user_version: number } | null>("PRAGMA user_version");
  const currentDbVersion = result?.user_version ?? 0;

  // Run migrations if needed
  const newVersion = await runMigrations(db, currentDbVersion);

  if (newVersion > currentDbVersion) {
    await db.execAsync(`PRAGMA user_version = ${newVersion}`);
    console.log(`Database migrated from version ${currentDbVersion} to ${newVersion}`);
  } else {
    console.log("No migration needed, DB version:", currentDbVersion);
  }
};

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SQLiteProvider databaseName="toki-dev" options={options} onInit={onInit}>
        <Stack />
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RootLayout;
