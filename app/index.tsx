import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  type ListRenderItemInfo,
} from "react-native";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { ProductCard } from "@/components/product-card";
import { formatShortDate } from "@/domain/date-utils";
import { getEarliestDeliveryDate } from "@/domain/delivery-validation";
import { today } from "@/domain/delivery-options";
import type { Product, ProductCategory } from "@/domain/types";
import { useCartStore } from "@/features/cart/use-cart-store";
import {
  filterProducts,
  loadProducts,
} from "@/features/products/product-service";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type LoadStatus = "loading" | "ready" | "error";

const categories: Array<ProductCategory | "All"> = [
  "All",
  "Meat",
  "Seafood",
  "Dairy",
  "Bakery",
];

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  useEffect(() => {
    let isMounted = true;

    setStatus("loading");

    loadProducts()
      .then((catalog) => {
        if (!isMounted) {
          return;
        }

        setProducts(catalog);
        setStatus("ready");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(
    () => filterProducts(products, { category, searchText }),
    [category, searchText],
  );

  const reloadProducts = useCallback(() => {
    setStatus("loading");

    loadProducts()
      .then((catalog) => {
        setProducts(catalog);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  const renderProductCard = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => (
      <ProductCard
        product={item}
        earliestDeliveryLabel={`Earliest: ${formatShortDate(
          getEarliestDeliveryDate(item, today),
        )}`}
      />
    ),
    [],
  );

  if (status === "loading") {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.md,
        }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
        <Text
          accessibilityLiveRegion="polite"
          selectable
          style={{ color: colors.textMuted, fontSize: typography.body }}
        >
          Loading ingredient catalog
        </Text>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={{ flex: 1, padding: spacing.lg, justifyContent: "center" }}>
        <ErrorState
          title="Catalog unavailable"
          message="We could not refresh the ingredient catalog. Please retry before taking orders."
          onRetry={reloadProducts}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          gap: spacing.md,
          padding: spacing.lg,
          paddingBottom: spacing.xxl,
        }}
        ListHeaderComponent={
          <View style={{ gap: spacing.md }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              <TextInput
                accessibilityLabel="Search products"
                accessibilityHint="Type to filter the ingredient catalog by ingredient name"
                accessibilityRole="search"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search ingredients"
                placeholderTextColor={colors.textMuted}
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: 14,
                  borderCurve: "continuous",
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: spacing.lg,
                  color: colors.text,
                  backgroundColor: colors.surface,
                  fontSize: typography.body,
                }}
              />
              <Link href="/cart" asChild>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
                  accessibilityHint="Open the current order summary and checkout options"
                  accessibilityState={{ disabled: cartCount === 0 }}
                  style={({ pressed }) => ({
                    minWidth: 58,
                    minHeight: 48,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 14,
                    borderCurve: "continuous",
                    backgroundColor: pressed
                      ? colors.primaryPressed
                      : colors.primary,
                  })}
                >
                  <Text
                    style={{
                      color: colors.surface,
                      fontSize: typography.body,
                      fontWeight: "900",
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {cartCount}
                  </Text>
                </Pressable>
              </Link>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: spacing.sm,
              }}
            >
              {categories.map((item) => (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter products to ${item.toLowerCase()}`}
                  accessibilityHint={`Show ${item.toLowerCase()} ingredients only`}
                  accessibilityState={{ selected: category === item }}
                  onPress={() => setCategory(item)}
                  style={({ pressed }) => ({
                    minHeight: 42,
                    justifyContent: "center",
                    borderRadius: 999,
                    paddingHorizontal: spacing.md,
                    backgroundColor:
                      category === item
                        ? colors.primary
                        : pressed
                          ? colors.border
                          : colors.surface,
                    borderWidth: 1,
                    borderColor:
                      category === item ? colors.primary : colors.border,
                  })}
                >
                  <Text
                    selectable
                    style={{
                      color: category === item ? colors.surface : colors.text,
                      fontSize: typography.caption,
                      fontWeight: "800",
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No ingredients found"
            message="Try another search term or switch to a broader category."
          />
        }
        renderItem={renderProductCard}
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
