import { Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type DeliveryBadgeTone = "info" | "success" | "warning" | "danger";

type DeliveryBadgeProps = {
  label: string;
  tone?: DeliveryBadgeTone;
};

const toneColors: Record<DeliveryBadgeTone, { background: string; text: string }> = {
  info: { background: colors.infoSoft, text: colors.info },
  success: { background: colors.primarySoft, text: colors.primary },
  warning: { background: colors.warningSoft, text: colors.warning },
  danger: { background: colors.dangerSoft, text: colors.danger },
};

export function DeliveryBadge({ label, tone = "info" }: DeliveryBadgeProps) {
  const palette = toneColors[tone];

  return (
    <View
      style={{
        alignSelf: "flex-start",
        borderRadius: 999,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        backgroundColor: palette.background,
      }}
    >
      <Text
        selectable
        style={{
          color: palette.text,
          fontSize: typography.caption,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
