import {
    Colors,
    fontSizes,
    radius,
    spacing,
    useTheme,
} from "@/constants/theme";
import { Filter } from "@/types/todo";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "done", label: "Done" },
];

type Props = {
  value: Filter;
  onChange: (filter: Filter) => void;
};

export default function FilterTabs({ value, onChange }: Props) {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {TABS.map((tab) => {
        const selected = tab.key === value;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selected && styles.tabSelected]}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      padding: 4,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    tab: {
      flex: 1,
      minHeight: 44,
      borderRadius: radius.sm,
      justifyContent: "center",
      alignItems: "center",
    },
    tabSelected: { backgroundColor: colors.primary },
    tabText: {
      fontSize: fontSizes.sm,
      fontWeight: "bold",
      color: colors.textSecondary,
    },
    tabTextSelected: { color: colors.onPrimary },
  });
