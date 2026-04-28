import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FFOutlineButton, FFPrimaryButton } from "../../src/components/FFButtons";
import { MascotBlob } from "../../src/components/MascotBlob";
import { useApp } from "../../src/context/AppContext";
import { FF } from "../../src/theme/colors";

export default function StartScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();

  const browse = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}>
      <MascotBlob />
      <View style={styles.logoBlock}>
        <Text style={styles.logo}>Foodie</Text>
      </View>
      <Text style={styles.welcome}>Welcome!</Text>
      <Text style={styles.p}>How would you like to explore?</Text>
      <View style={{ flex: 1 }} />
      <View style={styles.actions}>
        <FFPrimaryButton title="Help Me Find Something" onPress={() => router.push("/onboarding/prefs")} />
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>
        <FFOutlineButton title="I'll Find What I Want" onPress={browse} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: FF.cream, alignItems: "center" },
  logoBlock: { alignItems: "center", marginTop: 14 },
  logo: { fontSize: 36, fontWeight: "900", color: FF.red },
  welcome: { fontSize: 28, fontWeight: "900", color: FF.dark, marginTop: 28 },
  p: { fontSize: 14, color: FF.med, marginTop: 8 },
  actions: { gap: 10, width: "100%" },
  orRow: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 32 },
  orLine: { flex: 1, height: 1, backgroundColor: FF.border },
  orText: { fontSize: 12, color: FF.light },
});
