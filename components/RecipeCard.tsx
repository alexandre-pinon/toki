import { colors, typography } from "@/theme";
import type { Recipe } from "@/types/recipe/recipe";
import { mapRecipeTypeToName } from "@/types/recipe/recipe-type";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RecipeCardProps = {
  recipe: Recipe;
  onPress: () => void;
};

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <Image
        source={recipe.imageUrl}
        style={styles.image}
        placeholder={require("@/assets/images/meal_placeholder.jpg")}
        placeholderContentFit="cover"
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <Text style={[typography.subtitle, styles.title]}>{recipe.name}</Text>
        <Text style={typography.subtext}>{recipe.lastTimeDone ? recipe.lastTimeDone.toLocaleString() : "-"}</Text>
        <View style={styles.tagsContainer}>
          <View style={styles.typeTag}>
            <Text style={[typography.subtext, styles.typeText]}>{mapRecipeTypeToName(recipe.type)}</Text>
          </View>
          <View style={styles.counterContainer}>
            <Ionicons name="checkmark-circle" size={16} />
            <Text style={[typography.subtext, styles.counter]}>{recipe.timesDone}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    flexDirection: "row",
  },
  image: {
    width: 130,
    height: "100%",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    margin: 16,
    justifyContent: "center",
  },
  title: {
    marginBottom: 6,
  },
  tagsContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.primary100,
  },
  typeText: {
    textTransform: "capitalize",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  counter: {},
});
