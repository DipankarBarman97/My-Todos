import { useColorScheme } from "react-native";

export const lightColors = {
  primary: "#1976D2",
  danger: "#C62828",
  background: "#F5F7FA",
  surface: "#fff",
  text: "#222",
  heading: "#444",
  textSecondary: "#666",
  textMuted: "#6B6B6B",
  border: "#ccc",
  overlay: "rgba(0,0,0,0.45)",
  onPrimary: "#fff",
  snackbar: "#323232",
  onSnackbar: "#fff",
  snackbarAction: "#90CAF9",
};

export type Colors = typeof lightColors;

export const darkColors: Colors = {
  primary: "#2196F3",
  danger: "#e53935",
  background: "#121212",
  surface: "#1E1E1E",
  text: "#F2F2F2",
  heading: "#DDDDDD",
  textSecondary: "#B3B3B3",
  textMuted: "#808080",
  border: "#3A3A3A",
  overlay: "rgba(0,0,0,0.65)",
  onPrimary: "#fff",
  snackbar: "#E6E6E6",
  onSnackbar: "#222",
  snackbarAction: "#1565C0",
};

// returns the palette for the current system theme
export function useTheme(): Colors {
  return useColorScheme() === "dark" ? darkColors : lightColors;
}

export const fontSizes = { sm: 16, md: 18, lg: 22, xl: 24, xxl: 32 };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24 };
export const radius = { sm: 12, md: 14, lg: 18 };
