import BaseModal, { useModalStyles } from "@/components/BaseModal";
import {
  Colors,
  fontSizes,
  radius,
  spacing,
  useTheme,
} from "@/constants/theme";
import { useMemo, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  isEditing: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function TodoModal({
  visible,
  isEditing,
  value,
  onChangeText,
  onSave,
  onCancel,
}: Props) {
  const colors = useTheme();
  const modal = useModalStyles();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const inputRef = useRef<TextInput>(null);
  const canSave = value.trim().length > 0;

  return (
    <BaseModal
      visible={visible}
      onClose={onCancel}
      onShow={() => inputRef.current?.focus()}
    >
      <Text style={[modal.title, styles.title]}>
        {isEditing ? "Edit todo" : "New todo"}
      </Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="What do you need to do?"
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSave}
        returnKeyType="done"
        autoCapitalize="sentences"
        maxLength={200}
        multiline
      />

      <View style={modal.actions}>
        <TouchableOpacity style={modal.cancelButton} onPress={onCancel}>
          <Text style={modal.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[modal.primaryButton, !canSave && styles.saveDisabled]}
          onPress={onSave}
          disabled={!canSave}
        >
          <Text style={modal.primaryText}>{isEditing ? "Save" : "Add"}</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    title: { marginBottom: spacing.md },
    input: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
      fontSize: fontSizes.md,
      color: colors.text,
      marginBottom: spacing.lg,
      minHeight: 56,
      maxHeight: 140,
      textAlignVertical: "top",
    },
    saveDisabled: { opacity: 0.4 },
  });
