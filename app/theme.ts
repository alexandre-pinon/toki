import { Platform } from "react-native";

export const colors = {
	primary: "#F2B47F",
	grey: "#808080",
	lightGrey: "#E8E8E8",
	background: "#FFFFFF",
	text: "#000000",
	danger: "#FF3B30",
	// Add more colors as needed
} as const;

export const typography = {
	header: {
		fontSize: 20,
		fontWeight: "600",
		fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
	},
	body: {
		fontSize: 15,
		fontWeight: "400",
		fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
	},
	subtext: {
		fontSize: 13,
		fontWeight: "300",
		fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
	},
} as const;

export default { colors, typography };
