import {
  Colors,
  fontSizes,
  radius,
  spacing,
  useTheme,
} from "@/constants/theme";
import { Todo } from "@/types/todo";
import { Ionicons } from "@expo/vector-icons";
import { memo, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.toggleArea}
          onPress={() => onToggle(todo.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: todo.done }}
        >
          <View
            style={[styles.checkbox, todo.done && styles.checkboxDone]}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
          >
            {todo.done && (
              <Ionicons name="checkmark" size={18} color={colors.onPrimary} />
            )}
          </View>
          <Text style={[styles.text, todo.done && styles.doneText]}>
            {todo.text}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onEdit(todo)}
          accessibilityRole="button"
          accessibilityLabel="Edit todo"
          accessibilityHint={todo.text}
        >
          <Ionicons name="pencil" size={22} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onDelete(todo.id)}
          accessibilityRole="button"
          accessibilityLabel="Delete todo"
          accessibilityHint={todo.text}
        >
          <Ionicons name="close" size={26} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(TodoItem);

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    wrapper: { marginHorizontal: spacing.md, marginBottom: 10 },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      paddingVertical: 6,
      paddingLeft: spacing.md,
      paddingRight: 6,
    },
    toggleArea: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: colors.primary,
      marginRight: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxDone: { backgroundColor: colors.primary },
    text: { flex: 1, fontSize: fontSizes.md, color: colors.text },
    doneText: { textDecorationLine: "line-through", color: colors.textMuted },
    iconButton: {
      width: 44,
      height: 44,
      justifyContent: "center",
      alignItems: "center",
    },
  });
