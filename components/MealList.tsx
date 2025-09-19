import { useUpcomingMeals } from "@/contexts/UpcomingMealsContext";
import { colors, typography } from "@/theme";
import type { Meal, MealWithRecipe } from "@/types/weekly-meals/meal";
import { mapPlainDateToDayName, mapPlainDateToLocaleString } from "@/utils/date";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
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
      type: "header";
      key: string;
      date: Temporal.PlainDate;
    }
  | {
      type: "footer";
      key: string;
      date: Temporal.PlainDate;
    };

type MealListProps = {
  onPressMeal: (meal: Meal) => void;
};
export function MealList({ onPressMeal }: MealListProps) {
  const { upcomingMeals, updateMealDate, refetchUpcomingMeals, isLoading } = useUpcomingMeals();
  const [mealListItems, setMealListItems] = useState<MealListItem[]>([]);

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

  const renderItem = ({ item, drag, isActive }: RenderItemParams<MealListItem>) => {
    const getItemToRender = () => {
      switch (item.type) {
        case "header":
          return (
            <View style={styles.dayHeader}>
              <Text style={[typography.body, styles.dayName]}>{mapPlainDateToDayName(item.date)}</Text>
              <Text style={[typography.body, styles.dayDate]}>{mapPlainDateToLocaleString(item.date)}</Text>
            </View>
          );
        case "meal":
          return (
            <View style={styles.mealContainer}>
              <MealCard meal={item.meal} isDragged={isActive} />
            </View>
          );
        case "footer":
          return (
            <TouchableOpacity onPress={() => handleAddMeal(item.date)} style={styles.sectionFooter}>
              <Text style={styles.addMeal}>+ Ajouter un repas</Text>
            </TouchableOpacity>
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
      onDragEnd={async ({ data, from, to }) => {
        if (from === to) return;
        const previousItems = [...mealListItems];
        const droppedItem = data[to];
        const replacedItem = previousItems[to];
        const targetDate = replacedItem.type === "meal" ? replacedItem.meal.date : replacedItem.date;

        if (droppedItem.type !== "meal") {
          console.error("Invalid dropped item: ", droppedItem);
          Alert.alert("Invalid dropped item");
          await refetchUpcomingMeals();
          return;
        }

        if ((to > from && replacedItem.type === "footer") || (from > to && replacedItem.type === "header")) {
          console.error("Invalid drop location: ", droppedItem);
          Alert.alert("Invalid drop location");
          await refetchUpcomingMeals();
          return;
        }

        setMealListItems(data);
        if (targetDate.equals(droppedItem.meal.date)) {
          console.log("No need to update date. Skipping");
          return;
        }

        try {
          await updateMealDate(droppedItem.meal.id, targetDate);
        } catch (error) {
          console.error("Error updating meal date:", error);
          Alert.alert("Error updating meal date. Please try again later");
          setMealListItems(previousItems);
        }
      }}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
    />
  );
}

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

    mealListItems.push({
      type: "header",
      key: `header-${dateKey}`,
      date,
    });
    dayMeals.forEach((dayMeal) => {
      mealListItems.push({
        type: "meal",
        key: dayMeal.id,
        meal: dayMeal,
      });
    });
    mealListItems.push({
      type: "footer",
      key: `footer-${dateKey}`,
      date,
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
