import { StatusBar } from "expo-status-bar";
import axios from "../config/axiosConfig";
import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ImagedCarouselCard from "react-native-imaged-carousel-card";

import { GlobalStyles, color } from "../styles/global";
import Loading from "./Loading";
const WIDTH = Dimensions.get("window").width;
import * as Sentry from "sentry-expo";

export default function SearchDetails({ navigation, route }) {
  const { name, query, id } = route.params;
  const [searchProducts, setSearchProducts] = React.useState(null);

  const searchUrl = `/products/search?q=${query}`;

  const showProduct = (name, slug, id) => {
    navigation.navigate("ProductDetails", {
      name: name,
      slug: slug,
      id: id,
    });
  };
  const getSearch = () => {
    axios
      .get(searchUrl)
      .then((res) => {
        console.log(res.data);
        setSearchProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
        Sentry.Native.captureException(err);

        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2:
            "Something went wrong please try reopening the app and check your internet connection",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
      });
  };

  React.useEffect(() => {
    getSearch();
  }, []);

  if (!searchProducts) {
    return <Loading />;
  } else {
    return searchProducts.length ? (
      <View style={GlobalStyles.container}>
        <FlatList
          data={searchProducts}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View style={GlobalStyles.CardStyle} key={item.id.toString()}>
                <TouchableOpacity
                  onPress={() => showProduct(item.name, item.slug, item.id)}
                >
                  <ImagedCarouselCard
                    width={WIDTH - 50}
                    height={200}
                    shadowColor="#051934"
                    text={item.name + " - ₦" + item.price}
                    source={{
                      uri: item.image_url,
                    }}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <StatusBar backgroundColor={color.primary} style="light" />
      </View>
    ) : (
      <View style={GlobalStyles.container}>
        <Text style={GlobalStyles.title}>No result found for {query}</Text>
        <StatusBar backgroundColor={color.primary} style="light" />
      </View>
    );
  }
}
