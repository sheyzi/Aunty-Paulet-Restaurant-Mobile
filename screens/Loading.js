import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { color, GlobalStyles } from "../styles/global";

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
