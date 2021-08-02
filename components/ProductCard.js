import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { color, GlobalStyles } from "../styles/global";

const WIDTH = Dimensions.get("window").width;
export default function ProductCard({ item }) {
  const imageUrl = item.get_image;
  console.log(imageUrl);
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: item.get_image }}
        width={WIDTH / 2 - 25}
        // height={WIDTH / 3}
      />
      <View style="textContainer">
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>₦{item.price}</Text>
      </View>
    </View>
  );
}

const styles = {
  title: {
    fontFamily: "nunito-bold",
    fontSize: 18,
  },
  container: {
    width: WIDTH / 2 - 30,
    height: WIDTH / 2,
    marginHorizontal: 5,
    marginVertical: 10,
    // backgroundColor: color.light,
    borderRadius: 10,
    flex: 1,
  },
  price: {
    fontFamily: "nunito-regular",
  },
  textContainer: {
    position: "absolute",
    bottom: 5,
  },
  image: {
    width: WIDTH / 2 - 25,
    height: WIDTH / 2,
    borderRadius: 10,
  },
};
