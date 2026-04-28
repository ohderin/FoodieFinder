import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useApp } from "../context/AppContext";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function FFPrimaryButton({ title, onPress, style }: Props) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.primary,
        { backgroundColor: colors.red },
        pressed && styles.primaryPressed,
        style,
      ]}
    >
      <Text style={styles.primaryText}>{title}</Text>
    </Pressable>
  );
}

export function FFOutlineButton({ title, onPress, style }: Props) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.outline,
        { borderColor: colors.red },
        pressed && [styles.outlinePressed, { backgroundColor: colors.redLight }],
        style,
      ]}
    >
      <Text style={[styles.outlineText, { color: colors.red }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: "#e63946",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    marginHorizontal: 32,
  },
  primaryPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  primaryText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  outline: {
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    marginHorizontal: 32,
  },
  outlinePressed: {},
  outlineText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
