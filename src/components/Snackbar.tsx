import {
  Colors,
  fontSizes,
  radius,
  spacing,
  useTheme,
} from "@/constants/theme";
import { useEffect, useMemo, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type Props = {
  message: string;
  actionText?: string;
  onAction: () => void;
  onDismiss: () => void;
  duration?: number;
  style?: StyleProp<ViewStyle>; // position is decided by the screen
};

export default function Snackbar({
  message,
  actionText = "Undo",
  onAction,
  onDismiss,
  duration = 4000,
  style,
}: Props) {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const anim = useRef(new Animated.Value(0)).current;

  // always call the latest onDismiss without restarting the timer
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onDismissRef.current();
      });
    }, duration);

    return () => {
      clearTimeout(timer);
      anim.stopAnimation();
    };
  }, [anim, duration]);

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        style,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.message} numberOfLines={1}>
        {message}
      </Text>
      <TouchableOpacity onPress={onAction} hitSlop={8}>
        <Text style={styles.action}>{actionText}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 54,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.snackbar,
      borderRadius: radius.sm,
      elevation: 6,
    },
    message: { flex: 1, fontSize: fontSizes.sm, color: colors.onSnackbar },
    action: {
      marginLeft: spacing.md,
      fontSize: fontSizes.sm,
      fontWeight: "bold",
      color: colors.snackbarAction,
    },
  });
