import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type NetworkContextType = {
  isConnected: boolean;
  isInternetReachable: boolean;
  showReconnectedBanner: boolean;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const [showReconnectedBanner, setShowReconnectedBanner] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    const handleNetworkChange = (state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable ?? false;

      setIsConnected(connected);
      setIsInternetReachable(reachable);

      // If we were offline and now we're back online, show reconnected banner
      if (wasOffline.current && connected && reachable) {
        setShowReconnectedBanner(true);
        setTimeout(() => {
          setShowReconnectedBanner(false);
        }, 2000);
      }

      // Track offline state for next change
      wasOffline.current = !connected || !reachable;
    };

    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    // Get initial state
    NetInfo.fetch().then(handleNetworkChange);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, isInternetReachable, showReconnectedBanner }}>
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
