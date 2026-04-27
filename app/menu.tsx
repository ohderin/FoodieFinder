import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SAMPLE_RESTAURANT } from "../src/data/sampleRestaurant";
import { FF } from "../src/theme/colors";
import { getRestaurantTheme } from "../src/data/restaurantColors";
import { useLocalSearchParams } from "expo-router";
import { RESTAURANT_POOL } from "../src/data/sampleRestaurant";
import { getMenuForRestaurant } from "../src/data/restaurantMenus";

export default function MenuScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();

  // Get restaurant from Restaurant_Pool
  const currentRestaurant =
    RESTAURANT_POOL.find((r) => r.id === restaurantId) || RESTAURANT_POOL[0];

  // Get the restaurant theme
  const theme = useMemo(() => {
    console.log("Restaurant ID:", currentRestaurant.id);
    console.log("🔍 restaurantId from params:", restaurantId);
    console.log(
      "🏪 currentRestaurant:",
      currentRestaurant?.name,
      currentRestaurant?.id
    );
    console.log("🎨 theme colors:", getRestaurantTheme(currentRestaurant.id));
    return getRestaurantTheme(currentRestaurant.id);
  }, [currentRestaurant.id]);

  // Get the menu for the restaurant
  const menuItems = useMemo(() => {
    return getMenuForRestaurant(currentRestaurant.id);
  }, [currentRestaurant.id]);

  const [cat, setCat] = useState<string>("");

  // Get unique categories dynamically from the menu
  const categories = useMemo(() => {
    const cats = [...new Set(menuItems.map((item) => item.category))];
    // Set first category as the default
    if (cats.length > 0 && !cat) setCat(cats[0]);
    return cats;
  }, [menuItems, cat]);

  const getItems = menuItems.filter((item) => item.category === cat);

  // Create dynamic styles based on theme
  const dynamicStyles = useMemo(() => {
    return {
      banner: {
        colors: [theme.dark, theme.primary] as const,
      },
      catOn: {
        backgroundColor: theme.primary,
      },
      thumb: {
        backgroundColor: theme.primary,
      },
      price: {
        color: theme.primary,
      },
    };
  }, [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: FF.cream }}>
      <LinearGradient
        colors={dynamicStyles.banner.colors}
        style={styles.banner}
      >
        <Text style={styles.bannerName}>{currentRestaurant.name}</Text>
        <Text style={styles.bannerMeta}>
          🟢 Open Now · {currentRestaurant.closingNote} ·{" "}
          {currentRestaurant.distanceMiles.toFixed(1)} mi
        </Text>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
      >
        {categories.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCat(c)}
            style={[
              styles.cat,
              cat === c && {
                backgroundColor: dynamicStyles.catOn.backgroundColor,
              },
            ]}
          >
            <Text
              style={[
                styles.catText,
                cat === c && styles.catTextOn,
              ]}
            >
              {c}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {getItems.map((item, i) => (
          <View key={i} style={styles.item}>
            <View
              style={[
                styles.thumb,
                { backgroundColor: dynamicStyles.thumb.backgroundColor },
              ]}
            >
              <Text style={{ fontSize: 22 }}>🍗</Text>
            </View>
            <View style={{ flex: 1 }}>
              {item.badge ? (
                <Text style={styles.badge}>{item.badge}</Text>
              ) : null}
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
              <Text
                style={[
                  styles.price,
                  { color: dynamicStyles.price.color },
                ]}
              >
                {item.price}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 20 },
  bannerName: { color: "#fff", fontSize: 22, fontWeight: "900" },
  bannerMeta: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 6,
    fontSize: 13,
  },
  catRow: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cat: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
    height: 40,
    justifyContent: "center",
  },
  catText: { fontWeight: "900", color: FF.dark, fontSize: 14 },
  catTextOn: { color: "#fff", fontSize: 14 },
  item: {
    flexDirection: "row",
    gap: 12,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: FF.border,
    marginBottom: 6,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    color: FF.orange,
    marginBottom: 4,
  },
  itemName: { fontSize: 17, fontWeight: "900", color: FF.dark },
  itemDesc: { fontSize: 12, color: FF.med, marginTop: 4, lineHeight: 16 },
  price: { fontSize: 17, fontWeight: "900", marginTop: 6 },
});