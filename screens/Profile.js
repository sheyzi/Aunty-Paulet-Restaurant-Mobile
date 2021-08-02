import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { color, GlobalStyles } from "../styles/global";
import { AuthContext } from "../context/processors";

export default function Profile({ navigation }) {
  const { SignOut } = React.useContext(AuthContext);

  return (
    <View style={{ marginTop: 10, padding: 24 }}>
      {/* <Text style={GlobalStyles.title}>Menu</Text> */}

      <Button
        title="Sign Out"
        color={color.primary}
        onPress={() => SignOut()}
      />
    </View>
  );
}
