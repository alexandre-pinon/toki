import { supabase } from "@/lib/supabase";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  /**
   * Sign out from the app, returns true if successful, false otherwise
   */
  signOut: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign in process...");
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      console.log("Got Google ID token");

      if (idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });

        if (error) {
          console.error("Supabase sign in error:", error);
          throw error;
        }

        console.log("Successfully signed in with Supabase:", data);
      }
    } catch (error) {
      if (error instanceof Error) {
        if ("code" in error) {
          switch (error.code) {
            case statusCodes.SIGN_IN_CANCELLED:
              console.log("User cancelled the login flow");
              break;
            case statusCodes.IN_PROGRESS:
              console.log("Operation is in progress already");
              break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
              console.log("Play services not available or outdated");
              break;
            default:
              console.error("Error during Google sign in:", error);
          }
        } else {
          console.error("Error during Google sign in:", error);
        }
      }
    }
  };

  const signOut = async (): Promise<boolean> => {
    try {
      await GoogleSignin.signOut();
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      return false;
    }
  };

  return <AuthContext.Provider value={{ session, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
