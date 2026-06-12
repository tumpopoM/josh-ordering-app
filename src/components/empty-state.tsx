import { Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View
      style={{
        gap: spacing.sm,
        alignItems: "center",
        padding: spacing.xl,
      }}
    >
      <Text
        selectable
        style={{
          color: colors.text,
          fontSize: typography.sectionTitle,
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <Text
        selectable
        style={{
          color: colors.textMuted,
          fontSize: typography.body,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        {message}
      </Text>
    </View>
  );
}
