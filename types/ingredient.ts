import { uuid } from "expo-modules-core";
import { ShoppingItemCategory } from "./shopping/shopping-item-category";

export const proteinTags = ["chicken", "pork", "beef", "fish"] as const;
export const cerealTags = ["pasta", "rice", "potato"] as const;
export const ingredientTags = [...proteinTags, ...cerealTags];
export type CerealTag = (typeof cerealTags)[number];
export type ProteinTag = (typeof proteinTags)[number];
export type IngredientTag = (typeof ingredientTags)[number];

export type Ingredient = {
  id: string;
  name: string;
  readonly nameNormalized: string;
  category: ShoppingItemCategory;
  tag: IngredientTag | null;
  userId: string | null;
  baseIngredientId: string | null;
};

export type OverrideIngredient = Ingredient & {
  userId: string;
  baseIngredientId: string;
};

export type IngredientListSection = {
  title: ShoppingItemCategory;
  data: Ingredient[];
};

export const createIngredient = (
  userId: string,
  override?: Partial<Omit<Ingredient, "userId">>,
): Ingredient => {
  return {
    id: uuid.v4(),
    name: "",
    nameNormalized: "",
    category: "other",
    tag: null,
    baseIngredientId: null,
    ...override,
    userId,
  };
};

export const isBaseIngredient = (ingredient: Ingredient): boolean => {
  return ingredient.userId === null;
};

export const isOverrideIngredient = (
  ingredient: Ingredient,
): ingredient is OverrideIngredient => {
  return ingredient.userId !== null && ingredient.baseIngredientId !== null;
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

/**
 * Sort ingredients by name (normalized) in ascending order.
 */
export const byName = (a: Ingredient, b: Ingredient): number => {
  return a.nameNormalized.localeCompare(b.nameNormalized);
};
