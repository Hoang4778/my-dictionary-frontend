import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeType = "light" | "dark";

const ThemeContext = createContext<{
  theme: ThemeType;
  toggleTheme: () => void;
}>({ theme: "light", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemScheme || "light");

  async function loadTheme() {
    try {
      const theme = await SecureStore.getItemAsync("theme");
      if (theme !== null) {
        if (theme === "dark" || theme === "light") {
          setTheme(theme as ThemeType);
        }
      }
    } catch (error) {
      setTheme("light");
    }
  }

  async function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    try {
      await SecureStore.setItemAsync("theme", newTheme);
    } catch (error: any) {
      console.error("Failed to save theme: ", error.message);
    }
  }

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
