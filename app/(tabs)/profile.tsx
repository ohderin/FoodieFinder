import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FFOutlineButton } from "../../src/components/FFButtons";
import { useApp } from "../../src/context/AppContext";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { resetOnboarding, hearted, isDarkMode, setDarkMode, colors } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const signOut = async () => {
    await resetOnboarding();
    router.replace("/onboarding/splash");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16, backgroundColor: colors.cream }]}>
      <View style={styles.hero}>
        <View style={[styles.bigAvatar, { backgroundColor: colors.orange }]}>
          <Text style={styles.bigAvatarText}>BB</Text>
        </View>
        <Text style={[styles.name, { color: colors.dark }]}>Bingo Bongo</Text>
        <Text style={[styles.sub, { color: colors.light }]}>Foodie since 1984 · Baton Rouge, LA</Text>
        <View style={[styles.stats, { backgroundColor: colors.cream2, borderColor: colors.border }]}>
          <Stat value={hearted.length.toString()} label="Saved" colors={colors} />
          <View style={[styles.vsep, { backgroundColor: colors.border }]} />
          <Stat value="0" label="Reviews" colors={colors} />
          <View style={[styles.vsep, { backgroundColor: colors.border }]} />
          <Stat value="1" label="Day Streak" colors={colors} />
        </View>
      </View>
      <View style={[styles.menuCard, { backgroundColor: colors.cream2, borderColor: colors.border }]}>
        <MenuRow
          title="My Food Preferences"
          colors={colors}
          onPress={() => router.push("/onboarding/prefs")}
        />
        <MenuRow
          title="Location Settings"
          colors={colors}
          control={
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: colors.border, true: colors.red }}
              thumbColor={locationEnabled ? "#fff" : "#f4f3f4"}
            />
          }
        />
        <MenuRow
          title="Dark Mode"
          colors={colors}
          control={
            <Switch
              value={isDarkMode}
              onValueChange={(value) => {
                void setDarkMode(value);
              }}
              trackColor={{ false: colors.border, true: colors.red }}
              thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
            />
          }
        />
        <MenuRow
          title="Notifications"
          colors={colors}
          control={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.red }}
              thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
            />
          }
          last
        />
      </View>
      <FFOutlineButton title="Sign Out" onPress={signOut} />
    </View>
  );
}

function Stat({
  value,
  label,
  colors,
}: {
  value: string;
  label: string;
  colors: ReturnType<typeof useApp>["colors"];
}) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={[styles.statVal, { color: colors.dark }]}>{value}</Text>
      <Text style={[styles.statLbl, { color: colors.light }]}>{label}</Text>
    </View>
  );
}

function MenuRow({
  title,
  onPress,
  control,
  colors,
  last,
}: {
  title: string;
  onPress?: () => void;
  control?: React.ReactNode;
  colors: ReturnType<typeof useApp>["colors"];
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.menuRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
    >
      <Text style={[styles.menuTitle, { color: colors.dark }]}>{title}</Text>
      {control ?? <Text style={[styles.chev, { color: colors.light }]}>{onPress ? "›" : ""}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  hero: { alignItems: "center", marginBottom: 20 },
  bigAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF7F00",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  bigAvatarText: { fontSize: 30, fontWeight: "900", color: "#fff" },
  name: { fontSize: 20, fontWeight: "900" },
  sub: { fontSize: 13, marginTop: 2 },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  vsep: { width: 1, height: 36 },
  statVal: { fontSize: 22, fontWeight: "900" },
  statLbl: { fontSize: 11, marginTop: 4 },
  menuCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
  },
  menuTitle: { flex: 1, fontSize: 15, fontWeight: "600" },
  chev: { fontSize: 18 },
});
