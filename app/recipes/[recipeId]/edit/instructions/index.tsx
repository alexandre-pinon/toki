import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

type EditRecipeInstructionProps = {};

export default function EditRecipeInstruction({}: EditRecipeInstructionProps) {
  const { instruction, recipeId } = useLocalSearchParams<{ instruction: string; recipeId: string }>();
  return (
    <View>
      <Text>Edit recipe instruction for recipe {recipeId}</Text>
      <Text>{instruction}</Text>
    </View>
  );
}
