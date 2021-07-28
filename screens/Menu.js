import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { GlobalStyles } from "../styles/global";

export default function Menu({ navigation }) {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Menu</Text>
    </View>
  );
}
