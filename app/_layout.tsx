import { CustomErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ShoppingListProvider } from "@/contexts/ShoppingListContext";
import { ErrorBoundaryProps, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function RootLayoutNav() {
  const { session } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const inAuthGroup = segments[0] === "auth";

    if (!session && !inAuthGroup) {
      router.replace("/auth");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, segments, isMounted, router]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ShoppingListProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="recipes/[recipeId]" options={{ headerShown: false }} />
        </Stack>
      </ShoppingListProvider>
    </GestureHandlerRootView>
  );
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <CustomErrorBoundary {...props} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
