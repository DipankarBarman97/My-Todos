import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";

const STORAGE_KEY = "THEME_MODE";

export function useThemeToggle() {
  const isDark = useColorScheme() === "dark";

  // on startup, apply the theme the user picked last time (if any)
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark") {
          Appearance.setColorScheme(saved);
        }
      } catch (error) {
        console.warn("Failed to load theme", error);
      }
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    const next = isDark ? "light" : "dark";
    Appearance.setColorScheme(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((error) =>
      console.warn("Failed to save theme", error),
    );
  }, [isDark]);

  return { isDark, toggleTheme };
}
