import { useCurrentRecipe } from "@/contexts/CurrentRecipeContext";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RecipeHeaderProps = {
  imageUrl?: string;
  id: string;
};

export function RecipeHeader({ imageUrl, id }: RecipeHeaderProps) {
  const { deleteCurrentRecipe } = useCurrentRecipe();
  const insets = useSafeAreaInsets();

  const handleCancel = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push({
      pathname: `./edit/[id]`,
      params: { id },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la recette",
      "Êtes-vous sûr de vouloir supprimer cet recette ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteCurrentRecipe();
            router.back();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.imageContainer}>
      <Image
        source={imageUrl ? { uri: imageUrl } : undefined}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <TouchableOpacity style={[styles.backButton, { top: insets.top }]} onPress={handleCancel}>
        <Ionicons name="chevron-back" size={14} color={colors.black} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.editButton, { top: insets.top }]} onPress={handleEdit}>
        <Image source={require("@/assets/images/pen.png")} style={styles.editButtonImage} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.deleteButton, { top: insets.top }]} onPress={handleDelete}>
        <Ionicons name="trash-bin-outline" size={14} color={colors.alert} />
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: width * 0.65,
    position: "relative",
    backgroundColor: colors.gray100,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    left: 20,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 10,
  },
  editButton: {
    position: "absolute",
    right: 64,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 10,
  },
  editButtonImage: {
    width: 14,
    height: 14,
  },
  deleteButton: {
    position: "absolute",
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 10,
  },
});
