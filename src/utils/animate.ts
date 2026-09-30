import { LayoutAnimation } from "react-native";

// call right before a state change that adds, removes or moves rows
export function animateLayout() {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}
