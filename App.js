// Core Imports
import React, { useState } from "react";
import { Alert } from "react-native";
import { useFonts } from "expo-font";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Cart from "./screens/Cart";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import axios from "axios";
import { AuthContext } from "./context/processors";

// Styles Import
import { color } from "./styles/global";
import { MaterialIcons } from "@expo/vector-icons";

// Navigation Imports
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Storage Imports
import * as SecureStore from "expo-secure-store";

// Screens Import
import SplashScreen from "./screens/SplashScreen";

const AppStack = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// App Function
export default function App() {
  // States Management
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);
  let [fontsLoaded] = useFonts({
    "nunito-bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
  });

  const authContext = React.useMemo(() => {
    return {
      SignIn: ({ username, password }) => {
        setIsLoading(true);
        const login_url = "http://192.168.43.137:8000/auth/token/login/";
        async function setLoginDetails(value) {
          await SecureStore.setItemAsync("userToken", value);
          setUserToken(value);
        }
        async function login(username, password) {
          await axios
            .post(login_url, { username: username, password: password })
            .then((res) => {
              setLoginDetails(res.data.auth_token);
            })
            .catch((err) => {
              console.log(err);
              Alert.alert("Sorry!!", "Invalid Username or Password");
            });
        }
        login(username, password);
        setIsLoading(false);
      },
      SignUp: ({ email, username, password }) => {
        setIsLoading(true);
        const reg_url = "http://192.168.43.137:8000/auth/users/";

        async function registerUser(email, username, password) {
          await axios
            .post(reg_url, {
              email: email,
              username: username,
              password: password,
            })
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              Alert.alert(
                "Huh!",
                "Something went wrong please try again later and make sure you read the helper text to have a successful signup"
              );
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
        console.log("Logged out successful");
        setIsLoading(false);
      },
      getToken: () => {
        async function getValueAsync() {
          let result = await SecureStore.getItemAsync("userToken");
          return result;
        }
        const userToken = getValueAsync();
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
    }, 1000);
    getValueAsync();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!fontsLoaded) {
    return <SplashScreen />;
  } else {
    return (
      <AuthContext.Provider value={authContext}>
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
                    <MaterialIcons name={iconName} size={size} color={color} />
                  );
                },
              })}
              tabBarOptions={{
                activeTintColor: color.primary,
                inactiveTintColor: color.light2,
              }}
            >
              <AppStack.Screen name="Menu" component={Home} />
              <AppStack.Screen name="Cart" component={Cart} />
              <AppStack.Screen name="Profile" component={Profile} />
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
      </AuthContext.Provider>
    );
  }
}
