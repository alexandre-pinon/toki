export const unitTypes = [
  "g",
  "kg",
  "l",
  "cl",
  "ml",
  "tsp",
  "tbsp",
  "cup",
  "piece",
  "pinch",
  "bunch",
  "clove",
  "can",
  "package",
  "slice",
  "to_taste",
] as const;

export const isUnitType = (value: string): value is UnitType => {
  return unitTypes.includes(value as UnitType);
};

export type UnitType = (typeof unitTypes)[number];

export const mapUnitTypeToName = (unitType?: UnitType, plural: boolean = false): string => {
  switch (unitType) {
    case "tsp":
      return plural ? "cuillères à café" : "cuillère à café";
    case "tbsp":
      return plural ? "cuillères à soupe" : "cuillère à soupe";
    case "cup":
      return plural ? "tasses" : "tasse";
    case "piece":
      return plural ? "pièces" : "pièce";
    case "pinch":
      return plural ? "pincées" : "pincée";
    case "bunch":
      return plural ? "bottes" : "botte";
    case "clove":
      return plural ? "gousses" : "gousse";
    case "can":
      return plural ? "canettes" : "canette";
    case "package":
      return plural ? "paquets" : "paquet";
    case "slice":
      return plural ? "tranches" : "tranche";
    case "to_taste":
      return "au goût";
    default:
      return unitType ?? "";
  }
};

export const formatQuantityAndUnit = (quantity?: number, unit?: UnitType, maybeCoefficient?: number): string => {
  if (!quantity && !unit) return "";
  if (!quantity) return mapUnitTypeToName(unit);

  const quantityWithCoef = quantity * (maybeCoefficient ?? 1);
  if (!unit) return decimalToFraction(quantityWithCoef);

  const isPlural = quantityWithCoef > 1 || quantityWithCoef === 0;
  const unitName = mapUnitTypeToName(unit, isPlural);
  const space = shouldAddSpaceBeforeUnit(unit) ? " " : "";
  const formattedQuantity = decimalToFraction(quantityWithCoef);

  return `${formattedQuantity}${space}${unitName}`;
};

export const shouldAddSpaceBeforeUnit = (unitType?: UnitType): boolean => {
  const noSpaceUnits: UnitType[] = ["g", "kg", "l", "cl", "ml"];
  return unitType ? !noSpaceUnits.includes(unitType) : false;
};

const commonFractions = [
  { decimal: 0.125, fraction: "⅛" },
  { decimal: 0.25, fraction: "¼" },
  { decimal: 0.33, fraction: "⅓" },
  { decimal: 0.375, fraction: "⅜" },
  { decimal: 0.5, fraction: "½" },
  { decimal: 0.625, fraction: "⅝" },
  { decimal: 0.67, fraction: "⅔" },
  { decimal: 0.75, fraction: "¾" },
  { decimal: 0.875, fraction: "⅞" },
];

const decimalToFraction = (decimal: number): string => {
  if (decimal >= 1) return decimal.toString();

  const closest = commonFractions.reduce((prev, curr) => {
    return Math.abs(curr.decimal - decimal) < Math.abs(prev.decimal - decimal) ? curr : prev;
  });

  if (Math.abs(closest.decimal - decimal) < 0.05) {
    return closest.fraction;
  }

  return decimal.toString();
};
