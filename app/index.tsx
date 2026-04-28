import { Redirect } from "expo-router";
import { useApp } from "../src/context/AppContext";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { ready, hasCompletedOnboarding, colors } = useApp();

  if (!ready) {
    return (
      <View style={[styles.center, { backgroundColor: colors.cream }]}>
        <ActivityIndicator size="large" color={colors.red} />
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding/splash" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
