import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useMemo } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SAMPLE_RESTAURANT } from "../src/data/sampleRestaurant";
import { FF } from "../src/theme/colors";
import { getRestaurantTheme } from "../src/data/restaurantColors";
import { useLocalSearchParams } from "expo-router";
import { RESTAURANT_POOL } from "../src/data/sampleRestaurant";
import { getMenuForRestaurant } from "../src/data/restaurantMenus";
import { getIconForRestaurant } from "../src/data/restaurantEmoji";

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => `${c}${c}`).join("") : value;
  const parsed = Number.parseInt(full, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function toLinear(channel: number) {
  const n = channel / 255;
  return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(foreground: string, background: string) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

function mixWithBlack(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 - amount;
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, "0");
  return `#${toHex(r * factor)}${toHex(g * factor)}${toHex(b * factor)}`;
}

function makeReadableBannerColor(base: string, minWhiteContrast = 4.5, minDotContrast = 2.6) {
  let adjusted = base;
  let darkenBy = 0;
  while (
    darkenBy <= 0.75 &&
    (contrastRatio("#FFFFFF", adjusted) < minWhiteContrast || contrastRatio("#22C55E", adjusted) < minDotContrast)
  ) {
    darkenBy += 0.05;
    adjusted = mixWithBlack(base, darkenBy);
  }
  return adjusted;
}

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


  // Gets onboarding-style icon for menu item thumbnails.
  const menuIcon = useMemo(() => {
      return getIconForRestaurant(currentRestaurant.id);
  }, [currentRestaurant.id]);
  
  // Create dynamic styles based on theme
  const dynamicStyles = useMemo(() => {
    const readableDark = makeReadableBannerColor(theme.dark);
    const readablePrimary = makeReadableBannerColor(theme.primary);
    return {
      banner: {
        colors: [readableDark, readablePrimary] as const,
      },
      catOn: {
        backgroundColor: readablePrimary,
      },
    };
  }, [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: FF.cream }}>
      <LinearGradient
        colors={dynamicStyles.banner.colors}
        style={styles.banner}
      >
        <View style={styles.bannerRow}>
          <Image
            source={{ uri: currentRestaurant.imageUrl ?? SAMPLE_RESTAURANT.imageUrl }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerName}>{currentRestaurant.name}</Text>
            <Text style={styles.bannerMeta}>
              <Text style={styles.openDot}>●</Text> Open Now · {currentRestaurant.closingNote} ·{" "}
              {currentRestaurant.distanceMiles.toFixed(1)} mi
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
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

      <ScrollView style={styles.menuList} contentContainerStyle={styles.scrollContent}>
        {getItems.map((item, i) => (
          <View key={i} style={styles.item}>
            <View
              style={[
                styles.thumb,
              ]}
            >
              {menuIcon.lib === "ion" ? (
                <Ionicons name={menuIcon.name as React.ComponentProps<typeof Ionicons>["name"]} size={22} color={FF.med} />
              ) : (
                <MaterialCommunityIcons
                  name={menuIcon.name as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
                  size={22}
                  color={FF.med}
                />
              )}
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
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bannerImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerName: { color: "#fff", fontSize: 22, fontWeight: "900" },
  bannerMeta: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 6,
    fontSize: 13,
  },
  openDot: {
    color: "#22C55E",
  },
  catRow: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 16,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
  },
  catScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  menuList: {
    flex: 1,
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: FF.border,
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    color: FF.orange,
    marginBottom: 4,
  },
  itemName: { fontSize: 17, fontWeight: "900", color: FF.dark },
  itemDesc: { fontSize: 12, color: FF.med, marginTop: 4, lineHeight: 16 },
  price: { fontSize: 17, fontWeight: "900", marginTop: 6, color: FF.dark },
});
