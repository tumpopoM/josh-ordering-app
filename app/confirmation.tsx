import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { DeliveryBadge } from "@/components/delivery-badge";
import { PrimaryButton } from "@/components/primary-button";
import { formatShortDate } from "@/domain/date-utils";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderNumber = "JOSH-000000", deliveryDate = "2026-06-19", status = "Confirmed" } =
    useLocalSearchParams<{
      orderNumber?: string;
      deliveryDate?: string;
      status?: string;
    }>();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        flexGrow: 1,
        gap: spacing.lg,
        justifyContent: "center",
        padding: spacing.lg,
      }}
    >
      <View
        style={{
          gap: spacing.lg,
          borderRadius: 20,
          borderCurve: "continuous",
          padding: spacing.xl,
          backgroundColor: colors.surface,
        }}
      >
        <DeliveryBadge label={status} tone="success" />
        <View style={{ gap: spacing.sm }}>
          <Text selectable style={{ color: colors.text, fontSize: 30, fontWeight: "900", lineHeight: 36 }}>
            Order confirmed
          </Text>
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 24 }}>
            Kitchen purchasing can track this order using the number below.
          </Text>
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, fontWeight: "800" }}>
            ORDER NUMBER
          </Text>
          <Text selectable style={{ color: colors.text, fontSize: typography.sectionTitle, fontWeight: "900" }}>
            {orderNumber}
          </Text>
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, fontWeight: "800" }}>
            DELIVERY DATE
          </Text>
          <Text selectable style={{ color: colors.text, fontSize: typography.sectionTitle, fontWeight: "900" }}>
            {formatShortDate(deliveryDate)}
          </Text>
        </View>

        <PrimaryButton accessibilityLabel="Return to product list" onPress={() => router.replace("/")}>
          Return home
        </PrimaryButton>
      </View>
    </ScrollView>
  );
}
