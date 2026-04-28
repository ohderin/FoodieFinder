import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../../src/context/AppContext";
import { FF } from "../../src/theme/colors";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type MciIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type IconSpec =
  | { lib: "ion"; name: IconName }
  | { lib: "mci"; name: MciIconName };

const MEALS: ReadonlyArray<{ icon: IconSpec; label: string }> = [
  { icon: { lib: "ion", name: "cafe-outline" }, label: "Breakfast" },
  { icon: { lib: "ion", name: "sunny-outline" }, label: "Lunch" },
  { icon: { lib: "ion", name: "moon-outline" }, label: "Dinner" },
  { icon: { lib: "ion", name: "ice-cream-outline" }, label: "Dessert" },
];
const STYLES: ReadonlyArray<{ icon: IconSpec; label: string }> = [
  { icon: { lib: "ion", name: "restaurant-outline" }, label: "Dine-in" },
  { icon: { lib: "ion", name: "bag-handle-outline" }, label: "Takeout" },
  { icon: { lib: "ion", name: "bicycle-outline" }, label: "Delivery" },
];
const CUISINES: ReadonlyArray<{ icon: IconSpec; label: string }> = [
  { icon: { lib: "mci", name: "food-drumstick-outline" }, label: "Chicken" },
  { icon: { lib: "ion", name: "fast-food-outline" }, label: "Burgers" },
  { icon: { lib: "mci", name: "taco" }, label: "Mexican" },
  { icon: { lib: "ion", name: "fish-outline" }, label: "Sushi" },
  { icon: { lib: "ion", name: "pizza-outline" }, label: "Pizza" },
  { icon: { lib: "ion", name: "leaf-outline" }, label: "Salads" },
];

export default function PrefsScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding, saveVibePreferences } = useApp();
  const [meal, setMeal] = useState<Record<string, boolean>>({
    Lunch: true,
    Dinner: true,
  });
  const [style, setStyle] = useState<Record<string, boolean>>({ "Dine-in": true });
  const [cuisine, setCuisine] = useState<Record<string, boolean>>({
    Chicken: true,
    Burgers: true,
  });
  const [price, setPrice] = useState(1);

  const finish = async () => {
    await saveVibePreferences({
      meals: Object.keys(meal).filter((label) => meal[label]),
      styles: Object.keys(style).filter((label) => style[label]),
      cuisines: Object.keys(cuisine).filter((label) => cuisine[label]),
      priceLevel: price + 1,
    });
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Set Your Vibe</Text>
        <View style={{ width: 38 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Section title="Meal Time">
          <ChipRow>
            {MEALS.map((m) => (
              <PrefChip
                key={m.label}
                icon={m.icon}
                label={m.label}
                on={!!meal[m.label]}
                onToggle={() =>
                  setMeal((s) => ({ ...s, [m.label]: !s[m.label] }))
                }
              />
            ))}
          </ChipRow>
        </Section>
        <Section title="Dining Style">
          <ChipRow>
            {STYLES.map((m) => (
              <PrefChip
                key={m.label}
                icon={m.icon}
                label={m.label}
                on={!!style[m.label]}
                onToggle={() =>
                  setStyle((s) => ({ ...s, [m.label]: !s[m.label] }))
                }
              />
            ))}
          </ChipRow>
        </Section>
        <Section title="Cuisine">
          <ChipRow>
            {CUISINES.map(({ icon, label }) => (
              <PrefChip
                key={label}
                icon={icon}
                label={label}
                on={!!cuisine[label]}
                onToggle={() =>
                  setCuisine((s) => ({ ...s, [label]: !s[label] }))
                }
              />
            ))}
          </ChipRow>
        </Section>
        <Section title="Price Range">
          <View style={styles.priceRow}>
            {[0, 1, 2].map((i) => (
              <Pressable
                key={i}
                onPress={() => setPrice(i)}
                style={[
                  styles.priceTile,
                  price === i && styles.priceTileOn,
                ]}
              >
                <Text
                  style={[
                    styles.priceText,
                    price === i && styles.priceTextOn,
                  ]}
                >
                  {["$", "$$", "$$$"][i]}
                </Text>
              </Pressable>
            ))}
          </View>
        </Section>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.showBtn} onPress={finish}>
          <Text style={styles.showBtnText}>Explore</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 16, paddingHorizontal: 20 }}>
      <Text style={styles.sectionLbl}>{title}</Text>
      {children}
    </View>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.chipWrap}>{children}</View>
  );
}

function PrefChip({
  icon,
  label,
  on,
  onToggle,
}: {
  icon: IconSpec;
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.chip, on && styles.chipOn]}
    >
      <Text>
        {icon.lib === "ion" ? (
          <Ionicons name={icon.name} size={15} color={FF.med} style={styles.chipIcon} />
        ) : (
          <MaterialCommunityIcons
            name={icon.name}
            size={15}
            color={FF.med}
            style={styles.chipIcon}
          />
        )}
        <Text style={styles.chipLabel}> {label}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: FF.cream },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  back: { fontSize: 28, fontWeight: "700", color: FF.dark },
  headerTitle: { fontSize: 17, fontWeight: "800", color: FF.dark },
  sectionLbl: {
    fontSize: 11,
    fontWeight: "800",
    color: FF.light,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: FF.border,
    backgroundColor: "#fff",
  },
  chipOn: {
    borderColor: FF.red,
    borderWidth: 2,
    backgroundColor: FF.redLight,
  },
  chipIcon: { marginRight: 2 },
  chipLabel: { fontSize: 14, fontWeight: "700", color: FF.dark },
  priceRow: { flexDirection: "row", gap: 12 },
  priceTile: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: FF.border,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  priceTileOn: { backgroundColor: FF.red },
  priceText: { fontSize: 20, fontWeight: "900", color: FF.dark },
  priceTextOn: { color: "#fff" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    backgroundColor: FF.cream,
  },
  showBtn: {
    backgroundColor: FF.red,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  showBtnText: { color: "#fff", fontSize: 17, fontWeight: "900" },
});
