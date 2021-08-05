import { StatusBar } from "expo-status-bar";
import axios from "axios";
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

import { GlobalStyles, color } from "../styles/global";
import Loading from "./Loading";
const WIDTH = Dimensions.get("window").width;

export default function CategoryDetails({ navigation, route }) {
  const { name, slug, id } = route.params;
  const [categoryDetails, setCategoryDetails] = React.useState(null);
  const categoryUrl = "http://192.168.43.137:8000/api/v1/products" + slug;
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
        Alert.alert(
          "Huh",
          "Network issue!! Make sure you have data and restart the app"
        );
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
          data={categoryDetails.products}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View style={GlobalStyles.CardStyle} key={item.id.toString()}>
                <TouchableOpacity
                  onPress={() =>
                    showProduct(item.name, item.get_absolute_url, item.id)
                  }
                >
                  <ImagedCarouselCard
                    width={WIDTH - 50}
                    height={200}
                    shadowColor="#051934"
                    text={item.name + " - ₦" + item.price}
                    source={{
                      uri: item.get_image,
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
