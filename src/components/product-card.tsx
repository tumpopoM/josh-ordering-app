import { Link } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { DeliveryBadge } from "@/components/delivery-badge";
import { formatCurrency, formatProductMeta } from "@/domain/formatters";
import type { Product } from "@/domain/types";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type ProductCardProps = {
  product: Product;
  earliestDeliveryLabel: string;
};

export const ProductCard = memo(function ProductCard({
  product,
  earliestDeliveryLabel,
}: ProductCardProps) {
  const isUnavailable =
    !product.isOrderTaking || product.stockStatus === "outOfStock";

  return (
    <Link href={`/product/${product.id}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${product.name} details`}
        accessibilityHint={`View price, delivery timing, and add ${product.name} to your cart`}
        style={({ pressed }) => ({
          gap: spacing.md,
          borderRadius: 16,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.lg,
          backgroundColor: pressed ? colors.surfaceMuted : colors.surface,
        })}
      >
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              borderCurve: "continuous",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primarySoft,
            }}
          >
            <Text
              style={{ fontSize: 28, fontWeight: "900", color: colors.primary }}
            >
              {product.category.slice(0, 1)}
            </Text>
          </View>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text
              selectable
              numberOfLines={2}
              style={{
                color: colors.text,
                fontSize: 17,
                fontWeight: "800",
                lineHeight: 22,
              }}
            >
              {product.name}
            </Text>
            <Text
              selectable
              style={{ color: colors.textMuted, fontSize: typography.caption }}
            >
              {formatProductMeta(
                product.category,
                product.temperatureType,
                product.unit,
              )}
            </Text>
            <Text
              selectable
              style={{
                color: colors.text,
                fontSize: typography.body,
                fontWeight: "800",
              }}
            >
              {formatCurrency(product.price)} / {product.unit}
            </Text>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}
        >
          <DeliveryBadge label={earliestDeliveryLabel} tone="info" />
          <DeliveryBadge
            label={isUnavailable ? "Unavailable" : "Order-taking"}
            tone={isUnavailable ? "danger" : "success"}
          />
          {product.temperatureType === "frozen" ? (
            <DeliveryBadge label="Frozen route only" tone="warning" />
          ) : null}
        </View>
      </Pressable>
    </Link>
  );
});
