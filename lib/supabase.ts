import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageError } from "@supabase/storage-js";
import { createClient, PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import type { Database } from "./database.types.ts";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getDbResponseDataOrThrow = <T>(response: PostgrestSingleResponse<T>): T => {
  const { data, error } = response;
  if (error) {
    console.warn(error);
    throw new PostgrestError(error);
  }
  return data;
};

type StorageResponse<T> = { data: T; error: null } | { data: null; error: StorageError };
export const getStorageResponseDataOrThrow = <T>(response: StorageResponse<T>): T => {
  const { data, error } = response;
  if (error) {
    console.warn(error);
    throw new StorageError(error.message);
  }
  return data;
};

export type OmitDBTimestamps<T> = Omit<T, "created_at" | "updated_at">;
type DBTables = Database["public"]["Tables"];
export type DBRow<T extends keyof DBTables> = DBTables[T]["Row"];
