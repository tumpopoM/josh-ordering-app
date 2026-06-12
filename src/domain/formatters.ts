import type { TemperatureType } from "@/domain/types";

export function formatCurrency(value: number): string {
  return `฿${value.toLocaleString("en-US")}`;
}

export function formatTemperatureType(type: TemperatureType): string {
  if (type === "ambient") {
    return "Ambient";
  }

  if (type === "chilled") {
    return "Chilled";
  }

  return "Frozen";
}

export function formatProductMeta(
  category: string,
  temperatureType: TemperatureType,
  unit: string,
): string {
  return `${category} - ${formatTemperatureType(temperatureType)} - ${unit}`;
}

export function formatSubtotalLabel(itemCount: number): string {
  return `SUBTOTAL - ${itemCount} ITEMS`;
}
