import type { ReactNode } from "react";
import { Pressable, Text, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type PrimaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function PrimaryButton({
  children,
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 52,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          borderCurve: "continuous",
          paddingHorizontal: spacing.lg,
          backgroundColor: disabled
            ? colors.border
            : pressed
              ? colors.primaryPressed
              : colors.primary,
        },
        style,
      ]}
    >
      <Text
        selectable
        style={{
          color: disabled ? colors.textMuted : colors.surface,
          fontSize: typography.body,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
