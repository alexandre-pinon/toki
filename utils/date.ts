import { Temporal } from "temporal-polyfill";

export const mapPlainDateToLocaleString = (date: Temporal.PlainDate) => {
	return date.toLocaleString("fr-FR", {
		day: "numeric",
		month: "long",
	});
};

export const mapPlainDateToDayName = (date: Temporal.PlainDate) => {
	return date.toLocaleString("fr-FR", {
		weekday: "long",
	});
};
