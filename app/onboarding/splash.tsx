import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FFOutlineButton, FFPrimaryButton } from "../../src/components/FFButtons";
import { MascotBlob } from "../../src/components/MascotBlob";
import { useApp } from "../../src/context/AppContext";

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[styles.welcome, { color: colors.dark }]}>Welcome!</Text>
        <Text style={[styles.p, { color: colors.med }]}>
          Discover the best restaurants near you, curated for your taste.
        </Text>
      </ScrollView>
      <View style={styles.actions}>
        <FFPrimaryButton
          title="Share My Location"
          onPress={() => router.push("/onboarding/location")}
        />
        <View style={styles.orRow}>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.orText, { color: colors.light }]}>or browse without</Text>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        </View>
        <FFOutlineButton title="Continue Without Location" onPress={() => router.push("/onboarding/apology")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { alignItems: "center", paddingTop: 28 },
  logoBlock: { alignItems: "center", marginTop: 14 },
  logo: { fontSize: 36, fontWeight: "900" },
  welcome: { fontSize: 28, fontWeight: "900", marginTop: 28 },
  p: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    paddingHorizontal: 36,
    marginTop: 8,
    lineHeight: 22,
  },
  actions: { gap: 10 },
  orRow: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 32 },
  orLine: { flex: 1, height: 1 },
  orText: { fontSize: 12 },
});
