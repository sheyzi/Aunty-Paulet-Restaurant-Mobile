import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { GlobalStyles } from "../styles/global";

export default function Cart() {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Cart</Text>
    </View>
  );
}
