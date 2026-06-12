export type ProductCategory = "Meat" | "Seafood" | "Dairy" | "Bakery";

export type TemperatureType = "ambient" | "chilled" | "frozen";

export type StockStatus = "inStock" | "lowStock" | "outOfStock";

export type DeliveryRegion = "bangkok" | "upcountry";

export type ValidationSeverity = "info" | "warning" | "error";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  temperatureType: TemperatureType;
  isOrderTaking: boolean;
  leadTimeDays: number;
  stockStatus: StockStatus;
  imageUrl?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type DeliveryRule = {
  id: string;
  name: string;
  region: DeliveryRegion;
  supportedTemperatureTypes: TemperatureType[];
  minLeadTimeDays: number;
  badgeLabel: string;
  description: string;
};

export type DeliveryValidationCode =
  | "date_unavailable"
  | "frozen_route_only"
  | "order_closed"
  | "out_of_stock"
  | "split_delivery_required";

export type DeliveryValidationMessage = {
  code: DeliveryValidationCode;
  severity: ValidationSeverity;
  title: string;
  message: string;
  productId?: string;
};

export type DeliveryValidationResult = {
  canCheckout: boolean;
  requiresSplitDelivery: boolean;
  messages: DeliveryValidationMessage[];
};

export type CartTotals = {
  itemCount: number;
  subtotal: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  deliveryDate: string;
  subtotal: number;
  status: "confirmed";
  validationMessages: DeliveryValidationMessage[];
};
