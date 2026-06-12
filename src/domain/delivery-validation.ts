import { addDays, isBefore } from "@/domain/date-utils";
import type {
  CartItem,
  DeliveryRegion,
  DeliveryRule,
  DeliveryValidationMessage,
  DeliveryValidationResult,
  Product,
  TemperatureType,
} from "@/domain/types";

type ValidateDeliveryInput = {
  cartItems: CartItem[];
  products: Product[];
  deliveryRules: DeliveryRule[];
  selectedDate: string;
  region: DeliveryRegion;
  today: string;
};

export function getEarliestDeliveryDate(product: Product, today: string): string {
  return addDays(today, product.leadTimeDays);
}

export function validateDelivery({
  cartItems,
  products,
  deliveryRules,
  selectedDate,
  region,
  today,
}: ValidateDeliveryInput): DeliveryValidationResult {
  const productById = new Map(products.map((product) => [product.id, product]));
  const selectedProducts = cartItems
    .map((item) => productById.get(item.productId))
    .filter((product): product is Product => Boolean(product));
  const messages: DeliveryValidationMessage[] = [];

  for (const product of selectedProducts) {
    if (!product.isOrderTaking) {
      messages.push({
        code: "order_closed",
        severity: "error",
        title: "Order-taking closed",
        message: `${product.name} is not accepting orders right now.`,
        productId: product.id,
      });
    }

    if (product.stockStatus === "outOfStock") {
      messages.push({
        code: "out_of_stock",
        severity: "error",
        title: "Out of stock",
        message: `${product.name} is currently out of stock.`,
        productId: product.id,
      });
    }

    const earliestDate = getEarliestDeliveryDate(product, today);
    if (isBefore(selectedDate, earliestDate)) {
      messages.push({
        code: "date_unavailable",
        severity: "error",
        title: "Unavailable for selected date",
        message: `${product.name} can be delivered from ${earliestDate}.`,
        productId: product.id,
      });
    }

    if (!hasSupportedRoute(product.temperatureType, region, deliveryRules)) {
      messages.push({
        code: "frozen_route_only",
        severity: "error",
        title: "Frozen route only",
        message: `${product.name} requires a Bangkok frozen route.`,
        productId: product.id,
      });
    }
  }

  const requiresSplitDelivery = hasMixedTemperatureGroups(
    selectedProducts.map((product) => product.temperatureType),
  );

  if (requiresSplitDelivery) {
    messages.push({
      code: "split_delivery_required",
      severity: "warning",
      title: "Split delivery recommended",
      message:
        "Frozen items use a separate cold-chain route from ambient and chilled goods.",
    });
  }

  return {
    canCheckout: messages.every((message) => message.severity !== "error"),
    requiresSplitDelivery,
    messages,
  };
}

function hasSupportedRoute(
  temperatureType: TemperatureType,
  region: DeliveryRegion,
  deliveryRules: DeliveryRule[],
): boolean {
  return deliveryRules.some(
    (rule) =>
      rule.region === region &&
      rule.supportedTemperatureTypes.includes(temperatureType),
  );
}

function hasMixedTemperatureGroups(temperatureTypes: TemperatureType[]): boolean {
  const hasFrozen = temperatureTypes.includes("frozen");
  const hasNonFrozen = temperatureTypes.some((type) => type !== "frozen");

  return hasFrozen && hasNonFrozen;
}
