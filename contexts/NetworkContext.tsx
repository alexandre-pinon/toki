import { useNetInfo } from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type NetworkContextType = {
  isConnected: boolean;
  isInternetReachable: boolean;
  userJustReconnected: boolean;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const netInfo = useNetInfo();
  const [userJustReconnected, setShowReconnectedBanner] = useState(false);
  const wasOffline = useRef(false);

  // Treat null/undefined as offline (conservative - show banner when uncertain)
  const isConnected = netInfo.isConnected ?? false;
  const isInternetReachable = netInfo.isInternetReachable ?? false;

  useEffect(() => {
    const isDefinitivelyOnline = netInfo.isConnected === true && netInfo.isInternetReachable === true;

    // Show reconnected banner when going from definitive offline to definitive online
    if (wasOffline.current && isDefinitivelyOnline) {
      setShowReconnectedBanner(true);
      setTimeout(() => {
        setShowReconnectedBanner(false);
      }, 2000);
    }

    // Only mark as "was definitely offline" when we get explicit false (not null)
    if (netInfo.isConnected === false || netInfo.isInternetReachable === false) {
      wasOffline.current = true;
    } else if (isDefinitivelyOnline) {
      wasOffline.current = false;
    }
  }, [netInfo.isConnected, netInfo.isInternetReachable]);

  return (
    <NetworkContext.Provider value={{ isConnected, isInternetReachable, userJustReconnected }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
