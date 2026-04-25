import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "foodie.hasCompletedOnboarding";
const VIBE_PREFS_KEY = "foodie.vibePreferences";

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
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [vibePreferences, setVibePreferences] = useState<VibePreferences | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [onboardingValue, vibePrefsValue] = await Promise.all([
          AsyncStorage.getItem(KEY),
          AsyncStorage.getItem(VIBE_PREFS_KEY),
        ]);
        setHasCompletedOnboarding(onboardingValue === "1");
        if (vibePrefsValue) {
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
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(KEY, "1");
    setHasCompletedOnboarding(true);
  }, []);

  const saveVibePreferences = useCallback(async (prefs: VibePreferences) => {
    await AsyncStorage.setItem(VIBE_PREFS_KEY, JSON.stringify(prefs));
    setVibePreferences(prefs);
  }, []);

  const resetOnboarding = useCallback(async () => {
    await Promise.all([AsyncStorage.removeItem(KEY), AsyncStorage.removeItem(VIBE_PREFS_KEY)]);
    setHasCompletedOnboarding(false);
    setVibePreferences(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      hasCompletedOnboarding,
      vibePreferences,
      completeOnboarding,
      saveVibePreferences,
      resetOnboarding,
    }),
    [ready, hasCompletedOnboarding, vibePreferences, completeOnboarding, saveVibePreferences, resetOnboarding]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
