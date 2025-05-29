import { Platform } from "react-native";

export const colors = {
	primary: "#E66C29",
	grey: "#6C7684",
	lightGrey: "#F7F8F7",
	background: "#FFFFFF",
	text: "#000000",
	danger: "#FF3B30",
	info: "#007AFF",
	// Add more colors as needed
} as const;

export const typography = {
	header: {
		fontSize: 20,
		fontWeight: "600",
		fontFamily: Platform.OS === "ios" ? "System" : "Inter",
	},
	body: {
		fontSize: 14,
		fontWeight: "300",
		fontFamily: Platform.OS === "ios" ? "System" : "Inter",
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "400",
		fontFamily: Platform.OS === "ios" ? "System" : "Inter",
	},
	subtext: {
		fontSize: 12,
		fontWeight: "200",
		fontFamily: Platform.OS === "ios" ? "System" : "Inter",
	},
} as const;
