import axios from "axios";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
} from "react-native";

import { GlobalStyles } from "../styles/global";
import Loading from "./Loading";

export default function Home() {
  const [allProduct, setAllProduct] = useState([]);
  const allProductUrl = "http://192.168.43.137:8000/api/v1/all-products/";

  axios
    .get(allProductUrl)
    .then((res) => {
      setAllProduct(res.data);
    })
    .catch((err) => {
      Alert.alert("Huh", "Something went wrong please try reopening the app");
      console.log(err);
    });
  if (!allProduct.length) {
    return <Loading />;
  } else {
    return (
      // <Loading />
      <View style={GlobalStyles.container}>
        <FlatList
          data={allProduct}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}
