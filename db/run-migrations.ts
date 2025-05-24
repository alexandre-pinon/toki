import type { SQLiteDatabase } from "expo-sqlite";
import { migrations } from "./migrations";

export const getLatestVersion = () => {
	return Math.max(...migrations.map((m) => m.version));
};

export const runMigrations = async (
	db: SQLiteDatabase,
	currentVersion: number,
) => {
	const pendingMigrations = migrations
		.filter((m) => m.version > currentVersion)
		.sort((a, b) => a.version - b.version);

	for (const migration of pendingMigrations) {
		console.log(`Running migration ${migration.version}`);
		await db.execAsync(migration.sql);
	}

	return pendingMigrations.length > 0 ? getLatestVersion() : currentVersion;
};
