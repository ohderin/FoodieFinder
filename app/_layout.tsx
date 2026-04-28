import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "../src/context/AppContext";
import { FF } from "../src/theme/colors";

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
                headerStyle: { backgroundColor: FF.cream },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: FF.cream },
                headerBackButtonDisplayMode: "minimal",
                headerBackTitleVisible: false,
              };
            }
            if (route.name === "reviews") {
              return {
                headerShown: true,
                title: "Reviews",
                headerBackButtonDisplayMode: "minimal",
                headerBackTitleVisible: false,
              };
            }
            return { headerShown: false };
          }}
        />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
