import { colors } from "@/theme";
import {
  Icon,
  IconProps,
  Label,
  NativeTabs,
} from "expo-router/unstable-native-tabs";

type Tab = {
  name: string;
  title: string;
  sf: IconProps["sf"];
};
const TABS: Tab[] = [
  {
    name: "index",
    title: "Menu",
    sf: "fork.knife",
  },
  {
    name: "recipes",
    title: "Recettes",
    sf: { default: "folder", selected: "folder.fill" },
  },
  {
    name: "shopping-list",
    title: "Courses",
    sf: { default: "cart", selected: "cart.fill" },
  },
  {
    name: "profile",
    title: "Profile",
    sf: { default: "person", selected: "person.fill" },
  },
];

export default function TabsLayout() {
  return (
    <NativeTabs>
      {TABS.map(({ name, title, sf }) => (
        <NativeTabs.Trigger key={`tab-${name}`} name={name} options={{}}>
          <Label>{title}</Label>
          <Icon sf={sf} selectedColor={colors.primary} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
