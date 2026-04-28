import * as Linking from "expo-linking";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { Restaurant } from "../data/sampleRestaurant";
import { useApp } from "../context/AppContext";

type Props = {
  visible: boolean;
  restaurant: Restaurant;
  onClose: () => void;
};

export function DirectionsSheet({ visible, restaurant, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  const openAppleMaps = () => {
    const q = encodeURIComponent(restaurant.address);
    Linking.openURL(`maps://?daddr=${q}`);
    onClose();
  };

  const openGoogleMaps = () => {
    const q = encodeURIComponent(restaurant.address);
    Linking.openURL(`comgooglemaps://?daddr=${q}`).catch(() => {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${q}`);
    });
    onClose();
  };

  const openWaze = () => {
    const q = encodeURIComponent(restaurant.address);
    Linking.openURL(`waze://?navigate=yes&q=${q}`).catch(() => {});
    onClose();
  };

  const copyAddress = async () => {
    await Clipboard.setStringAsync(restaurant.address);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: colors.cream2 }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, { color: colors.dark }]}>Get Directions</Text>
          <Text style={[styles.sub, { color: colors.med }]}>
            {restaurant.name} · {restaurant.address} · {restaurant.distanceMiles.toFixed(1)} mi
          </Text>
          <ScrollView style={styles.list}>
            <Row
              icon="🗺️"
              title="Apple Maps"
              subtitle="Open in Maps"
              onPress={openAppleMaps}
              colors={colors}
            />
            <Row
              icon="🗺️"
              title="Google Maps"
              subtitle="Open in Google Maps"
              onPress={openGoogleMaps}
              colors={colors}
            />
            <Row icon="🧭" title="Waze" subtitle="Open in Waze" onPress={openWaze} colors={colors} />
            <Row
              icon="📋"
              title="Copy Address"
              subtitle={restaurant.address}
              onPress={copyAddress}
              colors={colors}
            />
          </ScrollView>
          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={[styles.cancelText, { color: colors.red }]}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Row({
  icon,
  title,
  subtitle,
  onPress,
  colors,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  colors: ReturnType<typeof useApp>["colors"];
}) {
  return (
    <Pressable style={[styles.row, { borderBottomColor: colors.border }]} onPress={onPress}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: colors.dark }]}>{title}</Text>
        <Text style={[styles.rowSub, { color: colors.med }]}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(26,18,8,0.48)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    maxHeight: "70%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  sub: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
  },
  list: { maxHeight: 320 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  rowIcon: { fontSize: 22, marginRight: 12 },
  rowTitle: { fontSize: 16, fontWeight: "600" },
  rowSub: { fontSize: 13 },
  cancel: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: { fontSize: 16, fontWeight: "600" },
});
