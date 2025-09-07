import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

type EditRecipeIngredientProps = {};

export default function EditRecipeIngredient({}: EditRecipeIngredientProps) {
  const { id, recipeId } = useLocalSearchParams<{ id: string; recipeId: string }>();

  return (
    <View>
      <Text>
        Edit recipe ingredient {id} for recipe {recipeId}
      </Text>
    </View>
  );
}
