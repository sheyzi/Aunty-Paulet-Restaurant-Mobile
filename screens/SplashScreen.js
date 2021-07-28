import React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { color, GlobalStyles } from "../styles/global";

export default function SplashScreen() {
  return (
    <View style={GlobalStyles.container}>
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
