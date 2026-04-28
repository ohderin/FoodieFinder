import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SAMPLE_RESTAURANT } from "../src/data/sampleRestaurant";
import { useApp } from "../src/context/AppContext";

const REVIEWS = [
  { initials: "JD", name: "John Doe", stars: "⭐⭐⭐⭐⭐", text: "I wanna get married here. The sauce hits different every single time." },
  { initials: "BJ", name: "Billy John", stars: "⭐⭐⭐⭐", text: "Best fried chicken hands down. Crinkle fries are always perfectly crispy." },
  { initials: "BC", name: "Brittney Clare", stars: "⭐⭐", text: "Mid. The hype is too much. It's decent but I don't understand why everyone loses their mind over it." },
];

const BAR = [0.6, 0.22, 0.1, 0.05, 0.03];

export default function ReviewsScreen() {
  const r = SAMPLE_RESTAURANT;
  const { colors } = useApp();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.cream }} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.summary}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.bigNum}>{r.rating.toFixed(1)}</Text>
            <Text>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.reviewCount}>{r.reviewCount} reviews</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            {[5, 4, 3, 2, 1].map((star, idx) => (
              <View key={star} style={styles.barRow}>
                <Text style={styles.barLbl}>{star}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${BAR[idx] * 100}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
        {REVIEWS.map((rev, i) => (
          <View key={i} style={styles.review}>
            <View style={styles.revHead}>
              <View style={styles.revAvatar}>
                <Text style={styles.revAvText}>{rev.initials}</Text>
              </View>
              <View>
                <Text style={styles.revName}>{rev.name}</Text>
                <Text style={styles.revMeta}>
                  {rev.stars} · 2 days ago
                </Text>
              </View>
            </View>
            <Text style={styles.revBody}>{rev.text}</Text>
          </View>
        ))}
      </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useApp>["colors"]) => StyleSheet.create({
  summary: {
    flexDirection: "row",
    backgroundColor: colors.cream2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bigNum: { fontSize: 44, fontWeight: "900", color: colors.dark },
  reviewCount: { fontSize: 12, color: colors.med, marginTop: 4 },
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 8 },
  barLbl: { width: 14, fontSize: 11, color: colors.med },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: colors.golden },
  review: {
    backgroundColor: colors.cream2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  revHead: { flexDirection: "row", gap: 10, marginBottom: 8 },
  revAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.redLight,
    alignItems: "center",
    justifyContent: "center",
  },
  revAvText: { fontWeight: "900", color: colors.redDark, fontSize: 12 },
  revName: { fontWeight: "700", fontSize: 15, color: colors.dark },
  revMeta: { fontSize: 12, color: colors.med },
  revBody: { fontSize: 15, color: colors.med, lineHeight: 22 },
});
