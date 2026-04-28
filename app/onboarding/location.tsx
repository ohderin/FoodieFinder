import * as Location from "expo-location";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MascotBlob } from "../../src/components/MascotBlob";
import { useApp } from "../../src/context/AppContext";

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  const allow = async () => {
    await Location.requestForegroundPermissionsAsync();
    router.replace("/onboarding/start");
  };

  const deny = () => {
    router.replace("/onboarding/apology");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, backgroundColor: colors.cream }]}>
      <MascotBlob />
      <View style={styles.logoBlock}>
        <Text style={[styles.logo, { color: colors.red }]}>Foodie</Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={[styles.sheet, { backgroundColor: colors.cream2 }]}>
        <View style={[styles.sheetHead, { backgroundColor: colors.red }]}>
          <Text style={styles.sheetTitle}>Allow Foodie to access your location?</Text>
          <Text style={styles.sheetDesc}>Used only to show restaurants near you</Text>
        </View>
        <View>
          <ActionRow title="Allow While Using the App" onPress={allow} colors={colors} />
          <ActionRow title="Allow Once" onPress={allow} colors={colors} />
          <ActionRow title="Don't Allow" danger onPress={deny} colors={colors} />
        </View>
      </View>
    </View>
  );
}

function ActionRow({
  title,
  onPress,
  danger,
  colors,
}: {
  title: string;
  onPress: () => void;
  danger?: boolean;
  colors: ReturnType<typeof useApp>["colors"];
}) {
  return (
    <Text
      onPress={onPress}
      style={[styles.row, { color: colors.dark, borderBottomColor: colors.border }, danger && { color: colors.red, fontWeight: "700" }]}
    >
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center" },
  logoBlock: { alignItems: "center", marginTop: 14 },
  logo: { fontSize: 36, fontWeight: "900" },
  sheet: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    marginHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  sheetHead: {
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  sheetIcon: { fontSize: 34, marginBottom: 8 },
  sheetTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 22,
  },
  sheetDesc: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4 },
  row: {
    textAlign: "center",
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0e8e0",
  },
});
