import { NetworkError } from "@/lib/supabase";
import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import { Alert } from "react-native";

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof NetworkError || isAuthRetryableFetchError(error);
};

export const showNetworkErrorAlert = () => {
  Alert.alert("Hors ligne", "Action impossible sans connexion internet.");
};
