import { FilterIcon } from "@/components/icons/FilterIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { colors, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type SearchBarProps = {
  query: { value: string; set: (query: string) => void };
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  autoFocus?: boolean;
  autoCorrect?: boolean;
};

export const SearchBar = ({
  query,
  onFilterPress,
  hasActiveFilters,
  autoFocus,
  autoCorrect,
}: SearchBarProps) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <SearchIcon color={colors.gray500} size={16} />
        <TextInput
          style={[styles.searchInput, typography.subtext]}
          placeholder="Rechercher par nom"
          value={query.value}
          onChangeText={query.set}
          placeholderTextColor={colors.gray500}
          autoFocus={autoFocus ?? false}
          autoCorrect={autoCorrect ?? false}
        />
        {query.value.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => query.set("")}>
            <Ionicons name="close" size={16} color={colors.gray500} />
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={onFilterPress}
        >
          <FilterIcon color={hasActiveFilters ? colors.white : colors.gray500} size={14} />
          <Text style={[styles.filterText, hasActiveFilters && styles.filterTextActive]}>
            Filtrer
          </Text>
          {hasActiveFilters && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.black,
  },
  clearButton: {
    padding: 2,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: colors.white,
  },
  filterButtonActive: {
    backgroundColor: colors.primary400,
    borderColor: colors.primary400,
  },
  filterText: {
    ...typography.subtext,
    color: colors.gray500,
  },
  filterTextActive: {
    color: colors.white,
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
    marginLeft: 2,
  },
});
