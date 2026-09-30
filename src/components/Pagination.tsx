import {
  Colors,
  fontSizes,
  radius,
  spacing,
  useTheme,
} from "@/constants/theme";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// button height + top and bottom padding, used to lift the + button and snackbar
export const PAGINATION_HEIGHT = 44 + spacing.sm * 2;

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: Props) {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (totalPages <= 1) return null;

  const atStart = page === 1;
  const atEnd = page === totalPages;

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.button, atStart && styles.disabled]}
        onPress={() => onChange(page - 1)}
        disabled={atStart}
        accessibilityRole="button"
        accessibilityLabel="Previous page"
        accessibilityState={{ disabled: atStart }}
      >
        <Text style={styles.buttonText}>‹ Prev</Text>
      </TouchableOpacity>

      <Text style={styles.label} accessibilityLiveRegion="polite">
        Page {page} of {totalPages}
      </Text>

      <TouchableOpacity
        style={[styles.button, atEnd && styles.disabled]}
        onPress={() => onChange(page + 1)}
        disabled={atEnd}
        accessibilityRole="button"
        accessibilityLabel="Next page"
        accessibilityState={{ disabled: atEnd }}
      >
        <Text style={styles.buttonText}>Next ›</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    // full-width bar pinned below the list
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.background,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    button: {
      minHeight: 44,
      minWidth: 88,
      paddingHorizontal: spacing.md,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    buttonText: {
      fontSize: fontSizes.sm,
      fontWeight: "bold",
      color: colors.text,
    },
    label: { fontSize: fontSizes.sm, color: colors.textSecondary },
    disabled: { opacity: 0.4 },
  });
