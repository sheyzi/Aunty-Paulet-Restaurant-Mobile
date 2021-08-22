import React from "react";
import { ActivityIndicator, Image, View, StyleSheet } from "react-native";
import { color, GlobalStyles } from "../styles/global";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={GlobalStyles.logoContainer}>
        <Image
          style={GlobalStyles.logo}
          source={require("../assets/adaptive-icon.png")}
        />
      </View>
      <ActivityIndicator size="large" color={color.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    padding: 10,
  },
});
