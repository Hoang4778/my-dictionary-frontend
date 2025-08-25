import { Provider } from "react-redux";
import { ThemeProvider } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { store } from "../store";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <Provider store={store}>
      <ThemeProvider>
        <StatusBar
          barStyle={scheme == "light" ? "dark-content" : "light-content"}
          backgroundColor={scheme == "dark" ? "#000000" : "#ffffff"}
        />
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
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
    </Provider>
  );
}
