import { MenuIcon } from "@/components/icons/MenuIcon";
import { ProfileIcon } from "@/components/icons/ProfileIcon";
import { RecipeIcon } from "@/components/icons/RecipeIcon";
import { ShoppingCartIcon } from "@/components/icons/ShoppingCartIcon";
import { Tabs } from "expo-router";
import { colors } from "../../theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray300,
          paddingTop: 10,
          opacity: 0.9,
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerTitle: "Repas de la semaine",
          tabBarIcon: ({ color, size }) => <MenuIcon color={color} size={size} />,
        }}
      />
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
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
