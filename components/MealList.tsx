import { useAuth } from "@/contexts/AuthContext";
import type { MealWithRecipe } from "@/services/meal";
import { useMealService } from "@/services/meal";
import { mapPlainDateToDayName, mapPlainDateToLocaleString } from "@/utils/date";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import "temporal-polyfill/global";
import { colors, typography } from "../theme";
import { Loader } from "./Loader";
import { MealCard } from "./MealCard";

type SectionData = {
  title: string;
  data: MealWithRecipe[];
  day: string;
  date: string;
};

export function MealList() {
  const { session } = useAuth();
  const { getUpcomingMeals } = useMealService();
  const [sectionData, setSectionData] = useState<SectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    loadMeals(session.user.id);
  }, [session]);

  const loadMeals = async (userId: string) => {
    try {
      setIsLoading(true);
      const meals = await getUpcomingMeals(userId);
      const mealsByDate = groupMealsByDate(meals);
      const sections = createMealSections(mealsByDate);
      setSectionData(sections);
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SectionList
      sections={sectionData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MealCard meal={item} />}
      renderSectionHeader={({ section }) => (
        <View style={styles.dayHeader}>
          <Text style={[typography.body, styles.dayName]}>{section.day}</Text>
          <Text style={[typography.body, styles.dayDate]}>{section.date}</Text>
        </View>
      )}
      renderSectionFooter={() => (
        <View style={styles.sectionFooter}>
          <Text style={styles.addMeal}>+ Ajouter un repas</Text>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
}

function groupMealsByDate(meals: MealWithRecipe[]): Record<string, MealWithRecipe[]> {
  return meals.reduce((mealsGroupedBy, meal) => {
    const dateKey = meal.date.toString();
    if (!mealsGroupedBy[dateKey]) {
      mealsGroupedBy[dateKey] = [];
    }
    mealsGroupedBy[dateKey].push(meal);
    return mealsGroupedBy;
  }, {} as Record<string, MealWithRecipe[]>);
}

function createMealSections(mealsByDate: Record<string, MealWithRecipe[]>): SectionData[] {
  const today = Temporal.Now.plainDateISO();
  const sections: SectionData[] = [];

  for (let i = 0; i < Number(process.env.EXPO_PUBLIC_MEAL_LIST_DAYS); i++) {
    const date = today.add({ days: i });
    const dateKey = date.toString();
    const dayMeals = mealsByDate[dateKey] || [];

    sections.push({
      title: mapPlainDateToDayName(date),
      data: dayMeals,
      day: mapPlainDateToDayName(date),
      date: mapPlainDateToLocaleString(date),
    });
  }

  return sections;
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    gap: 12,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  dayName: {
    textTransform: "capitalize",
    marginRight: 8,
    fontSize: 16,
  },
  dayDate: {
    color: colors.gray,
    marginBottom: 2,
  },
  addMeal: {
    color: colors.primary,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionFooter: {
    marginBottom: 24,
  },
});
