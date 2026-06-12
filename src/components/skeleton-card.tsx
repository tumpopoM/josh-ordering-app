import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function SkeletonCard() {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={{
        gap: spacing.md,
        borderRadius: 16,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        backgroundColor: colors.surface,
        opacity: pulse,
      }}
    >
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 14,
            backgroundColor: colors.surfaceMuted,
          }}
        />
        <View style={{ flex: 1, gap: spacing.sm }}>
          <View
            style={{
              height: 18,
              borderRadius: 999,
              backgroundColor: colors.surfaceMuted,
            }}
          />
          <View
            style={{
              width: "60%",
              height: 12,
              borderRadius: 999,
              backgroundColor: colors.surfaceMuted,
            }}
          />
          <View
            style={{
              width: "45%",
              height: 12,
              borderRadius: 999,
              backgroundColor: colors.surfaceMuted,
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <View
          style={{
            width: 96,
            height: 28,
            borderRadius: 999,
            backgroundColor: colors.surfaceMuted,
          }}
        />
        <View
          style={{
            width: 88,
            height: 28,
            borderRadius: 999,
            backgroundColor: colors.surfaceMuted,
          }}
        />
      </View>
    </Animated.View>
  );
}
