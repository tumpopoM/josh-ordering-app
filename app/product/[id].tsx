import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { DeliveryBadge } from "@/components/delivery-badge";
import { EmptyState } from "@/components/empty-state";
import { PrimaryButton } from "@/components/primary-button";
import { products } from "@/data/products";
import { formatCurrency, formatTemperatureType } from "@/domain/formatters";
import { formatShortDate } from "@/domain/date-utils";
import { getEarliestDeliveryDate } from "@/domain/delivery-validation";
import { today } from "@/domain/delivery-options";
import { useCartStore } from "@/features/cart/use-cart-store";
import { getProductById } from "@/features/products/product-service";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const product = getProductById(products, id);

  if (!product) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: spacing.lg }}>
        <EmptyState title="Product not found" message="This ingredient is no longer in the catalog." />
      </ScrollView>
    );
  }

  const isUnavailable = !product.isOrderTaking || product.stockStatus === "outOfStock";
  const earliestDeliveryDate = getEarliestDeliveryDate(product, today);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.xxl }}
    >
      <View
        style={{
          minHeight: 180,
          borderRadius: 20,
          borderCurve: "continuous",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primarySoft,
        }}
      >
        <Text style={{ color: colors.primary, fontSize: 64, fontWeight: "900" }}>
          {product.category.slice(0, 1)}
        </Text>
      </View>

      <View style={{ gap: spacing.sm }}>
        <Text selectable style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>
          {product.name}
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 23 }}>
          {product.category} · {formatTemperatureType(product.temperatureType)} · {product.unit}
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        <DeliveryBadge label={`Earliest: ${formatShortDate(earliestDeliveryDate)}`} tone="info" />
        <DeliveryBadge
          label={isUnavailable ? "Unavailable for order" : "Order-taking"}
          tone={isUnavailable ? "danger" : "success"}
        />
        {product.temperatureType === "frozen" ? (
          <DeliveryBadge label="Frozen route only" tone="warning" />
        ) : null}
      </View>

      <View
        style={{
          gap: spacing.md,
          borderRadius: 16,
          borderCurve: "continuous",
          padding: spacing.lg,
          backgroundColor: colors.surface,
        }}
      >
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, fontWeight: "800" }}>
          PRICE
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>
          {formatCurrency(product.price)} / {product.unit}
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 23 }}>
          Lead time is {product.leadTimeDays} day{product.leadTimeDays > 1 ? "s" : ""}. Stock status is{" "}
          {product.stockStatus}.
        </Text>
      </View>

      <PrimaryButton
        accessibilityLabel={`Add ${product.name} to cart`}
        disabled={isUnavailable}
        onPress={() => {
          addItem(product.id);
          router.push("/cart");
        }}
      >
        {isUnavailable ? "Unavailable for selected date" : "Add to cart"}
      </PrimaryButton>
    </ScrollView>
  );
}
