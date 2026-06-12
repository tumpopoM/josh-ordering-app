import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { DeliveryBadge } from "@/components/delivery-badge";
import { EmptyState } from "@/components/empty-state";
import { PrimaryButton } from "@/components/primary-button";
import { deliveryRules } from "@/data/delivery-rules";
import { products } from "@/data/products";
import { calculateCartTotals } from "@/domain/cart-calculation";
import { formatShortDate } from "@/domain/date-utils";
import { validateDelivery } from "@/domain/delivery-validation";
import { defaultDeliveryDate, today } from "@/domain/delivery-options";
import { formatCurrency } from "@/domain/formatters";
import { getCartLines } from "@/features/cart/cart-selectors";
import { useCartStore } from "@/features/cart/use-cart-store";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function CheckoutReviewScreen() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const selectedDeliveryDate =
    useCartStore((state) => state.selectedDeliveryDate) ?? defaultDeliveryDate;
  const clearCart = useCartStore((state) => state.clearCart);
  const lines = getCartLines(items, products);
  const totals = calculateCartTotals(items, products);
  const validation = validateDelivery({
    cartItems: items,
    products,
    deliveryRules,
    selectedDate: selectedDeliveryDate,
    region: "bangkok",
    today,
  });

  if (items.length === 0) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: spacing.lg }}
      >
        <EmptyState title="Nothing to review" message="Your cart is empty." />
        <PrimaryButton
          accessibilityLabel="Return home"
          onPress={() => router.replace("/")}
        >
          Return home
        </PrimaryButton>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        gap: spacing.lg,
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
      }}
    >
      <View
        style={{
          gap: spacing.sm,
          borderRadius: 16,
          borderCurve: "continuous",
          padding: spacing.lg,
          backgroundColor: colors.surface,
        }}
      >
        <Text
          selectable
          style={{
            color: colors.textMuted,
            fontSize: typography.caption,
            fontWeight: "800",
          }}
        >
          SELECTED DELIVERY DATE
        </Text>
        <Text
          selectable
          style={{
            color: colors.text,
            fontSize: typography.sectionTitle,
            fontWeight: "900",
          }}
        >
          {formatShortDate(selectedDeliveryDate)}
        </Text>
        <DeliveryBadge
          label={
            validation.canCheckout ? "Ready to confirm" : "Needs attention"
          }
          tone={validation.canCheckout ? "success" : "danger"}
        />
      </View>

      {validation.requiresSplitDelivery ? (
        <View
          style={{
            gap: spacing.xs,
            borderRadius: 16,
            borderCurve: "continuous",
            padding: spacing.lg,
            backgroundColor: colors.warningSoft,
          }}
        >
          <Text
            selectable
            style={{
              color: colors.warning,
              fontSize: typography.body,
              fontWeight: "900",
            }}
          >
            Split delivery warning
          </Text>
          <Text
            selectable
            style={{
              color: colors.text,
              fontSize: typography.body,
              lineHeight: 23,
            }}
          >
            Frozen items will be routed on a separate cold-chain delivery from
            ambient and chilled goods. This split-delivery warning helps kitchen
            staff plan for multiple drop-offs on the same order.
          </Text>
        </View>
      ) : null}

      <View style={{ gap: spacing.md }}>
        <Text
          selectable
          style={{
            color: colors.text,
            fontSize: typography.sectionTitle,
            fontWeight: "900",
          }}
        >
          Order summary
        </Text>
        {lines.map((line) => (
          <View
            key={line.product.id}
            style={{
              flexDirection: "row",
              gap: spacing.md,
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              paddingBottom: spacing.sm,
            }}
          >
            <Text
              selectable
              style={{
                flex: 1,
                color: colors.text,
                fontSize: typography.body,
                lineHeight: 22,
              }}
            >
              {line.quantity} x {line.product.name}
            </Text>
            <Text
              selectable
              style={{
                color: colors.text,
                fontSize: typography.body,
                fontWeight: "800",
              }}
            >
              {formatCurrency(line.lineTotal)}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ gap: spacing.xs }}>
        <Text
          selectable
          style={{
            color: colors.textMuted,
            fontSize: typography.caption,
            fontWeight: "800",
          }}
        >
          SUBTOTAL
        </Text>
        <Text
          selectable
          style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}
        >
          {formatCurrency(totals.subtotal)}
        </Text>
      </View>

      <PrimaryButton
        accessibilityLabel="Confirm order"
        disabled={!validation.canCheckout}
        onPress={() => {
          const orderNumber = `JOSH-${Date.now().toString().slice(-6)}`;
          clearCart();
          router.replace({
            pathname: "/confirmation",
            params: {
              orderNumber,
              deliveryDate: selectedDeliveryDate,
              status: "Confirmed",
            },
          });
        }}
      >
        Confirm order
      </PrimaryButton>
    </ScrollView>
  );
}
