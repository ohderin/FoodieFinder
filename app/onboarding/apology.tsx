import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FFOutlineButton, FFPrimaryButton } from "../../src/components/FFButtons";
import { MascotBlob } from "../../src/components/MascotBlob";
import { useApp } from "../../src/context/AppContext";

export default function ApologyScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, backgroundColor: colors.cream }]}>
      <MascotBlob grayscale />
      <View style={styles.logoBlock}>
        <Text style={[styles.logo, { color: colors.red }]}>Foodie</Text>
      </View>
      <Text style={[styles.sorry, { color: colors.red }]}>We're Sorry!</Text>
      <Text style={[styles.p, { color: colors.med }]}>
        We can't find food if we can't find you!{"\n"}
        Your location stays private and is only used to show nearby restaurants.
      </Text>
      <View style={{ flex: 1 }} />
      <View style={styles.actions}>
        <FFPrimaryButton title="📍 Share My Location" onPress={() => router.push("/onboarding/location")} />
        <View style={styles.orRow}>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.orText, { color: colors.light }]}>or</Text>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        </View>
        <FFOutlineButton title="Browse Without Location" onPress={() => router.replace("/onboarding/start")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center" },
  logoBlock: { alignItems: "center", marginTop: 14 },
  logo: { fontSize: 36, fontWeight: "900" },
  sorry: { fontSize: 28, fontWeight: "900", marginTop: 24 },
  p: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 36,
    marginTop: 8,
    lineHeight: 22,
  },
  actions: { gap: 10, width: "100%" },
  orRow: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 32 },
  orLine: { flex: 1, height: 1 },
  orText: { fontSize: 12 },
});
