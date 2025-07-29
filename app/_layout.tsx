import { ThemeProvider } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
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
import Toast from "react-native-toast-message";

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
    <ThemeProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: scheme == "dark" ? "#000000" : "#ffffff",
          paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
        }}
      >
        <StatusBar
          style={scheme == "light" ? "dark" : "light"}
          backgroundColor={scheme == "dark" ? "#000000" : "#ffffff"}
        />
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "Back" }}
          />
          <Stack.Screen
            name="aboutUs"
            options={{
              title: "About Us",
              headerTitle: "About Us",
              headerStyle: {
                backgroundColor: Colors.light.tint,
              },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast />
      </SafeAreaView>
    </ThemeProvider>
  );
}
