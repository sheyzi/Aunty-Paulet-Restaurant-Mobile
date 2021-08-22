// Core Imports
import React, { useState } from "react";
import { Alert, Platform, RefreshControl } from "react-native";
import { useFonts } from "expo-font";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Cart from "./screens/Cart";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import axios from "./config/axiosConfig";
import { AuthContext } from "./context/processors";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as Sentry from "sentry-expo";

// Styles Import
import { color } from "./styles/global";
import { MaterialIcons } from "@expo/vector-icons";

// Navigation Imports
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Storage Imports
import * as SecureStore from "expo-secure-store";
import { updateFocus } from "react-navigation-is-focused-hoc";
// Screens Import
import SplashScreen from "./screens/SplashScreen";

const addPushToken = async (token) => {
  await SecureStore.setItemAsync("push-token", token);
};

const savePushToken = async (token, userToken) => {
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  axios
    .get(`/users/add/push-token?token=${token}`, axiosConfig)
    .then((res) => {
      console.log(res.data.token);
      addPushToken(res.data.token);
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export async function registerForPushNotificationsAsync(userToken) {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted" || existingStatus === "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Error", "Failed to get push token Permissions");

      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    addPushToken(token);
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    axios
      .get(`/users/add/push-token?token=${token}`, axiosConfig)
      .then((res) => {
        console.log(res.data.token);
        addPushToken(res.data.token);
      })
      .catch((err) => {
        console.log(err.response);
      });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

Sentry.init({
  dsn: "https://f0c3494cd75546b2a0e58f9d0a7096d6@o969494.ingest.sentry.io/5920683",
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

const AppStack = createBottomTabNavigator();
const AuthStack = createStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
// App Function
export default function App() {
  // States Management
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);
  const [cart, setCart] = React.useState({ items: [] });

  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  let [fontsLoaded] = useFonts({
    "nunito-bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
  });

  async function getCart() {
    let cartHere = await AsyncStorage.getItem("cart");
    if (cartHere) {
      setCart(JSON.parse(cartHere));
    } else {
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      cartHere = cart;
    }
    return cartHere;
  }

  const saveCart = async (cartItem) => {
    setCart(cartItem);
    await AsyncStorage.setItem("cart", JSON.stringify(cartItem));
  };

  const authContext = React.useMemo(() => {
    return {
      SignIn: async ({ username, password }) => {
        setIsLoading(true);
        const login_url = "/users/token";
        const params = `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`;
        const headers = {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        };
        async function setLoginDetails(value) {
          await SecureStore.setItemAsync("userToken", value);
          setUserToken(value);
        }
        async function login(username, password) {
          await axios
            .post(login_url, params, headers)
            .then(async (res) => {
              setLoginDetails(res.data.access_token);
              registerForPushNotificationsAsync(res.data.access_token).then(
                (res) => {
                  console.log(res);
                }
              );

              Toast.show({
                type: "success",
                position: "bottom",
                text1: "Login Successful",
                text2: "We can't wait to start receiving your orders!",
                visibilityTime: 2000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
              });
            })
            .catch((err) => {
              console.log(err);
              Toast.show({
                type: "error",
                position: "bottom",
                text1: "Error",
                text2: err.response.data.detail,
                visibilityTime: 2000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
              });
            });
        }
        login(username, password);
        setIsLoading(false);
      },
      SignUp: ({ email, username, password }) => {
        setIsLoading(true);
        const reg_url = "/users/registration";
        const params = {
          username: username,
          email: email,
          password: password,
        };
        const headers = {
          accept: "application/json",
          "Content-Type": "application/json",
        };
        async function registerUser(email, username, password) {
          await axios
            .post(reg_url, params, headers)
            .then((res) => {
              console.log(res.data);
              Toast.show({
                type: "success",
                position: "bottom",
                text1: "Welcome!!",
                text2: "Your account was created successfully!",
                visibilityTime: 2000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
              });
            })
            .catch((err) => {
              Toast.show({
                type: "error",
                position: "bottom",
                text1: "Error",
                text2: err.response.data.detail,
                visibilityTime: 2000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
              });
              console.log(err);
            });
        }
        registerUser(email, username, password);
        setIsLoading(false);
      },
      SignOut: () => {
        setIsLoading(true);
        async function deleteUserToken() {
          await SecureStore.deleteItemAsync("userToken");
          setUserToken(null);
        }
        deleteUserToken();
        Toast.show({
          type: "info",
          position: "bottom",
          text1: "Logged out successfully",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
        saveCart({ items: [] });
        setCart({ items: [] });
        setIsLoading(false);
      },
      getToken: () => {
        async function getValueAsync() {
          let result = await SecureStore.getItemAsync("userToken");
          return result;
        }
        const userToken = getValueAsync();
      },
      getCart: async () => {
        let cartHere = await AsyncStorage.getItem("cart");
        if (cartHere) {
          setCart(JSON.parse(cartHere));
        } else {
          await AsyncStorage.setItem("cart", JSON.stringify(cart));
          cartHere = cart;
        }
        return cart;
      },
      addToCart: async (item, quantity) => {
        const newItem = {
          quantity: quantity,
          ...item,
        };
        getCart().then((value) => {
          const currentCart = JSON.parse(value);
          let exists = false;
          currentCart.items.forEach((item, index) => {
            if (newItem.id == item.id) {
              exists = true;
              let newQuantity = Number(item.quantity) + Number(quantity);
              item.quantity = newQuantity.toString();
              saveCart(currentCart);
            }
          });

          if (!exists) {
            currentCart.items.push(newItem);
            saveCart(currentCart);
          }

          Toast.show({
            type: "success",
            position: "bottom",
            text1: "Hurray",
            text2: `${newItem.name} was added to cart successfully!`,
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
          });
        });
      },
      incrementCart: async (item_id) => {
        getCart().then((value) => {
          const currentCart = JSON.parse(value);
          let exists = false;
          currentCart.items.forEach((item, index) => {
            if (item_id == item.id) {
              exists = true;
              let newQuantity = Number(item.quantity) + 1;
              item.quantity = newQuantity.toString();
              saveCart(currentCart);
            }
          });
        });
      },
      decrementCart: async (item_id) => {
        getCart().then((value) => {
          const currentCart = JSON.parse(value);
          let exists = false;
          currentCart.items.forEach((item, index) => {
            if (item_id == item.id) {
              exists = true;
              let newQuantity = Number(item.quantity) - 1;
              item.quantity = newQuantity.toString();
              if (newQuantity < 1) {
                currentCart.items = currentCart.items.filter((a) => {
                  return a.id !== item_id;
                });
              }
              saveCart(currentCart);
            }
          });
        });
      },
      removeFromCart: async (item_id) => {
        getCart().then((value) => {
          const currentCart = JSON.parse(value);

          currentCart.items.forEach((item, index) => {
            if (item_id == item.id) {
              currentCart.items = currentCart.items.filter((a) => {
                return a.id !== item_id;
              });

              saveCart(currentCart);
            }
          });
        });
      },
      resetCart: async () => {
        saveCart({ items: [] });
      },
    };
  });
  async function getValueAsync() {
    let result = await SecureStore.getItemAsync("userToken");
    setUserToken(result);
  }

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    getValueAsync();
    getCart();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!fontsLoaded) {
    return <SplashScreen />;
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        <RootSiblingParent>
          <NavigationContainer>
            {userToken ? (
              <AppStack.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Menu") {
                      iconName = "fastfood";
                    } else if (route.name === "Profile") {
                      iconName = "account-circle";
                    } else if (route.name === "Cart") {
                      iconName = "shopping-cart";
                    }

                    // You can return any component that you like here!
                    // return <Ionicons name={iconName} size={size} color={color} />;
                    return (
                      <MaterialIcons
                        name={iconName}
                        size={size}
                        color={color}
                      />
                    );
                  },
                })}
                tabBarOptions={{
                  activeTintColor: color.primary,
                  inactiveTintColor: color.light2,
                }}
              >
                <AppStack.Screen
                  name="Menu"
                  component={Home}
                  options={{ unmountOnBlur: true }}
                />
                <AppStack.Screen
                  name="Cart"
                  component={Cart}
                  options={{
                    tabBarBadge: cart.items.length.toString(),
                    unmountOnBlur: true,
                  }}
                />
                <AppStack.Screen
                  name="Profile"
                  component={Profile}
                  options={{ unmountOnBlur: true }}
                />
              </AppStack.Navigator>
            ) : (
              <AuthStack.Navigator>
                <AuthStack.Screen
                  name="SignIn"
                  component={SignIn}
                  options={{ title: "Sign In", headerShown: false }}
                />
                <AuthStack.Screen
                  name="SignUp"
                  component={SignUp}
                  options={{ title: "Create Account", headerShown: false }}
                />
              </AuthStack.Navigator>
            )}
          </NavigationContainer>
        </RootSiblingParent>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </AuthContext.Provider>
    );
  }
}
