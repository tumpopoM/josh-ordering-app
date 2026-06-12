import type { DeliveryRule } from "@/domain/types";

export const deliveryRules: DeliveryRule[] = [
  {
    id: "bangkok-normal",
    name: "Bangkok Normal Delivery",
    region: "bangkok",
    supportedTemperatureTypes: ["ambient", "chilled"],
    minLeadTimeDays: 1,
    badgeLabel: "Bangkok delivery",
    description: "Daily Bangkok route for ambient and chilled ingredients.",
  },
  {
    id: "upcountry-limited",
    name: "Upcountry Limited Delivery",
    region: "upcountry",
    supportedTemperatureTypes: ["ambient", "chilled"],
    minLeadTimeDays: 3,
    badgeLabel: "Upcountry route",
    description: "Limited regional route with longer lead time.",
  },
  {
    id: "frozen-special",
    name: "Frozen/Ice Cream Special Delivery",
    region: "bangkok",
    supportedTemperatureTypes: ["frozen"],
    minLeadTimeDays: 4,
    badgeLabel: "Frozen route only",
    description: "Special cold-chain route for frozen seafood, meat, and ice cream.",
  },
];
