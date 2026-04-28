import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../src/context/AppContext";
import {
  Animated,
  ImageBackground,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DirectionsSheet } from "../../src/components/DirectionsSheet";
import { RESTAURANT_POOL, SAMPLE_RESTAURANT, type Restaurant } from "../../src/data/sampleRestaurant";
import { FF } from "../../src/theme/colors";

const FILTERS = ["Nearby", "Open Now", "$$$", "$$", "$"];
const DEFAULT_RESTAURANT_BG_URI =
  "https://cdn.under30ceo.com/wp-content/uploads/2024/12/b67d70f9-3f97-4375-9bf9-e9ff1bb307c4.jpg";
const SWIPE_THRESHOLD = 120;
const SWIPE_PREFS_KEY = "foodie.swipePrefs";
const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

type SwipePrefs = {
  disliked: Record<string, true>;
  weights: Record<string, number>;
};

const INITIAL_PREFS: SwipePrefs = {
  disliked: {},
  weights: {},
};

function normalizePrefs(raw: unknown): SwipePrefs {
  if (!raw || typeof raw !== "object") return INITIAL_PREFS;
  const maybe = raw as { disliked?: unknown; weights?: unknown };
  const dislikedEntries =
    maybe.disliked && typeof maybe.disliked === "object"
      ? Object.entries(maybe.disliked as Record<string, unknown>).filter(([, value]) => value === true)
      : [];
  const weightEntries =
    maybe.weights && typeof maybe.weights === "object"
      ? Object.entries(maybe.weights as Record<string, unknown>).filter(
          ([, value]) => typeof value === "number" && Number.isFinite(value) && value > 0
        )
      : [];
  const disliked = dislikedEntries.reduce<Record<string, true>>((acc, [id]) => {
    acc[id] = true;
    return acc;
  }, {});
  const weights = weightEntries.reduce<Record<string, number>>((acc, [id, value]) => {
    acc[id] = value as number;
    return acc;
  }, {});
  return {
    disliked,
    weights,
  };
}

function pickNextRestaurant(prefs: SwipePrefs, excludeId?: string): Restaurant | null {
  const candidates = RESTAURANT_POOL.filter((restaurant) => !prefs.disliked[restaurant.id]);
  if (!candidates.length) return null;

  const weighted = candidates.map((restaurant) => {
    const baseWeight = prefs.weights[restaurant.id] ?? 1;
    const penalizedWeight =
      excludeId && candidates.length > 1 && restaurant.id === excludeId ? baseWeight * 0.25 : baseWeight;
    return { restaurant, weight: Math.max(0.2, penalizedWeight) };
  });

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of weighted) {
    random -= item.weight;
    if (random <= 0) return item.restaurant;
  }
  return weighted[weighted.length - 1]?.restaurant ?? null;
}

function buildNextPrefs(current: SwipePrefs, currentId: string, direction: "left" | "right"): SwipePrefs {
  const next: SwipePrefs = {
    disliked: { ...current.disliked },
    weights: { ...current.weights },
  };
  if (direction === "left") {
    next.disliked[currentId] = true;
  } else {
    next.weights[currentId] = (next.weights[currentId] ?? 1) + 2;
  }
  return next;
}

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [filters, setFilters] = useState<boolean[]>(() => FILTERS.map((_, i) => i === 0));
  const [prefs, setPrefs] = useState<SwipePrefs>(INITIAL_PREFS);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(() => pickNextRestaurant(INITIAL_PREFS));
  const [prefsHydrated, setPrefsHydrated] = useState(false);
  const swipe = useRef(new Animated.ValueXY()).current;
  const prefsRef = useRef<SwipePrefs>(INITIAL_PREFS);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SWIPE_PREFS_KEY);
        if (!raw) {
          return;
        }
        const parsed = normalizePrefs(JSON.parse(raw));
        setPrefs(parsed);
        setRestaurant(pickNextRestaurant(parsed));
      } catch {
        // Ignore malformed local data and continue with defaults.
      } finally {
        setPrefsHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!prefsHydrated) return;
    AsyncStorage.setItem(SWIPE_PREFS_KEY, JSON.stringify(prefs)).catch(() => {
      // Non-blocking persistence failure; UI should continue to function.
    });
  }, [prefs, prefsHydrated]);

  useEffect(() => {
    prefsRef.current = prefs;
  }, [prefs]);

  const { addHeart } = useApp();
  const toggleFilter = (index: number) => {
    setFilters((current) => {
      const next = [...current];
      next[index] = !next[index];
      return next;
    });
  };

  const rotate = useMemo(
    () =>
      swipe.x.interpolate({
        inputRange: [-180, 0, 180],
        outputRange: ["-10deg", "0deg", "10deg"],
        extrapolate: "clamp",
      }),
    [swipe.x]
  );

  const likeOpacity = useMemo(
    () =>
      swipe.x.interpolate({
        inputRange: [0, 60, 140],
        outputRange: [0, 0.3, 1],
        extrapolate: "clamp",
      }),
    [swipe.x]
  );

  const nopeOpacity = useMemo(
    () =>
      swipe.x.interpolate({
        inputRange: [-140, -60, 0],
        outputRange: [1, 0.3, 0],
        extrapolate: "clamp",
      }),
    [swipe.x]
  );

  const advanceRestaurant = useCallback(
    (direction: "left" | "right") => {
      if (!restaurant) return;
      const currentId = restaurant.id;
      const nextPrefs = buildNextPrefs(prefsRef.current, currentId, direction);
      setPrefs(nextPrefs);
      setRestaurant(pickNextRestaurant(nextPrefs, currentId));
    },
    [restaurant]
  );

  const snapBack = useCallback(() => {
    Animated.spring(swipe, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      bounciness: 7,
    }).start();
  }, [swipe]);

  const triggerSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!restaurant) return;
      const targetX = direction === "right" ? 420 : -420;
      Animated.timing(swipe, {
        toValue: { x: targetX, y: -20 },
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        swipe.setValue({ x: 0, y: 0 });
        advanceRestaurant(direction);
      });
    },
    [advanceRestaurant, restaurant, swipe]
  );

  const resetRecommendations = useCallback(() => {
    swipe.setValue({ x: 0, y: 0 });
    setPrefs(INITIAL_PREFS);
    setRestaurant(pickNextRestaurant(INITIAL_PREFS));
  }, [swipe]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          !!restaurant &&
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderMove: (_, gestureState) => {
          swipe.setValue({ x: gestureState.dx, y: gestureState.dy * 0.25 });
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > SWIPE_THRESHOLD) {
            triggerSwipe("right");
            return;
          }
          if (gestureState.dx < -SWIPE_THRESHOLD) {
            triggerSwipe("left");
            return;
          }
          snapBack();
        },
        onPanResponderTerminate: snapBack,
      }),
    [restaurant, snapBack, swipe, triggerSwipe]
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.searchBar}>
        <View style={styles.glassFill} />
        <View style={styles.searchContent}>
          <Ionicons name="search" size={16} color={FF.light} />
          <Text style={styles.searchPh}>Search restaurants, dishes...</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((label, index) => (
          <Pressable
            key={label}
            onPress={() => toggleFilter(index)}
            style={[styles.filterPill, filters[index] && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, filters[index] && styles.filterTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.cardArea}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX: swipe.x }, { translateY: swipe.y }, { rotate }],
            },
          ]}
          {...(restaurant ? panResponder.panHandlers : {})}
        >
          <AnimatedImageBackground
            source={{ uri: restaurant?.imageUrl ?? DEFAULT_RESTAURANT_BG_URI }}
            style={styles.cardBackground}
            imageStyle={styles.cardBackgroundImage}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.22)", "rgba(0,0,0,0.8)"]}
            style={styles.cardScrim}
          />
          <Animated.View style={[styles.swipeTag, styles.swipeTagLike, { opacity: likeOpacity }]}>
            <Text style={styles.swipeTagText}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.swipeTag, styles.swipeTagNope, { opacity: nopeOpacity }]}>
            <Text style={styles.swipeTagText}>NOPE</Text>
          </Animated.View>
          <View style={styles.locationPill}>
            <Ionicons name="location-sharp" size={12} color="#E8FFF4" />
            <Text style={styles.locationPillText}>Nearby</Text>
          </View>

          <Pressable style={styles.floatAction} onPress={() => setDirectionsOpen(true)} disabled={!restaurant}>
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable
            style={[styles.floatAction, styles.floatActionSecondary]}
            onPress={() => router.push("/reviews")}
            disabled={!restaurant}
          >
            <Ionicons name="chatbubble-ellipses" size={19} color="#FFFFFF" />
          </Pressable>

          <View style={styles.cardBody}>
            {restaurant ? (
              <>
                <Text style={styles.nameText}>{restaurant.name}</Text>
                <Text style={styles.metaText}>LSU Area · {restaurant.distanceMiles.toFixed(1)} miles away</Text>
                <Text style={styles.metaText}>
                  {restaurant.tags[0]}, {restaurant.tags[1]}
                </Text>
                <Text style={styles.ratingText}>
                  ★ {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.nameText}>No more restaurants</Text>
                <Text style={styles.metaText}>You disliked every option in the current pool.</Text>
                <Text style={styles.ratingText}>Tap refresh to reset recommendations.</Text>
              </>
            )}
          </View>
        </Animated.View>
      </View>

      <View style={styles.actionRow}>
        <CircleAction icon="refresh" color="#A5A5AA" onPress={resetRecommendations} />
        <CircleAction icon="close" color="#F44336" big onPress={() => triggerSwipe("left")} />
        <CircleAction icon="restaurant" color="#F44336" onPress={() => router.push("/menu")} />
        <CircleAction icon="heart" color="#FFFFFF" big onPress={() => {triggerSwipe("right"); if(restaurant){addHeart(restaurant);}}} accent />
      </View>

      <DirectionsSheet
        visible={directionsOpen}
        restaurant={restaurant ?? SAMPLE_RESTAURANT}
        onClose={() => setDirectionsOpen(false)}
      />
    </View>
  );
}

function CircleAction({
  icon,
  color,
  big,
  accent,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  big?: boolean;
  accent?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionButton, big && styles.actionButtonBig, accent && styles.actionButtonAccent]}
    >
      <Ionicons name={icon} size={big ? 31 : 24} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: FF.cream,
    paddingHorizontal: 14,
  },
  searchBar: {
    overflow: "hidden",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.52)",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchPh: {
    color: FF.light,
    fontSize: 15,
  },
  glassFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  filterRow: {
    gap: 8,
    paddingVertical: 2,
    paddingHorizontal: 1,
    alignItems: "center",
  },
  filterScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 8,
  },
  filterPill: {
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: FF.border,
    backgroundColor: "#fff",
  },
  filterPillActive: {
    borderColor: FF.red,
    backgroundColor: FF.redLight,
  },
  filterText: {
    color: FF.dark,
    fontSize: 12,
    fontWeight: "600",
  },
  filterTextActive: {
    color: FF.redDark,
  },
  cardArea: {
    flex: 1,
    marginTop: 8,
  },
  card: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  cardBackgroundImage: {
    borderRadius: 28,
  },
  cardScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  swipeTag: {
    position: "absolute",
    top: 18,
    zIndex: 6,
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  swipeTagLike: {
    left: 16,
    borderColor: "#7EE36A",
  },
  swipeTagNope: {
    right: 16,
    borderColor: "#FF6D6A",
  },
  swipeTagText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.2,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationPill: {
    position: "absolute",
    left: 16,
    top: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(8,137,104,0.85)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationPillText: {
    color: "#E8FFF4",
    fontWeight: "700",
    fontSize: 13,
  },
  floatAction: {
    position: "absolute",
    right: 16,
    bottom: 152,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.46)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  floatActionSecondary: {
    bottom: 98,
  },
  cardBody: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingRight: 86,
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 44,
    maxWidth: "92%",
    textShadowColor: "rgba(0,0,0,0.72)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  metaText: {
    color: "rgba(255,255,255,0.96)",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 5,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 7,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 7,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingTop: 14,
    paddingBottom: 10,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E1D8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  actionButtonBig: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  actionButtonAccent: {
    backgroundColor: "#F24300",
    borderColor: "#F24300",
  },
});
