import { useState } from "react";
import { Animated } from "react-native";

export const usePickerAnimation = () => {
	const [fadeAnim] = useState(new Animated.Value(0));
	const [slideAnim] = useState(new Animated.Value(0));

	const showAnimation = () => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start();
	};

	const hideAnimation = (onComplete?: () => void) => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start(onComplete);
	};

	return { fadeAnim, slideAnim, showAnimation, hideAnimation };
};
