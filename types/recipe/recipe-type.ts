export const recipeTypes = ["starter", "main", "side", "dessert", "drink", "sauce"] as const;

export type RecipeType = (typeof recipeTypes)[number];

export const mapRecipeTypeToName = (type: RecipeType): string => {
  switch (type) {
    case "starter":
      return "entrée";
    case "main":
      return "plat";
    case "side":
      return "accompagnement";
    case "drink":
      return "boisson";
    default:
      return type;
  }
};

export const isRecipeType = (value: string): value is RecipeType => {
  return recipeTypes.includes(value as RecipeType);
};
