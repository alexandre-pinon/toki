import { Platform } from "react-native";

export const colors = {
	primary600: "#d8541e",
	primary: "#e66c29",
	primary500: "#e66c29",
	primary400: "#ed965d",
	primary300: "#f2b47f",
	primary200: "#f7d3b1",
	primary100: "#fcebd8",
	primary50: "#fef6ee",
	success600: "#328747",
	success: "#42a55a",
	success500: "#42a55a",
	success400: "#60be77",
	success300: "#9bdaaa",
	success200: "#c7ebd0",
	success100: "#e2f6e7",
	success50: "#f3faf4",
	alert600: "#c45259",
	alert: "#d36062",
	alert500: "#d36062",
	alert400: "#e28b8a",
	alert300: "#edb6b4",
	alert200: "#f5d7d6",
	alert100: "#faebe9",
	alert50: "#fcf5f4",
	gray600: "#636663",
	gray: "#7a7d7a",
	gray500: "#7a7d7a",
	gray400: "#969a96",
	gray300: "#bbbebb",
	gray200: "#dfe0df",
	gray100: "#efefef",
	gray50: "#f7f8f7",
	contrast600: "#99695d",
	contrast500: "#a77a68",
	contrast400: "#b69281",
	contrast300: "#cbb4a6",
	contrast200: "#dfd2c9",
	contrast: "#f0e9e4",
	contrast100: "#f0e9e4",
	contrast50: "#f8f5f4",
	white: "#ffffff",
	black: "#000000",
} as const;
export type ColorValue = (typeof colors)[keyof typeof colors];

const fontFamily = Platform.OS === "ios" ? "System" : "Inter";
export const typography = {
	header: {
		fontSize: 20,
		fontWeight: "500",
	},
	headlineMedium: {
		fontSize: 28,
		fontWeight: "500",
		fontFamily,
	},
	bodyLarge: {
		fontSize: 16,
		fontWeight: "300",
		fontFamily,
	},
	body: {
		fontSize: 14,
		fontWeight: "200",
		fontFamily,
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "300",
		fontFamily,
	},
	subtext: {
		fontSize: 12,
		fontWeight: "100",
		fontFamily,
	},
} as const;

export const commonStyles = {
	headerStyle: {
		backgroundColor: Platform.OS === "ios" ? "transparent" : colors.white,
	},
	boxShadow: "3px 4px 30px 0px rgba(47, 47, 47, 0.075)",
};
