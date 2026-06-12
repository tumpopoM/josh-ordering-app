import { Text, View } from "react-native";

import { PrimaryButton } from "@/components/primary-button";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type ErrorStateProps = {
  title: string;
  message: string;
  onRetry: () => void;
};

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <View
      style={{
        gap: spacing.md,
        borderRadius: 16,
        borderCurve: "continuous",
        padding: spacing.lg,
        backgroundColor: colors.dangerSoft,
      }}
    >
      <Text
        selectable
        style={{ color: colors.danger, fontSize: typography.sectionTitle, fontWeight: "800" }}
      >
        {title}
      </Text>
      <Text
        selectable
        style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}
      >
        {message}
      </Text>
      <PrimaryButton accessibilityLabel="Retry loading products" onPress={onRetry}>
        Retry
      </PrimaryButton>
    </View>
  );
}
