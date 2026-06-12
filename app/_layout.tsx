import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
        }}
      >
        <Stack.Screen name="index" options={{ title: "JOSH Ordering" }} />
        <Stack.Screen name="product/[id]" options={{ title: "Product detail" }} />
        <Stack.Screen name="cart" options={{ title: "Cart" }} />
        <Stack.Screen name="checkout" options={{ title: "Checkout review" }} />
        <Stack.Screen
          name="confirmation"
          options={{ title: "Order confirmed", headerBackVisible: false }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
