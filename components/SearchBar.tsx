import { colors, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type SearchBarProps = {
  query: { value: string; set: (query: string) => void };
  filters?: { value: boolean; set: (show: boolean) => void };
};
export const SearchBar = ({ query, filters }: SearchBarProps) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, typography.body]}
          placeholder="Rechercher..."
          value={query.value}
          onChangeText={query.set}
          placeholderTextColor={colors.gray}
        />

        {filters && (
          <TouchableOpacity style={styles.filterButton} onPress={() => filters.set(!filters.value)}>
            <Ionicons name="filter" size={20} color={colors.gray} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray300,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.black,
    fontSize: 16,
  },
  filterButton: {
    paddingLeft: 12,
  },
});
