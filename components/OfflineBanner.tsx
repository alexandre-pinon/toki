import { useNetwork } from "@/contexts/NetworkContext";
import { colors, typography } from "@/theme";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OfflineBanner() {
  const { isConnected, isInternetReachable, showReconnectedBanner } = useNetwork();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  const isOffline = !isConnected || !isInternetReachable;
  const showBanner = isOffline || showReconnectedBanner;

  useEffect(() => {
    if (showBanner) {
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [showBanner, fadeAnim]);

  if (!isVisible) {
    return null;
  }

  const backgroundColor = showReconnectedBanner && !isOffline ? colors.success : colors.alert;
  const message = showReconnectedBanner && !isOffline ? "Connexion rétablie" : "Pas de connexion internet";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor,
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 8,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  text: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
    fontWeight: "500",
  },
});
