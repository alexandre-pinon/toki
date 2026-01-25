import { uuid } from "expo-modules-core";
import { ShoppingItemCategory } from "./shopping/shopping-item-category";

const proteinTags = ["chicken", "pork", "beef", "fish"] as const;
const cerealTags = ["pasta", "rice", "potato"] as const;
export const ingredientTags = [...proteinTags, ...cerealTags];
export type IngredientTag = (typeof ingredientTags)[number];

export type Ingredient = {
  id: string;
  name: string;
  readonly nameNormalized: string;
  category: ShoppingItemCategory;
  tag: IngredientTag | null;
};

export type IngredientListSection = {
  title: ShoppingItemCategory;
  data: Ingredient[];
};

export const createIngredient = (override?: Partial<Ingredient>): Ingredient => {
  return {
    id: uuid.v4(),
    name: "",
    nameNormalized: "",
    category: "other",
    tag: null,
    ...override,
  };
};

export const isIngredientTag = (value: string): value is IngredientTag => {
  return ingredientTags.includes(value as IngredientTag);
};

export const mapIngredientTagToName = (tag: IngredientTag): string => {
  switch (tag) {
    case "chicken":
      return "poulet";
    case "pork":
      return "porc";
    case "beef":
      return "bœuf";
    case "fish":
      return "poisson";
    case "pasta":
      return "pâte";
    case "rice":
      return "riz";
    case "potato":
      return "pomme de terre";
    default:
      return tag;
  }
};
