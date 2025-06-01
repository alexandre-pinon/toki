import { RecipeIcon } from "@/components/icons/RecipeIcon";
import { ShoppingCartIcon } from "@/components/icons/ShoppingCartIcon";
import { Tabs } from "expo-router";
import { colors } from "../../theme";

export default function TabsLayout() {
  return (
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
        name="recipes"
        options={{
          title: "Recettes",
          tabBarIcon: ({ color, size }) => <RecipeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Courses",
          headerTitle: "Liste de courses",
          tabBarIcon: ({ color, size }) => <ShoppingCartIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
