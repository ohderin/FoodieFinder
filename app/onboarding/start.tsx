import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FFOutlineButton, FFPrimaryButton } from "../../src/components/FFButtons";
import { MascotBlob } from "../../src/components/MascotBlob";
import { useApp } from "../../src/context/AppContext";

export default function StartScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding, colors } = useApp();

  const browse = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, backgroundColor: colors.cream }]}>
      <MascotBlob />
      <View style={styles.logoBlock}>
        <Text style={[styles.logo, { color: colors.red }]}>Foodie</Text>
      </View>
      <Text style={[styles.welcome, { color: colors.dark }]}>Welcome!</Text>
      <Text style={[styles.p, { color: colors.med }]}>How would you like to explore?</Text>
      <View style={{ flex: 1 }} />
      <View style={styles.actions}>
        <FFPrimaryButton title="Help Me Find Something" onPress={() => router.push("/onboarding/prefs")} />
        <View style={styles.orRow}>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.orText, { color: colors.light }]}>or</Text>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        </View>
        <FFOutlineButton title="I'll Find What I Want" onPress={browse} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center" },
  logoBlock: { alignItems: "center", marginTop: 14 },
  logo: { fontSize: 36, fontWeight: "900" },
  welcome: { fontSize: 28, fontWeight: "900", marginTop: 28 },
  p: { fontSize: 14, marginTop: 8 },
  actions: { gap: 10, width: "100%" },
  orRow: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 32 },
  orLine: { flex: 1, height: 1 },
  orText: { fontSize: 12 },
});
