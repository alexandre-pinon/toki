import { uuid } from "expo-modules-core";
import { ShoppingItemCategory } from "./shopping/shopping-item-category";

export type Ingredient = {
  id: string;
  name: string;
  readonly nameNormalized: string;
  category: ShoppingItemCategory;
};

export type IngredientListSection = {
  title: ShoppingItemCategory;
  data: Ingredient[];
};

export const createEmptyIngredient = (): Ingredient => {
  return {
    id: uuid.v4(),
    name: "",
    nameNormalized: "",
    category: "other",
  };
};
