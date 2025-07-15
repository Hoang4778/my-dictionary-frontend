import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StatusBar as RNStatusBar,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const scheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: scheme == "dark" ? "#000000" : "#ffffff",
        paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
      }}
    >
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Search" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar
        style={scheme == "light" ? "dark" : "light"}
        backgroundColor={scheme == "dark" ? "#000000" : "#ffffff"}
      />
    </SafeAreaView>
  );
}
