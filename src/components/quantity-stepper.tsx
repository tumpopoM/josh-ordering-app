import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type QuantityStepperProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
}: QuantityStepperProps) {
  return (
    <View
      accessibilityLabel={`Quantity ${quantity}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
      }}
    >
      <StepperButton label="-" accessibilityLabel="Decrease quantity" onPress={onDecrease} />
      <Text
        selectable
        style={{
          minWidth: 32,
          color: colors.text,
          fontSize: typography.body,
          fontVariant: ["tabular-nums"],
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        {quantity}
      </Text>
      <StepperButton label="+" accessibilityLabel="Increase quantity" onPress={onIncrease} />
    </View>
  );
}

type StepperButtonProps = {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
};

function StepperButton({ label, accessibilityLabel, onPress }: StepperButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        borderCurve: "continuous",
        backgroundColor: pressed ? colors.border : colors.surfaceMuted,
      })}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: 22,
          fontWeight: "800",
          lineHeight: 24,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
