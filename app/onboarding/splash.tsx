import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FFOutlineButton, FFPrimaryButton } from "../../src/components/FFButtons";
import { MascotBlob } from "../../src/components/MascotBlob";
import { FF } from "../../src/theme/colors";

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.welcome}>Welcome!</Text>
        <Text style={styles.p}>
          Discover the best restaurants near you, curated for your taste.
        </Text>
      </ScrollView>
      <View style={styles.actions}>
        <FFPrimaryButton
          title="Share My Location"
          onPress={() => router.push("/onboarding/location")}
        />
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or browse without</Text>
          <View style={styles.orLine} />
        </View>
        <FFOutlineButton title="Continue Without Location" onPress={() => router.push("/onboarding/apology")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: FF.cream },
  scroll: { alignItems: "center", paddingTop: 28 },
  logoBlock: { alignItems: "center", marginTop: 14 },
  logo: { fontSize: 36, fontWeight: "900", color: FF.red },
  welcome: { fontSize: 28, fontWeight: "900", color: FF.dark, marginTop: 28 },
  p: {
    fontSize: 14,
    color: FF.med,
    textAlign: "center",
    paddingHorizontal: 36,
    marginTop: 8,
    lineHeight: 22,
  },
  actions: { gap: 10 },
  orRow: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 32 },
  orLine: { flex: 1, height: 1, backgroundColor: FF.border },
  orText: { fontSize: 12, color: FF.light },
});
