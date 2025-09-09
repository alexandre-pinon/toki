import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function EditRecipeInstruction() {
  const { recipeId, instruction } = useLocalSearchParams<{ recipeId: string; instruction?: string }>();

  return (
    <View>
      <Text>Edit recipe instruction for recipe {recipeId}</Text>
      <Text>{instruction}</Text>
    </View>
  );
}
