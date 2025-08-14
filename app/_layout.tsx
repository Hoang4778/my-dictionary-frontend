import { ThemeProvider, useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StatusBar as RNStatusBar, SafeAreaView, useColorScheme } from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const { theme } = useTheme();
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
          backgroundColor: Colors[theme].background,
          paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
        }}
      >
        <StatusBar
          style={scheme == "light" ? "dark" : "light"}
          backgroundColor={scheme == "dark" ? "#000000" : "#ffffff"}
        />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Back" }} />
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
          <Stack.Screen
            name="account"
            options={{
              title: "Profile",
              headerTitle: "Profile",
              headerStyle: {
                backgroundColor: Colors.light.tint,
              },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              title: "Login",
              headerTitle: "Login",
              headerStyle: {
                backgroundColor: Colors.light.tint,
              },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="signup"
            options={{
              title: "Signup",
              headerTitle: "Signup",
              headerStyle: {
                backgroundColor: Colors.light.tint,
              },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="+not-found"
            options={{
              title: "Not found",
              headerTitle: "Not found",
              headerStyle: {
                backgroundColor: Colors.light.tint,
              },
              headerTintColor: "white",
            }}
          />
        </Stack>
        <Toast />
      </SafeAreaView>
    </ThemeProvider>
  );
}
