import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type Restaurant } from "../../src/data/sampleRestaurant";

const KEY = "foodie.hasCompletedOnboarding";

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
  

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        setHasCompletedOnboarding(v === "1");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(KEY, "1");
    setHasCompletedOnboarding(true);
  }, []);

  const resetOnboarding = useCallback(async () => {
    await AsyncStorage.removeItem(KEY);
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
