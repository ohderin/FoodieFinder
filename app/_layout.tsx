import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "../src/context/AppContext";
import { useApp } from "../src/context/AppContext";

function RootStack() {
  const { colors, isDarkMode } = useApp();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={({ route }) => {
          if (route.name === "menu") {
            return {
              //presentation: "card",
              headerShown: true,
              title: "Menu",
              headerStyle: { backgroundColor: colors.cream },
              headerTintColor: colors.dark,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.cream },
              headerBackButtonDisplayMode: "minimal",
              headerBackTitleVisible: false,
            };
          }
          if (route.name === "reviews") {
            return {
              headerShown: true,
              title: "Reviews",
              headerStyle: { backgroundColor: colors.cream },
              headerTintColor: colors.dark,
              contentStyle: { backgroundColor: colors.cream },
              headerBackButtonDisplayMode: "minimal",
              headerBackTitleVisible: false,
            };
          }
          return { headerShown: false, contentStyle: { backgroundColor: colors.cream } };
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootStack />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
