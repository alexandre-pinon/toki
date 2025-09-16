import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RecipeHeaderProps = {
  id: string;
  onDelete: () => void;
  imageUrl?: string;
  showEdit?: boolean;
};

export function RecipeHeader({ id, onDelete, imageUrl, showEdit }: RecipeHeaderProps) {
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
      {showEdit && (
        <TouchableOpacity style={[styles.editButton, { top: insets.top }]} onPress={handleEdit}>
          <Image source={require("@/assets/images/pen.png")} style={styles.editButtonImage} />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={[styles.deleteButton, { top: insets.top }]} onPress={onDelete}>
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
