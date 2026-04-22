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
import { DirectionsSheet } from "../../src/components/DirectionsSheet";
import { RestaurantCard } from "../../src/components/RestaurantCard";
import { SAMPLE_RESTAURANT } from "../../src/data/sampleRestaurant";
import { FF } from "../../src/theme/colors";

const CHIPS = [
  "Near Me",
  "Open Now",
  "Chicken",
  "Burgers",
  "$",
  "$$",
  "$$$",
];

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [chips, setChips] = useState<boolean[]>(() => CHIPS.map((_, i) => i === 0));
  const [directionsOpen, setDirectionsOpen] = useState(false);

  const toggleChip = (i: number) => {
    setChips((c) => {
      const n = [...c];
      n[i] = !n[i];
      return n;
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.searchBar}>
        <Text style={styles.searchPh}>Search restaurants, dishes...</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}
      >
        {CHIPS.map((label, i) => (
          <Pressable
            key={label}
            onPress={() => toggleChip(i)}
            style={[styles.chip, chips[i] && styles.chipOn]}
          >
            <Text style={[styles.chipText, chips[i] && styles.chipTextOn]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.cardArea}>
        <RestaurantCard
          restaurant={SAMPLE_RESTAURANT}
          onSave={() => router.navigate("/(tabs)/saved")}
          onMenu={() => router.push("/menu")}
          onReviews={() => router.push("/reviews")}
          onDirections={() => setDirectionsOpen(true)}
        />
      </View>
      <DirectionsSheet
        visible={directionsOpen}
        restaurant={SAMPLE_RESTAURANT}
        onClose={() => setDirectionsOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: FF.cream },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  hamburger: { fontSize: 22 },
  logo: { fontSize: 17, fontWeight: "900", color: FF.red },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: FF.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: FF.border,
  },
  searchIcon: { fontSize: 16 },
  searchPh: { color: FF.light, fontSize: 15 },
  chipsScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  chipsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: FF.border,
    backgroundColor: "#fff",
  },
  chipOn: { borderColor: FF.red, borderWidth: 2, backgroundColor: FF.redLight },
  chipText: { fontWeight: "700", color: FF.dark, fontSize: 14 },
  chipTextOn: {},
  cardArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
