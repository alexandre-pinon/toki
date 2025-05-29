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
	"totaste",
] as const;

export const isUnitType = (value: string): value is UnitType => {
	return unitTypes.includes(value as UnitType);
};

export type UnitType = (typeof unitTypes)[number];

export const mapUnitTypeToName = (unitType?: UnitType): string => {
	switch (unitType) {
		case "tsp":
			return "cuillère à café";
		case "tbsp":
			return "cuillère à soupe";
		case "cup":
			return "tasse";
		case "piece":
			return "pièce";
		case "pinch":
			return "pincée";
		case "bunch":
			return "botte";
		case "clove":
			return "gousse";
		case "can":
			return "canette";
		case "package":
			return "paquet";
		case "slice":
			return "tranche";
		case "totaste":
			return "au goût";
		default:
			return unitType ?? "";
	}
};
