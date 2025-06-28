import { Platform } from "react-native";

export const colors = {
	primary: "#E66C29",
	primary100: "#FCEBD8",
	primary400: "#ED965D",
	grey: "#6C7684",
	lightGrey: "#DBDDE8",
	lighterGrey: "#F5F5F5",
	background: "#FFFFFF",
	textPrimary: "#000000",
	textSecondary: "#666666",
	danger: "#FF3B30",
	info: "#007AFF",
	// Add more colors as needed
} as const;
export type ColorValue = (typeof colors)[keyof typeof colors];

export const typography = {
	header: {
		fontSize: 20,
		fontWeight: "500",
	},
	headlineMedium: {
		fontSize: 28,
		fontWeight: "500",
		fontFamily: Platform.OS === "ios" ? "System" : "Inter",
	},
	bodyLarge: {
		fontSize: 16,
		fontWeight: "300",
		fontFamily: Platform.OS === "ios" ? "System" : "Inter",
	},
	body: {
		fontSize: 14,
		fontWeight: "200",
		fontFamily: Platform.OS === "ios" ? "System" : "Inter",
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "300",
		fontFamily: Platform.OS === "ios" ? "System" : "Inter",
	},
	subtext: {
		fontSize: 12,
		fontWeight: "100",
		fontFamily: Platform.OS === "ios" ? "System" : "Inter",
	},
} as const;
