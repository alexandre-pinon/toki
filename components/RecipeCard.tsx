import type { Recipe } from "@/types/recipe/recipe";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <View style={styles.container}>
      <Image source={recipe.imageUrl} style={styles.image} contentFit="cover" transition={200} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[typography.subtitle, styles.title]}>{recipe.name}</Text>
          <Text style={[typography.subtext, styles.counter]}>{recipe.timesDone} fois</Text>
        </View>
        <Text style={[typography.subtext, styles.type]}>{recipe.type}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  counter: {
    color: colors.grey,
  },
  type: {
    color: colors.grey,
    textTransform: "capitalize",
  },
});
