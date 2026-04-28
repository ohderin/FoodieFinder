import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type Restaurant } from "../../src/data/sampleRestaurant";

const ONBOARDING_KEY = "foodie.hasCompletedOnboarding";
const HEARTED_KEY = "foodie.heartedRestaurants";

type AppContextValue = {
  ready: boolean;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  hearted: Restaurant[];
  addHeart: (res: Restaurant) => void;
  removeHeart: (id: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hearted, setHearted] = useState<Restaurant[]>([]);
  const [heartedHydrated, setHeartedHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [onboardingValue, heartedValue] = await Promise.all([
          AsyncStorage.getItem(ONBOARDING_KEY),
          AsyncStorage.getItem(HEARTED_KEY),
        ]);
        setHasCompletedOnboarding(onboardingValue === "1");
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
      // persistance failure, UI fallback (continue regardless)
    });
  }, [hearted, heartedHydrated]);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "1");
    setHasCompletedOnboarding(true);
  }, []);

  const resetOnboarding = useCallback(async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    setHasCompletedOnboarding(false);
  }, []);

  const addHeart = useCallback((res: Restaurant) => {
    setHearted((prev) => {
      // Check for duplicates based on the Restaurant ID
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
      completeOnboarding,
      resetOnboarding,
      hearted,
      addHeart,
      removeHeart,
    }),
    [ready, hasCompletedOnboarding, completeOnboarding, resetOnboarding, hearted, addHeart, removeHeart]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
