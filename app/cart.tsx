import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { DeliveryBadge } from "@/components/delivery-badge";
import { EmptyState } from "@/components/empty-state";
import { PrimaryButton } from "@/components/primary-button";
import { QuantityStepper } from "@/components/quantity-stepper";
import { deliveryRules } from "@/data/delivery-rules";
import { products } from "@/data/products";
import { calculateCartTotals } from "@/domain/cart-calculation";
import { validateDelivery } from "@/domain/delivery-validation";
import {
  defaultDeliveryDate,
  deliveryDateOptions,
  today,
} from "@/domain/delivery-options";
import { formatCurrency, formatSubtotalLabel } from "@/domain/formatters";
import { getCartLines } from "@/features/cart/cart-selectors";
import { useCartStore } from "@/features/cart/use-cart-store";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function CartScreen() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const selectedDeliveryDate =
    useCartStore((state) => state.selectedDeliveryDate) ?? defaultDeliveryDate;
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setSelectedDeliveryDate = useCartStore(
    (state) => state.setSelectedDeliveryDate,
  );
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
        <EmptyState
          title="Cart is empty"
          message="Add ingredients from the catalog before checkout."
        />
        <PrimaryButton
          accessibilityLabel="Return to product catalog"
          onPress={() => router.push("/")}
        >
          Browse products
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
      <View style={{ gap: spacing.md }}>
        {lines.map((line) => (
          <View
            key={line.product.id}
            style={{
              gap: spacing.md,
              borderRadius: 16,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.lg,
              backgroundColor: colors.surface,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 1, gap: spacing.xs, minWidth: 0 }}>
                <Text
                  selectable
                  numberOfLines={2}
                  style={{
                    color: colors.text,
                    fontSize: typography.body,
                    fontWeight: "900",
                    flexShrink: 1,
                  }}
                >
                  {line.product.name}
                </Text>
                <Text
                  selectable
                  style={{
                    color: colors.textMuted,
                    fontSize: typography.caption,
                  }}
                >
                  {formatCurrency(line.product.price)} / {line.product.unit}
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
              <View style={{ alignItems: "flex-end" }}>
                <QuantityStepper
                  quantity={line.quantity}
                  onDecrease={() =>
                    updateQuantity(line.product.id, line.quantity - 1)
                  }
                  onIncrease={() =>
                    updateQuantity(line.product.id, line.quantity + 1)
                  }
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ gap: spacing.sm }}>
        <Text
          selectable
          style={{
            color: colors.text,
            fontSize: typography.sectionTitle,
            fontWeight: "900",
          }}
        >
          Delivery date
        </Text>
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}
        >
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}
          >
            {deliveryDateOptions.map((option) => (
              <DeliveryDateButton
                key={option.value}
                label={option.label}
                selected={selectedDeliveryDate === option.value}
                onPress={() => setSelectedDeliveryDate(option.value)}
              />
            ))}
          </View>
        </View>
      </View>

      <View accessibilityLiveRegion="polite">
        <ValidationMessages messages={validation.messages} />
      </View>

      <View
        style={{
          gap: spacing.sm,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: spacing.lg,
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
          {formatSubtotalLabel(totals.itemCount)}
        </Text>
        <Text
          selectable
          style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}
        >
          {formatCurrency(totals.subtotal)}
        </Text>
      </View>

      <PrimaryButton
        accessibilityLabel="Review checkout"
        disabled={!validation.canCheckout}
        onPress={() => router.push("/checkout")}
      >
        Review checkout
      </PrimaryButton>
    </ScrollView>
  );
}

type DeliveryDateButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function DeliveryDateButton({
  label,
  selected,
  onPress,
}: DeliveryDateButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Select ${label}`}
      accessibilityHint="Choose this delivery date for your order"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        justifyContent: "center",
        borderRadius: 14,
        borderCurve: "continuous",
        paddingHorizontal: spacing.md,
        backgroundColor: selected ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        opacity: pressed ? 0.72 : 1,
      })}
    >
      <Text
        selectable
        style={{
          color: selected ? colors.surface : colors.text,
          fontSize: typography.body,
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type ValidationMessagesProps = {
  messages: ReturnType<typeof validateDelivery>["messages"];
};

function ValidationMessages({ messages }: ValidationMessagesProps) {
  if (messages.length === 0) {
    return <DeliveryBadge label="Delivery validated" tone="success" />;
  }

  return (
    <View style={{ gap: spacing.sm }}>
      {messages.map((message, index) => (
        <View
          key={`${message.code}-${message.productId ?? "cart"}-${index}`}
          style={{
            gap: spacing.xs,
            borderRadius: 14,
            borderCurve: "continuous",
            padding: spacing.md,
            backgroundColor:
              message.severity === "error"
                ? colors.dangerSoft
                : colors.warningSoft,
          }}
        >
          <Text
            selectable
            style={{
              color:
                message.severity === "error" ? colors.danger : colors.warning,
              fontSize: typography.body,
              fontWeight: "900",
            }}
          >
            {message.title}
          </Text>
          <Text
            selectable
            style={{
              color: colors.text,
              fontSize: typography.caption,
              lineHeight: 19,
            }}
          >
            {message.message}
          </Text>
        </View>
      ))}
    </View>
  );
}
