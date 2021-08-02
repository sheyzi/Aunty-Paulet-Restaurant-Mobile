import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
} from "react-native";
import { color, GlobalStyles } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";

export default function Header() {
  const [query, setQuery] = React.useState("");
  const [searchText, setSearchText] = React.useState("");

  const handleSubmit = () => {
    setQuery(searchText);
    setSearchText("");
    console.log("Submitted");
    console.log(query);
  };

  return (
    <View style={styles.container}>
      <View style={styles.control}>
        <MaterialIcons name="search" size={24} color={color.primary} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          returnKeyType="go"
          value={searchText}
          onChangeText={(val) => {
            setSearchText(val);
          }}
          onSubmitEditing={() => {
            handleSubmit();
          }}
          multiline={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: color.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  control: {
    backgroundColor: color.white,
    borderRadius: 3,
    paddingHorizontal: 5,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 5,
  },
  input: {
    flex: 1,
    backgroundColor: color.white,
    color: color.primary,
    padding: 10,
    fontSize: 18,
    fontFamily: "nunito-regular",
    borderRadius: 3,
    height: 50,
  },
});
