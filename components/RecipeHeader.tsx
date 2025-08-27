import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme";

type RecipeHeaderProps = {
  imageUrl?: string;
};

export function RecipeHeader({ imageUrl }: RecipeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.imageContainer}>
      <Image
        source={imageUrl ? { uri: imageUrl } : undefined}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top }]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={14} color={colors.black} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.editButton, { top: insets.top }]}>
        <Image source={require("../assets/images/pen.png")} style={styles.editButtonImage} />
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
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 10,
  },
  editButtonImage: {
    width: 14,
    height: 14,
  },
});
