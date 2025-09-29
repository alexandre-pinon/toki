import { useUpcomingMeals } from "@/contexts/UpcomingMealsContext";
import { colors, typography } from "@/theme";
import type { Meal, MealWithRecipe } from "@/types/weekly-meals/meal";
import { mapPlainDateToDayName, mapPlainDateToLocaleString } from "@/utils/date";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, { DragEndParams, RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import "temporal-polyfill/global";
import { Loader } from "./Loader";
import { MealCard } from "./MealCard";

type MealListItem =
  | {
      type: "meal";
      key: string;
      meal: MealWithRecipe;
    }
  | {
      type: "divider";
      key: string;
      date: Temporal.PlainDate;
    };

type MealListProps = {
  onPressMeal: (meal: Meal) => void;
};
export function MealList({ onPressMeal }: MealListProps) {
  const { upcomingMeals, updateMealDate, refetchUpcomingMeals, isLoading } = useUpcomingMeals();
  const [mealListItems, setMealListItems] = useState<MealListItem[]>([]);

  const today = Temporal.Now.plainDateISO();
  const lastMealDay = today.add({ days: Number(process.env.EXPO_PUBLIC_MEAL_LIST_DAYS) });

  useEffect(() => {
    const mealsByDate = groupMealsByDate(upcomingMeals);
    const items = createMealListItems(mealsByDate);
    setMealListItems(items);
  }, [upcomingMeals]);

  if (isLoading) {
    return <Loader />;
  }

  const handleAddMeal = (mealDate: Temporal.PlainDate) => {
    router.push({
      pathname: "../add-meal",
      params: { mealDate: mealDate.toJSON() },
    });
  };

  const onDragEnd = async ({ data, from, to }: DragEndParams<MealListItem>) => {
    if (from === to) return;
    const previousItems = [...mealListItems];
    const droppedItem = data[to];
    const replacedItem = previousItems[to];
    const replacedItemDate = replacedItem.type === "meal" ? replacedItem.meal.date : replacedItem.date;
    const targetDate =
      from > to && replacedItem.type === "divider" ? replacedItemDate.subtract({ days: 1 }) : replacedItemDate;

    if (droppedItem.type !== "meal") return;

    setMealListItems(data);

    if (targetDate.equals(droppedItem.meal.date)) {
      console.log("No need to update date. Skipping");
      return;
    }

    try {
      await updateMealDate(droppedItem.meal.id, targetDate);
    } catch {
      Alert.alert("Erreur", "Impossible de mettre à jour la date de ce repas, veuillez réessayer plus tard.");
      setMealListItems(previousItems);
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<MealListItem>) => {
    const getItemToRender = () => {
      switch (item.type) {
        case "meal":
          return (
            <View style={styles.mealContainer}>
              <MealCard meal={item.meal} isDragged={isActive} />
            </View>
          );
        case "divider":
          return (
            <>
              <SectionFooter onPress={() => handleAddMeal(item.date)} />
              <SectionHeader date={item.date} />
            </>
          );
      }
    };

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onPress={() => {
            if (item.type !== "meal") return;
            onPressMeal(item.meal);
          }}
          onLongPress={drag}
          disabled={item.type !== "meal" || isActive}
        >
          {getItemToRender()}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      data={mealListItems}
      onDragEnd={onDragEnd}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      ListHeaderComponent={<SectionHeader date={today} />}
      ListFooterComponent={<SectionFooter onPress={() => handleAddMeal(lastMealDay)} />}
    />
  );
}

const SectionHeader = ({ date }: { date: Temporal.PlainDate }) => (
  <View style={styles.dayHeader}>
    <Text style={[typography.body, styles.dayName]}>{mapPlainDateToDayName(date)}</Text>
    <Text style={[typography.body, styles.dayDate]}>{mapPlainDateToLocaleString(date)}</Text>
  </View>
);

const SectionFooter = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.sectionFooter}>
    <Text style={styles.addMeal}>+ Ajouter un repas</Text>
  </TouchableOpacity>
);

function groupMealsByDate(meals: MealWithRecipe[]): Record<string, MealWithRecipe[]> {
  return meals.reduce(
    (mealsGroupedBy, meal) => {
      const dateKey = meal.date.toString();
      if (!mealsGroupedBy[dateKey]) {
        mealsGroupedBy[dateKey] = [];
      }
      mealsGroupedBy[dateKey].push(meal);
      return mealsGroupedBy;
    },
    {} as Record<string, MealWithRecipe[]>,
  );
}

function createMealListItems(mealsByDate: Record<string, MealWithRecipe[]>): MealListItem[] {
  const today = Temporal.Now.plainDateISO();
  const mealListItems: MealListItem[] = [];

  for (let i = 0; i < Number(process.env.EXPO_PUBLIC_MEAL_LIST_DAYS); i++) {
    const date = today.add({ days: i });
    const dateKey = date.toString();
    const dayMeals = mealsByDate[dateKey] || [];

    if (i > 0) {
      mealListItems.push({
        type: "divider",
        key: `divider-${dateKey}`,
        date,
      });
    }

    dayMeals.forEach((dayMeal) => {
      mealListItems.push({
        type: "meal",
        key: dayMeal.id,
        meal: dayMeal,
      });
    });
  }

  return mealListItems;
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
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
  mealContainer: {
    paddingVertical: 6,
  },
  sectionFooter: {
    marginTop: 8,
    marginBottom: 24,
  },
});
