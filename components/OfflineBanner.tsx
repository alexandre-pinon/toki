import { useNetwork } from "@/contexts/NetworkContext";
import { colors, typography } from "@/theme";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AUTO_DISMISS_TIMEOUT = 5000; // Auto-hide offline banner after 5 seconds

export function OfflineBanner() {
  const { isConnected, isInternetReachable, showReconnectedBanner } = useNetwork();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isOffline = !isConnected || !isInternetReachable;
  const showBanner = (isOffline && !isDismissed) || showReconnectedBanner;

  useEffect(() => {
    // Reset dismissed state when going back online
    if (!isOffline) {
      setIsDismissed(false);
    }
  }, [isOffline]);

  useEffect(() => {
    // Clear any existing timeout
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
    }

    if (showBanner) {
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss offline banner after timeout
      if (isOffline && !showReconnectedBanner) {
        dismissTimeoutRef.current = setTimeout(() => {
          setIsDismissed(true);
        }, AUTO_DISMISS_TIMEOUT);
      }
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }

    return () => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, [showBanner, isOffline, showReconnectedBanner, fadeAnim]);

  if (!isVisible && !showBanner) {
    return null;
  }

  const backgroundColor = showReconnectedBanner && !isOffline ? colors.success : colors.alert;
  const message = showReconnectedBanner && !isOffline ? "Connexion rétablie" : "Pas de connexion internet";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 4,
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
    paddingBottom: 4,
    paddingHorizontal: 12,
    zIndex: 1000,
  },
  text: {
    ...typography.subtext,
    color: colors.white,
    textAlign: "center",
    fontWeight: "500",
  },
});
