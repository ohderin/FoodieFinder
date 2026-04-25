import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SAMPLE_RESTAURANT } from "../src/data/sampleRestaurant";
import { FF } from "../src/theme/colors";

const ITEMS = [
  {
    badge: "🔥 Most Popular",
    name: "Box Combo",
    desc: "4 Chicken Fingers, 1 Cane's Sauce, Crinkle Cut Fries, Texas Toast, 22oz Drink",
    price: "$11.49",
  },
  {
    name: "3 Finger Combo",
    desc: "3 Chicken Fingers, 1 Cane's Sauce, Crinkle Cut Fries, Texas Toast, 22oz Drink",
    price: "$9.59",
  },
  {
    name: "Caniac Combo",
    desc: "6 Chicken Fingers, 2 Cane's Sauces, Crinkle Cut Fries, Coleslaw, Texas Toast, Large Drink",
    price: "$15.99",
  },
  {
    name: "Sandwich Combo",
    desc: "Chicken Finger Sandwich, Crinkle Cut Fries, 22oz Drink",
    price: "$10.79",
  },
  {
    name: "Kids Combo",
    desc: "2 Chicken Fingers, 1 Cane's Sauce, Crinkle Cut Fries, Kids Drink",
    price: "$6.49",
  },
];

const TAILGATES =[
  {
    badge: "🔥 Most Popular",
    name: "25-finger Tailgate",
    desc: "25 Chicken Fingers, 8 Cane's Sauces",
    price:"$41.99",

  },
  {
    name: "50-finger Tailgate",
    desc: "50 Chicken Fingers, 16 Cane's Sauces or 22 oz. cup",
    price:"$79.99",
  },
  {
    name: "75-finger Tailgate",
    desc: "75 Chicken Fingers, 25 Cane's Sauces or 32 oz. cup",
    price:"$118.99",

  },
  {
    name: "100-finger Tailgate",
    desc: "100 Chicken Fingers, 33 Cane's Sauces or (2) 22 oz. cups",
    price:"$142.99",

  },
  {
    name: "200-finger Tailgate",
    desc: "200 Chicken Fingers, 66 Cane's Sauces or (4) 22 oz cups",
    price:"$281.98",

  },
  {
    name: "300-finger Tailgate",
    desc: "300 Chicken Fingers, 99 Cane's Sauces or (6) 22 oz. cups",
    price:"$420.97",
  },
  {
    name: "Crinkle-Cut Fries",
    desc: "Crinkle-cut and perfectly salted",
    price:"$2.49",

  },
  {
    name: "Cane's Sauce",
    desc: "Secret recipe, made in-restaurant everyday",
    price:"$0.39",

  },
  {
    name: "Texas Toast",
    desc: "Golden brown and garlic buttery",
    price:"$1.38",

  },
  {
    name: "Coleslaw",
    desc: "Crisp, creamy and freshly prepared",
    price:"$1.38",

  },
];

const EXTRAS =[
  {
  
    name: "Chicken Finer",
    desc: "All you need is 1",
    price:"$1.99",

  },
  
  {
    name: "Crinkle-Cut Fries",
    desc: "Crinkle-cut and perfectly salted",
    price:"$2.49",

  },
  {
    badge:"Best-Seller",
    name: "Cane's Sauce",
    desc: "Secret recipe, made in-restaurant everyday",
    price:"$0.39",

  },
  {
    name: "Texas Toast",
    desc: "Golden brown and garlic buttery",
    price:"$1.38",

  },
  {
    name: "Coleslaw",
    desc: "Crisp, creamy and freshly prepared",
    price:"$1.38",
  },
   {
    name: "Sandwhich",
    desc: "3 Chicken Fingers, Cane's Sauces and lettuce on a toasted bun",
    price:"$7.69",
  },
];

const DRINKS =[
  {
    badge:"Fan-Favorite",
    name: "Lemonade",
    desc: "Regular",
    price:"$2.69",

  },
  {
    name: "Sweet Tea",
    desc: "Regular",
    price:"$2.49",
  },
  {
    name: "Fountain Drink",
    desc: "Your choice of Assorted Coke products, Regular size.",
    price:"$2.49",

  },
  {
    name: "Bottled Water",
    desc: "High Quality H20",
    price:"$2.49",

  },
  {
    name: "Jug Lemonade",
    desc: "A Gallon of classic Lemonade",
    price:"$10.89",

  },
  {
    name: "JUG of Sweet Tea",
    desc: "As good as your Grandma's",
    price:"$5.99",
  },

];

const KIDS =[
  {
    badge: "🔥 Popular",
    name: "The Kids Combo",
    desc: "2 Chicken Fingers, 1 Cane's Sauce, Crinkle-Cut Fries and a Drink",
    price:"$6.69",

  },
];

const CATS = ["Combos", "TailGates", "Extras", "Drinks", "Kids"];

export default function MenuScreen() {
  const [cat, setCat] = useState("Combos");

  //new fuction for switch case that retrieves items based on category
  const getItems = (category: any) => {
    switch(category) {
      case "Combos":
        return ITEMS;
      case "TailGates":
        return TAILGATES;
      case "Extras":
        return EXTRAS;
      case "Drinks":
        return DRINKS;
      case "Kids":
        return KIDS;
      default:
        return ITEMS;
    }
  };

  const currentItems = getItems(cat);

  return (
      <View style={{ flex: 1, backgroundColor: FF.cream }}>
        <LinearGradient
          colors={["#8B1E2A", "#C62A38"]}
          style={styles.banner}
        >
          <Text style={styles.bannerName}>{SAMPLE_RESTAURANT.name}</Text>
          <Text style={styles.bannerMeta}>
            🟢 Open Now · {SAMPLE_RESTAURANT.closingNote} ·{" "}
            {SAMPLE_RESTAURANT.distanceMiles.toFixed(1)} mi
          </Text>
        </LinearGradient>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCat(c)}
              style={[styles.cat, cat === c && styles.catOn]}
            >
              <Text style={[styles.catText, cat === c && styles.catTextOn]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {currentItems.map((item, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.thumb}>
                <Text style={{ fontSize: 22 }}>🍗</Text>
              </View>
              <View style={{ flex: 1 }}>
                {item.badge ? (
                  <Text style={styles.badge}>{item.badge}</Text>
                ) : null}
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 20 },
  bannerName: { color: "#fff", fontSize: 22, fontWeight: "900" },
  bannerMeta: { color: "rgba(255,255,255,0.9)", marginTop: 6, fontSize: 13 },
  catRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexDirection: "row" },
  cat: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  catOn: { backgroundColor: FF.red },
  catText: { fontWeight: "900", color: FF.dark },
  catTextOn: { color: "#fff" },
  item: {
    flexDirection: "row",
    gap: 12,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: FF.border,
    marginBottom: 6,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: FF.red,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: { fontSize: 11, fontWeight: "800", color: FF.orange, marginBottom: 4 },
  itemName: { fontSize: 17, fontWeight: "900", color: FF.dark },
  itemDesc: { fontSize: 12, color: FF.med, marginTop: 4, lineHeight: 16 },
  price: { fontSize: 17, fontWeight: "900", color: FF.red, marginTop: 6 },
});
