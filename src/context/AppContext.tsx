import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type Restaurant } from "../../src/data/sampleRestaurant";

const ONBOARDING_KEY = "foodie.hasCompletedOnboarding";
const VIBE_PREFS_KEY = "foodie.vibePreferences";
const HEARTED_KEY = "foodie.heartedRestaurants";

export type VibePreferences = {
  meals: string[];
  styles: string[];
  cuisines: string[];
  priceLevel: number;
};

type AppContextValue = {
  ready: boolean;
  hasCompletedOnboarding: boolean;
  vibePreferences: VibePreferences | null;
  completeOnboarding: () => Promise<void>;
  saveVibePreferences: (prefs: VibePreferences) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  hearted: Restaurant[];
  addHeart: (res: Restaurant) => void;
  removeHeart: (id: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [vibePreferences, setVibePreferences] = useState<VibePreferences | null>(null);
  const [hearted, setHearted] = useState<Restaurant[]>([]);
  const [heartedHydrated, setHeartedHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [onboardingValue, vibePrefsValue, heartedValue] = await Promise.all([
          AsyncStorage.getItem(ONBOARDING_KEY),
          AsyncStorage.getItem(VIBE_PREFS_KEY),
          AsyncStorage.getItem(HEARTED_KEY),
        ]);
        setHasCompletedOnboarding(onboardingValue === "1");
        if (vibePrefsValue) {
          try {
            const parsed = JSON.parse(vibePrefsValue) as VibePreferences;
            if (
              parsed &&
              Array.isArray(parsed.meals) &&
              Array.isArray(parsed.styles) &&
              Array.isArray(parsed.cuisines) &&
              typeof parsed.priceLevel === "number"
            ) {
              setVibePreferences(parsed);
            }
          } catch {
            // ignore broken data and use defaults
          }
        }
        if (heartedValue) {
          try {
            const parsed = JSON.parse(heartedValue) as Restaurant[];
            if (Array.isArray(parsed)) {
              setHearted(parsed);
            }
          } catch {
            // ignore broken data and use defaults
          }
        }
      } finally {
        setHeartedHydrated(true);
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!heartedHydrated) return;
    AsyncStorage.setItem(HEARTED_KEY, JSON.stringify(hearted)).catch(() => {
    });
  }, [hearted, heartedHydrated]);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "1");
    setHasCompletedOnboarding(true);
  }, []);

  const saveVibePreferences = useCallback(async (prefs: VibePreferences) => {
    await AsyncStorage.setItem(VIBE_PREFS_KEY, JSON.stringify(prefs));
    setVibePreferences(prefs);
  }, []);

  const resetOnboarding = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(ONBOARDING_KEY),
      AsyncStorage.removeItem(VIBE_PREFS_KEY),
      AsyncStorage.removeItem(HEARTED_KEY),
    ]);
    setHasCompletedOnboarding(false);
    setVibePreferences(null);
    setHearted([]);
  }, []);

  const addHeart = useCallback((res: Restaurant) => {
    setHearted((prev) => {
      if (prev.find((item) => item.id === res.id)) return prev;
      return [...prev, res];
    });
  }, []);

  const removeHeart = useCallback((id: string) => {
    setHearted((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      ready,
      hasCompletedOnboarding,
      vibePreferences,
      completeOnboarding,
      saveVibePreferences,
      resetOnboarding,
      hearted,
      addHeart,
      removeHeart,
    }),
    [
      ready,
      hasCompletedOnboarding,
      vibePreferences,
      completeOnboarding,
      saveVibePreferences,
      resetOnboarding,
      hearted,
      addHeart,
      removeHeart,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
