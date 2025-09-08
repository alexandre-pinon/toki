import { InfoIcon } from "@/components/icons/InfoIcon";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { StatisticIcon } from "@/components/icons/StatisticIcon";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";
import { useAuth } from "@/contexts/AuthContext";
import { colors, typography } from "@/theme";
import { router, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    const success = await signOut();
    if (success) {
      router.replace("/auth");
    }
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerTitleStyle: typography.header,
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        <ProfileMenuItem
          icon={InfoIcon}
          title="Informations"
          onPress={() => router.push("/profile/infos")}
          showBorder
        />
        <ProfileMenuItem
          icon={StatisticIcon}
          title="Statistiques"
          onPress={() => router.push("/profile/statistics")}
          showBorder
        />
        <ProfileMenuItem
          icon={LogoutIcon}
          title="Déconnexion"
          onPress={handleLogout}
          showChevron={false}
          showBorder={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
});
