import { StatusBar } from "expo-status-bar";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import ImagedCarouselCard from "react-native-imaged-carousel-card";
import { color, GlobalStyles } from "../styles/global";
import Loading from "./Loading";
import { ScrollView } from "react-native-gesture-handler";
import ProductDetails from "./ProductDetails";
import { createStackNavigator } from "@react-navigation/stack";
import CategoryDetails from "./CategoryDetails";

const StackNav = createStackNavigator();

const WIDTH = Dimensions.get("window").width;

function HomePage({ navigation }) {
  const [allProduct, setAllProduct] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const allProductUrl = "http://192.168.43.137:8000/api/v1/all-products/";
  const featuredProductUrl =
    "http://192.168.43.137:8000/api/v1/featured-products/";
  const CategoryListUrl = "http://192.168.43.137:8000/api/v1/category-list/";

  const showProduct = (name, slug, id) => {
    navigation.navigate("ProductDetails", {
      name: name,
      slug: slug,
      id: id,
    });
  };

  const showCategory = (name, slug, id) => {
    navigation.navigate("CategoryDetails", {
      name: name,
      slug: slug,
      id: id,
    });
  };

  const getAllProduct = () => {
    axios
      .get(allProductUrl)
      .then((res) => {
        setAllProduct(res.data);
      })
      .catch((err) => {
        Alert.alert("Huh", "Something went wrong please try reopening the app");
        console.log(err);
      });
  };

  const getFeaturedProduct = () => {
    axios
      .get(featuredProductUrl)
      .then((res) => {
        setFeaturedProduct(res.data);
      })
      .catch((err) => {
        Alert.alert("Huh", "Something went wrong please try reopening the app");
        console.log(err);
      });
  };

  const getCategoryList = () => {
    axios
      .get(CategoryListUrl)
      .then((res) => {
        setCategoryList(res.data);
      })
      .catch((err) => {
        Alert.alert("Huh", "Something went wrong please try reopening the app");
        console.log(err);
      });
  };

  useEffect(() => {
    getAllProduct();
    getFeaturedProduct();
    getCategoryList();
  }, []);
  if (!allProduct.length && !featuredProduct.length && !categoryList.length) {
    return <Loading />;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        {/* <Text style={GlobalStyles.title}>Home Screen</Text> */}
        <ScrollView style={GlobalStyles.container}>
          {/* Featured Product */}
          <View>
            <Text style={GlobalStyles.title}>Featured Product</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              data={featuredProduct}
              renderItem={({ item }) => {
                return (
                  <View style={GlobalStyles.CardStyle}>
                    <TouchableOpacity
                      onPress={() =>
                        showProduct(item.name, item.get_absolute_url, item.id)
                      }
                    >
                      <ImagedCarouselCard
                        width={130}
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
          </View>
          {/* End Featured Product */}

          {/* Category List */}
          <View>
            <Text style={GlobalStyles.title}>Categories</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              data={categoryList}
              renderItem={({ item }) => {
                return (
                  <View style={GlobalStyles.CardStyle}>
                    <TouchableOpacity
                      onPress={() =>
                        showCategory(item.name, item.get_absolute_url, item.id)
                      }
                    >
                      <ImagedCarouselCard
                        width={130}
                        height={200}
                        shadowColor="#051934"
                        text={item.name}
                        source={{
                          uri: item.get_image,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
          {/* End Category List */}

          {/* Recommended Product */}
          <ScrollView style={GlobalStyles.container}>
            <Text style={GlobalStyles.title}>Recommended</Text>

            {allProduct.map((item) => {
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
            })}
          </ScrollView>
          {/* End Recommended Product */}
        </ScrollView>
        <StatusBar backgroundColor={color.primary} style="light" />
      </View>
    );
  }
}

export default function Home() {
  return (
    <StackNav.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: color.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "nunito-bold",
        },
      }}
    >
      <StackNav.Screen
        name="Home"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <StackNav.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({ route }) => ({
          title: route.params.name,
        })}
      />
      <StackNav.Screen
        name="CategoryDetails"
        component={CategoryDetails}
        options={({ route }) => ({ title: route.params.name })}
      />
    </StackNav.Navigator>
  );
}

const styles = StyleSheet.create({});
