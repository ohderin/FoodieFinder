import React from "react";
import { StyleSheet, Text, View, FlatList, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../src/context/AppContext";
import { FF } from "../../src/theme/colors";

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { hearted, removeHeart } = useApp();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Saved Places</Text>

      <FlatList
        data={hearted}
        keyExtractor={(item) => item.id}
        // This only runs for each item if the array is NOT empty
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.itemImage} 
              resizeMode="cover" 
            />
            <View style={styles.infoContainer}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
      
                <Text style={styles.itemSub}>{item.distanceMiles.toFixed(1)} miles away</Text>

                <Text style={[styles.statusText, { color: item.isOpen ? "#088968" : FF.red }]}>
                  {item.isOpen ? `Open · ${item.closingNote}` : "Closed"}
                </Text>
            </View>
            <View style={{ flex: 1 }}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDesc}>{item.shortDescription}</Text>
            </View>
            <Pressable 
              onPress={() => removeHeart(item.id)} 
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={FF.red} />
            </Pressable>
          </View>
        )}
        // This only displays if the array IS empty
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.icon}>🐾</Text>
            <Text style={styles.emptyTitle}>Nothing saved yet!</Text>
            <Text style={styles.emptyDesc}>
              Tap the heart on any restaurant card to save it here for later.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: FF.cream, paddingHorizontal: 20 },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: FF.dark,
    marginBottom: 24,
    textAlign: "center",
  },
  itemRow: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E7E1D8", // Or your FF.border color
    // Optional shadow for a "card" look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  removeButton: {
  padding: 8,
  marginLeft: 10,
  justifyContent: "center",
  alignItems: "center",
},
itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#F0F0F0", // Placeholder color while loading
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  itemName: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: FF.dark 
  },
  itemSub: {
    fontSize: 13,
    color: FF.med,
    marginTop: 2,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  itemDesc: { 
    fontSize: 14, 
    color: "#7A7A7A", // Or your FF.med color
    marginTop: 4
  },
  empty: { alignItems: "center", marginTop: 48 },
  icon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 22, fontWeight: "900", color: FF.dark, marginBottom: 8 },
  emptyDesc: {
    fontSize: 17,
    color: FF.med,
    textAlign: "center",
    lineHeight: 22,
  },
});
