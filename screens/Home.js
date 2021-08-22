import { StatusBar } from "expo-status-bar";
import axios from "../config/axiosConfig";
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
  SafeAreaView,
  RefreshControl,
} from "react-native";
import Header from "../components/Header";
import ImagedCarouselCard from "react-native-imaged-carousel-card";
import { color, GlobalStyles } from "../styles/global";
import Loading from "./Loading";
import { ScrollView } from "react-native-gesture-handler";
import ProductDetails from "./ProductDetails";
import { createStackNavigator } from "@react-navigation/stack";
import CategoryDetails from "./CategoryDetails";
import SearchDetails from "./SearchDetails";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

const StackNav = createStackNavigator();
import * as Sentry from "sentry-expo";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const WIDTH = Dimensions.get("window").width;

function HomePage({ navigation }) {
  const [allProduct, setAllProduct] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [shouldHide, setShouldHide] = React.useState(false);
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  const allProductUrl = "/products";
  const featuredProductUrl = "/products/featured";
  const CategoryListUrl = "/categories";

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
  const showSearch = (query) => {
    navigation.navigate("SearchDetails", {
      query: query,
    });
  };

  const getAllProduct = () => {
    axios
      .get(allProductUrl)
      .then((res) => {
        setAllProduct(res.data);
      })
      .catch((err) => {
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
        console.log(err);
        Sentry.Native.captureException(err);
      });
  };

  const getFeaturedProduct = () => {
    axios
      .get(featuredProductUrl)
      .then((res) => {
        setFeaturedProduct(res.data);
      })
      .catch((err) => {
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
        console.log(err);
        Sentry.Native.captureException(err);
      });
  };

  const getCategoryList = () => {
    axios
      .get(CategoryListUrl)
      .then((res) => {
        setCategoryList(res.data);
      })
      .catch((err) => {
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
        console.log(err);
        Sentry.Native.captureException(err);
      });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log("refreshing");
    getAllProduct();
    getFeaturedProduct();
    getCategoryList();
  }, []);

  useEffect(() => {
    getAllProduct();
    getFeaturedProduct();
    getCategoryList();
    setShouldHide(false);

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        let body =
          response.notification.request.trigger.remoteMessage.data.body;

        body = JSON.parse(body);

        if (body.screen) {
          let screenName = body.screen;
          if (body.screen_params) {
            let params = body.screen_params;
            navigation.navigate(screenName, params);

            return;
          }
          navigation.navigate(screenName);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      setShouldHide(true);
    };
  }, []);
  if (!allProduct.length && !categoryList.length) {
    return <Loading />;
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header searchFunction={showSearch} />
        {/* <Text style={GlobalStyles.title}>Home Screen</Text> */}
        <ScrollView
          style={GlobalStyles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                console.log("Working");
              }}
            />
          }
        >
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
                      onPress={() => showProduct(item.name, item.slug, item.id)}
                    >
                      <ImagedCarouselCard
                        width={130}
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
                        showCategory(item.name, item.slug, item.id)
                      }
                    >
                      <ImagedCarouselCard
                        width={130}
                        height={200}
                        shadowColor="#051934"
                        text={item.name}
                        source={{
                          uri: item.image_url,
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
            })}
          </ScrollView>
          {/* End Recommended Product */}
        </ScrollView>
        <StatusBar backgroundColor={color.primary} style="light" />
      </SafeAreaView>
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
        options={{ unmountOnBlur: true, headerShown: false }}
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
      <StackNav.Screen
        name="SearchDetails"
        component={SearchDetails}
        options={({ route }) => ({ title: `Result for ${route.params.query}` })}
      />
    </StackNav.Navigator>
  );
}

const styles = StyleSheet.create({});
