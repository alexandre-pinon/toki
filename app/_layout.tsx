import { CustomErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { FormIngredientProvider } from "@/contexts/FormIngredientContext";
import { IngredientListProvider } from "@/contexts/IngredientListContext";
import { RecipeFilterProvider } from "@/contexts/RecipeFilterContext";
import { RecipeListProvider } from "@/contexts/RecipeListContext";
import { ShoppingListProvider } from "@/contexts/ShoppingListContext";
import { UpcomingMealsProvider } from "@/contexts/UpcomingMealsContext";
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
      router.replace("/");
    }
  }, [session, segments, isMounted, router]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="recipes" options={{ headerShown: false }} />
        <Stack.Screen name="meals" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <CustomErrorBoundary {...props} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ShoppingListProvider>
        <UpcomingMealsProvider>
          <RecipeListProvider>
            <IngredientListProvider>
              <RecipeFilterProvider>
                <FormIngredientProvider>
                  <RootLayoutNav />
                </FormIngredientProvider>
              </RecipeFilterProvider>
            </IngredientListProvider>
          </RecipeListProvider>
        </UpcomingMealsProvider>
      </ShoppingListProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
