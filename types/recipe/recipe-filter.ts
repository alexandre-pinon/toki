import { CerealTag, ProteinTag } from "../ingredient";
import type { RecipeType } from "./recipe-type";

export const lastDoneFilters = ["more_than_3_months", "more_than_1_month", "less_than_1_month"] as const;

export type LastDoneFilter = (typeof lastDoneFilters)[number];

export type RecipeFilters = {
  types: RecipeType[];
  cerealTags: CerealTag[];
  proteinTags: ProteinTag[];
  lastDone: LastDoneFilter | null;
};

export const emptyFilters: RecipeFilters = {
  types: [],
  cerealTags: [],
  proteinTags: [],
  lastDone: null,
};

export const mapLastDoneFilterToName = (filter: LastDoneFilter): string => {
  switch (filter) {
    case "more_than_3_months":
      return "Plus de 3 mois";
    case "more_than_1_month":
      return "Plus de 1 mois";
    case "less_than_1_month":
      return "Moins de 1 mois";
    default:
      return filter;
  }
};

export const hasActiveFilters = (filters: RecipeFilters): boolean => {
  return (
    filters.types.length > 0 ||
    filters.cerealTags.length > 0 ||
    filters.proteinTags.length > 0 ||
    filters.lastDone !== null
  );
};
