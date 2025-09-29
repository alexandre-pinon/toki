import { MenuIcon } from "@/components/icons/MenuIcon";
import { ProfileIcon } from "@/components/icons/ProfileIcon";
import { RecipeIcon } from "@/components/icons/RecipeIcon";
import { ShoppingCartIcon } from "@/components/icons/ShoppingCartIcon";
import { colors } from "@/theme";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

type Tab = {
  name: string;
  title: string;
  headerTitle?: string;
  tabBarIcon: BottomTabNavigationOptions["tabBarIcon"];
};
const TABS: Tab[] = [
  {
    name: "index",
    title: "Menu",
    headerTitle: "Repas de la semaine",
    tabBarIcon: MenuIcon,
  },
  {
    name: "recipes",
    title: "Recettes",
    tabBarIcon: RecipeIcon,
  },
  {
    name: "shopping-list",
    title: "Courses",
    headerTitle: "Liste de courses",
    tabBarIcon: ShoppingCartIcon,
  },
  {
    name: "profile",
    title: "Profile",
    tabBarIcon: ProfileIcon,
  },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          position: "absolute",
          paddingTop: 10,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={30}
            style={{
              ...StyleSheet.absoluteFillObject,
              overflow: "hidden",
              backgroundColor: "transparent",
            }}
          />
        ),
      }}
    >
      {TABS.map(({ name, title, headerTitle, tabBarIcon }) => (
        <Tabs.Screen key={`tab-${name}`} name={name} options={{ title, headerTitle, tabBarIcon }} />
      ))}
    </Tabs>
  );
}
