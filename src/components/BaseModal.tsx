import {
    Colors,
    fontSizes,
    radius,
    spacing,
    useTheme,
} from "@/constants/theme";
import { ReactNode, useMemo } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void; // android back button
  onShow?: () => void;
  children: ReactNode;
};

export default function BaseModal({
  visible,
  onClose,
  onShow,
  children,
}: Props) {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onShow={onShow}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.box}>{children}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    box: {
      width: "90%",
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
  });

// styles the modal contents share
export function useModalStyles() {
  const colors = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontSize: fontSizes.xl,
          fontWeight: "bold",
          color: colors.text,
        },
        actions: { flexDirection: "row", justifyContent: "flex-end" },
        cancelButton: {
          minHeight: 50,
          paddingHorizontal: 20,
          justifyContent: "center",
          marginRight: spacing.sm,
        },
        cancelText: {
          fontSize: fontSizes.md,
          color: colors.textSecondary,
          fontWeight: "bold",
        },
        primaryButton: {
          minHeight: 50,
          minWidth: 100,
          backgroundColor: colors.primary,
          borderRadius: radius.sm,
          paddingHorizontal: spacing.lg,
          justifyContent: "center",
          alignItems: "center",
        },
        primaryText: {
          fontSize: fontSizes.md,
          color: colors.onPrimary,
          fontWeight: "bold",
        },
      }),
    [colors],
  );
}
