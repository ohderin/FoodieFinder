import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "../src/context/AppContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Stack
          screenOptions={({ route }) => {
            if (route.name === "menu") {
              return {
                //presentation: "card",
                headerShown: true,
                title: "Menu",
              };
            }
            if (route.name === "reviews") {
              return {
                headerShown: true,
                title: "Reviews",
              };
            }
            return { headerShown: false };
          }}
        />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
