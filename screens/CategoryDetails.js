import { StatusBar } from "expo-status-bar";
import axios from "../config/axiosConfig";
import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ImagedCarouselCard from "react-native-imaged-carousel-card";
import * as Sentry from "sentry-expo";

import { GlobalStyles, color } from "../styles/global";
import Loading from "./Loading";
const WIDTH = Dimensions.get("window").width;

export default function CategoryDetails({ navigation, route }) {
  const { name, slug, id } = route.params;
  const [categoryDetails, setCategoryDetails] = React.useState(null);

  const categoryUrl = `/categories/${slug}/products`;

  const showProduct = (name, slug, id) => {
    navigation.navigate("ProductDetails", {
      name: name,
      slug: slug,
      id: id,
    });
  };
  const getCategory = () => {
    axios
      .get(categoryUrl)
      .then((res) => {
        console.log(res.data);
        setCategoryDetails(res.data);
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
    getCategory();
  }, []);

  if (!categoryDetails) {
    return <Loading />;
  } else {
    return (
      <View style={GlobalStyles.container}>
        <FlatList
          data={categoryDetails}
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
    );
  }
}
