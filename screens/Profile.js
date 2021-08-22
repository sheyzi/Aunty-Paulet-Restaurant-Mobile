import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { color, GlobalStyles } from "../styles/global";
import { AuthContext } from "../context/processors";
import * as SecureStore from "expo-secure-store";
import axios from "../config/axiosConfig";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import Loading from "./Loading";
import * as Sentry from "sentry-expo";

function ProfilePage({ navigation }) {
  const { SignOut } = React.useContext(AuthContext);
  const [userToken, setUserToken] = React.useState(null);
  const [userDetails, setUserDetails] = React.useState({});
  const [userOrders, setUserOrders] = React.useState([]);

  const getUserData = (token) => {
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get("/users/me", axiosConfig)
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error",
          text2: err.response.data.detail,
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
        Sentry.Native.captureException(err);
      });
  };
  const getUserOrders = (token) => {
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get("/users/orders", axiosConfig)
      .then((res) => {
        setUserOrders(res.data);
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error",
          text2: err.response.data.detail,
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
        Sentry.Native.captureException(err);
      });
  };
  async function getValueAsync() {
    let result = await SecureStore.getItemAsync("userToken");
    setUserToken(result);
    getUserData(result);
    getUserOrders(result);
  }
  React.useEffect(() => {
    getValueAsync();
  }, []);

  return (
    <SafeAreaView
      style={{
        marginTop: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 24,
        flex: 1,
      }}
    >
      <LinearGradient
        colors={[color.primary, color.primary, color.white]}
        style={styles.detailView}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 1, y: 0.5 }}
      >
        <Text style={styles.title}>Hello, {userDetails.username}!</Text>
        <Text style={styles.subtitle}>
          Account Balance: ₦{userDetails.balance}
        </Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          navigation.navigate("Fund");
        }}
      >
        <Text style={styles.button}>Fund Account</Text>
      </TouchableOpacity>
      {userOrders.length ? (
        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={GlobalStyles.title}>
            You have made{" "}
            <Text style={{ color: color.primary }}>{userOrders.length}</Text>{" "}
            orders!!
          </Text>
          <FlatList
            data={userOrders}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const itemDate = item.created_at;
              var jsDate = new Date(itemDate);
              jsDate = jsDate.toLocaleDateString();

              return (
                <View style={styles.card}>
                  <View>
                    <Text style={styles.mainSubtitle}>
                      Receiver Name: {item.receiver_name}{" "}
                    </Text>
                    <Text style={styles.mainSubtitle}>
                      Order Date: {jsDate}
                    </Text>
                    <Text style={styles.mainSubtitle}>
                      Total Amount: ₦{item.amount}{" "}
                      <Text style={{ color: color.primary }}>
                        (shipping included)
                      </Text>
                    </Text>

                    <Text style={styles.mainSubtitle}>
                      Receiver Phone Number: {item.receiver_phone_number}{" "}
                    </Text>
                    <Text style={styles.mainSubtitle}>
                      Receiver Address: {item.receiver_street_address}{" "}
                    </Text>
                    <Text style={styles.mainSubtitle}>
                      Receiver State: {item.receiver_state}{" "}
                    </Text>
                    <Text style={styles.mainSubtitle}>
                      Receiver City: {item.receiver_city}{" "}
                    </Text>
                    <Text style={styles.mainSubtitle}>
                      Order Status:{" "}
                      <Text style={{ color: color.primary }}>
                        {" "}
                        {item.status}{" "}
                      </Text>{" "}
                    </Text>

                    <Text style={styles.mainSubtitle}>Ordered Items: </Text>
                    {item.items.map((order_item) => {
                      return (
                        <View
                          style={styles.cartCardDetails}
                          key={order_item.id.toString()}
                        >
                          <Image
                            source={{ uri: order_item.product.image_url }}
                            style={styles.cartImage}
                          />
                          <View>
                            <Text style={styles.mainSubtitle}>
                              {order_item.product.name}
                            </Text>
                            <View>
                              <Text style={styles.cartCardText}>
                                Qty: {order_item.quantity}
                              </Text>
                              <Text style={styles.cartCardText}>
                                Price: {order_item.price}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            }}
          />
        </View>
      ) : (
        <Text style={GlobalStyles.title}>You have no orders yet!</Text>
      )}

      <TouchableOpacity
        style={GlobalStyles.buttonContainer}
        onPress={() => SignOut()}
      >
        <Text style={GlobalStyles.button}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 15,
    color: color.white,
    fontFamily: "nunito-regular",
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    marginVertical: 15,
    padding: 5,
    elevation: 6,
    backgroundColor: color.white,
    borderRadius: 3,
    flex: 1,
  },
  cartImage: {
    height: 50,
    width: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  cartCardDetails: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 6,
    backgroundColor: color.white,
    borderRadius: 3,
  },
  mainSubtitle: {
    fontSize: 15,
    fontFamily: "nunito-bold",
  },
  cartCardText: {
    fontFamily: "nunito-regular",
  },
  title: {
    fontSize: 24,
    color: color.white,
    fontFamily: "nunito-bold",
  },
  detailView: {
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: color.primary,
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    textAlign: "center",
    backgroundColor: color.primary,
    color: color.light,
    fontSize: 18,
    borderRadius: 5,
    padding: 10,
    fontFamily: "nunito-bold",
  },
});

import { createStackNavigator } from "@react-navigation/stack";
const StackNav = createStackNavigator();
import Fund from "./Fund";

export default function Profile() {
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
        name="Profile"
        component={ProfilePage}
        options={{ headerShown: false }}
      />
      <StackNav.Screen
        name="Fund"
        component={Fund}
        options={{ title: "Fund your account" }}
      />
    </StackNav.Navigator>
  );
}
