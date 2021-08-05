import axios from "axios";
import react from "react";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { color, GlobalStyles } from "../styles/global";
import Loading from "./Loading";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../context/processors";

const WIDTH = Dimensions.get("window").width;

export default function ProductDetails({ navigation, route }) {
  const { name, slug, id } = route.params;
  const [productDetail, setProductDetail] = React.useState(null);
  const [quantity, setQuantity] = React.useState("1");

  const { addToCart, getCart } = React.useContext(AuthContext);

  const productUrl = "http://192.168.43.137:8000/api/v1/products" + slug;

  const getProduct = () => {
    axios
      .get(productUrl)
      .then((res) => {
        setProductDetail(res.data);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(
          "Huh",
          "Network issue!! Make sure you have data and restart the app"
        );
      });
  };

  react.useEffect(() => {
    getProduct();
  }, []);

  function handleQuantityChange(val) {
    if (isNaN(val)) {
      setQuantity("1");
    } else if (val > 0) {
      setQuantity(val);
    } else {
      setQuantity("1");
    }
  }

  // function handleAddToCart

  if (!productDetail) {
    return <Loading />;
  } else {
    return (
      <View style={styles.container}>
        <Image source={{ uri: productDetail.get_image }} style={styles.image} />

        <View style={styles.textContainer}>
          <View style={styles.productDetail}>
            <View class={styles.detailArea}>
              <Text style={styles.title}>{productDetail.name}</Text>
              <Text style={styles.price}>₦{productDetail.price}</Text>
            </View>
          </View>
          <View style={styles.addToCartArea}>
            <TextInput
              value={quantity}
              style={styles.quantity}
              onChangeText={(val) => handleQuantityChange(val)}
            />
            <TouchableOpacity
              style={styles.addToCart}
              onPress={() => addToCart(productDetail, quantity)}
            >
              <MaterialIcons
                name="add-shopping-cart"
                size={24}
                color={color.white}
              />
            </TouchableOpacity>
          </View>
          <View
            showsVerticalScrollIndicator={false}
            style={styles.descriptionContainer}
          >
            <Text style={styles.descriptionHeader}>Description</Text>
            <Text style={styles.description}>{productDetail.description}</Text>
          </View>
        </View>
        <StatusBar backgroundColor={color.primary} style="light" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  productDetail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addToCartArea: {
    flexDirection: "row",
    backgroundColor: color.light,
    borderRadius: 100,
    justifyContent: "space-between",
    marginVertical: 5,
  },
  detailArea: {
    width: 50,
    flexWrap: "wrap",
  },
  quantity: {
    width: "70%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: "nunito-bold",
  },
  addToCart: {
    backgroundColor: color.primary,
    padding: 10,
    borderRadius: 100,
  },
  image: {
    alignSelf: "center",
    // borderRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  container: {
    backgroundColor: color.white,
    flex: 1,
  },
  textContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    paddingVertical: 5,
    fontFamily: "nunito-bold",
    color: color.primary,
    // width: "70%",
    flexWrap: "wrap",
  },
  price: {
    fontSize: 16,
    fontFamily: "nunito-bold",
    fontWeight: "500",
  },
  descriptionContainer: {
    // borderWidth: 1,
    marginTop: 15,
  },
  description: {
    fontFamily: "nunito-regular",
    padding: 10,
    backgroundColor: color.white,
    height: 150,
  },
  descriptionHeader: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    fontSize: 16,
    fontFamily: "nunito-bold",
    fontSize: 18,
    backgroundColor: color.light,
    padding: 10,
  },
});
