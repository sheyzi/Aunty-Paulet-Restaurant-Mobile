// Core Imports
import React, { useState } from "react";
import { Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

// Styles Import
import { color } from "./styles/global";
import { MaterialIcons } from "@expo/vector-icons";

// Navigation Imports
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Storage Imports
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens Import
import Home from "./screens/Home";
import Menu from "./screens/Menu";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import SplashScreen from "./screens/SplashScreen";
import Cart from "./screens/Cart";

// Initialize Navigators
const AuthStack = createStackNavigator();
const AppStack = createBottomTabNavigator();

// App Function
export default function App() {
  // States Management
  let [fontsLoaded] = useFonts({
    "nunito-bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
  });
  const [signedIn, setSignedIn] = useState(false);

  // Custom Functions
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        // value previously stored
        console.log(value);
        setSignedIn(true);
      }
    } catch (e) {
      // error reading value
      Alert.alert("Huh!", "Something went wrong");
      console.log(e);
    }
  };

  getToken();

  if (!fontsLoaded) {
    return <SplashScreen />;
  } else {
    return signedIn ? (
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Menu") {
                iconName = "menu";
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
          <AppStack.Screen name="Home" component={Home} />
          <AppStack.Screen name="Cart" component={Cart} />
          <AppStack.Screen name="Menu" component={Menu} />
        </AppStack.Navigator>
        <StatusBar style="dark" backgroundColor={color.white} />
      </NavigationContainer>
    ) : (
      <NavigationContainer>
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
        <StatusBar style="dark" backgroundColor={color.white} />
      </NavigationContainer>
    );
  }
}
