import { FilterPill } from "@/components/FilterPill";
import { useRecipeFilter } from "@/contexts/RecipeFilterContext";
import { colors, typography } from "@/theme";
import { CerealTag, cerealTags, mapIngredientTagToName, ProteinTag, proteinTags } from "@/types/ingredient";
import {
  emptyFilters,
  LastDoneFilter,
  lastDoneFilters,
  mapLastDoneFilterToName,
  RecipeFilters,
} from "@/types/recipe/recipe-filter";
import { mapRecipeTypeToName, RecipeType, recipeTypes } from "@/types/recipe/recipe-type";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FiltersScreen() {
  const { filters, setFilters } = useRecipeFilter();
  const [localFilters, setLocalFilters] = useState<RecipeFilters>(filters);

  const toggleType = (type: RecipeType) => {
    setLocalFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type) ? prev.types.filter((t) => t !== type) : [...prev.types, type],
    }));
  };

  const toggleCerealTag = (tag: CerealTag) => {
    setLocalFilters((prev) => ({
      ...prev,
      cerealTags: prev.cerealTags.includes(tag) ? prev.cerealTags.filter((t) => t !== tag) : [...prev.cerealTags, tag],
    }));
  };

  const toggleProteinTag = (tag: ProteinTag) => {
    setLocalFilters((prev) => ({
      ...prev,
      proteinTags: prev.proteinTags.includes(tag)
        ? prev.proteinTags.filter((t) => t !== tag)
        : [...prev.proteinTags, tag],
    }));
  };

  const toggleLastDone = (filter: LastDoneFilter) => {
    setLocalFilters((prev) => ({
      ...prev,
      lastDone: prev.lastDone === filter ? null : filter,
    }));
  };

  const handleClearAll = () => {
    setLocalFilters(emptyFilters);
  };

  const handleValidate = () => {
    setFilters(localFilters);
    router.back();
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "Filtres",
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.black,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={colors.black} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
              <Text style={[typography.body, styles.clearButtonText]}>Tout effacer</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={[]}>
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <FilterSection icon={require("@/assets/images/servings.png")} label="Type">
            <View style={styles.pillGrid}>
              {recipeTypes.map((type) => (
                <FilterPill
                  key={type}
                  label={mapRecipeTypeToName(type)}
                  selected={localFilters.types.includes(type)}
                  onPress={() => toggleType(type)}
                />
              ))}
            </View>
          </FilterSection>

          <FilterSection icon={require("@/assets/images/cereals.png")} label="Accompagnement">
            <View style={styles.pillGrid}>
              {cerealTags.map((tag) => (
                <FilterPill
                  key={tag}
                  label={mapIngredientTagToName(tag)}
                  selected={localFilters.cerealTags.includes(tag)}
                  onPress={() => toggleCerealTag(tag)}
                />
              ))}
            </View>
          </FilterSection>

          <FilterSection icon={require("@/assets/images/meat.png")} label="Protéine">
            <View style={styles.pillGrid}>
              {proteinTags.map((tag) => (
                <FilterPill
                  key={tag}
                  label={mapIngredientTagToName(tag)}
                  selected={localFilters.proteinTags.includes(tag)}
                  onPress={() => toggleProteinTag(tag)}
                />
              ))}
            </View>
          </FilterSection>

          <FilterSection icon={require("@/assets/images/clock.png")} label="Dernière fois faîtes">
            <View style={styles.pillGrid}>
              {lastDoneFilters.map((filter) => (
                <FilterPill
                  key={filter}
                  label={mapLastDoneFilterToName(filter)}
                  selected={localFilters.lastDone === filter}
                  onPress={() => toggleLastDone(filter)}
                />
              ))}
            </View>
          </FilterSection>
        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
            <Text style={styles.validateButtonText}>Valider</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}

type FilterSectionProps = {
  icon: number;
  label: string;
  children: React.ReactNode;
};

const FilterSection = ({ icon, label, children }: FilterSectionProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Image source={icon} style={styles.sectionIcon} />
        <Text style={[typography.body, styles.sectionLabel]}>{label}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    color: colors.primary,
    fontWeight: "300",
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  sectionLabel: {
    color: colors.black,
    fontWeight: "300",
  },
  pillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  footer: {
    paddingHorizontal: 60,
    paddingTop: 16,
  },
  validateButton: {
    backgroundColor: colors.primary400,
    paddingVertical: 10,
    borderRadius: 32,
    alignItems: "center",
  },
  validateButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "500",
  },
});
