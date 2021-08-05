import React from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/processors";
import { color, GlobalStyles } from "../styles/global";
import { createStackNavigator } from "@react-navigation/stack";
import Checkout from "./Checkout";
import { FlatList } from "react-native-gesture-handler";
const CartNav = createStackNavigator();
import Loading from "./Loading";
import { AntDesign } from "@expo/vector-icons";

function CartPage({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [cart, setCart] = React.useState({ items: [] });
  const { getCart, incrementCart, decrementCart, removeFromCart } =
    React.useContext(AuthContext);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    getCart().then((value) => setCart(value));
  }, []);

  const handleDecrementButton = async (item_id) => {
    decrementCart(item_id);
    const currentCart = cart;

    currentCart.items.forEach((item, index) => {
      if (item_id == item.id) {
        let newQuantity = Number(item.quantity) - 1;
        item.quantity = newQuantity.toString();
        if (newQuantity < 1) {
          currentCart.items = currentCart.items.filter((a) => {
            return a.id !== item_id;
          });
        }
        setCart(currentCart);
      }
    });
  };

  const handleRemoveFromCart = async (item_id) => {
    removeFromCart(item_id);
    const currentCart = cart;

    currentCart.items.forEach((item, index) => {
      if (item_id == item.id) {
        console.log("Should be removed");
        currentCart.items = currentCart.items.filter((a) => {
          return a.id !== item_id;
        });

        setCart(currentCart);
      }
    });
  };

  const handleIncrementButton = async (item_id) => {
    incrementCart(item_id);
    const currentCart = cart;
    currentCart.items.forEach((item, index) => {
      if (item_id == item.id) {
        let newQuantity = Number(item.quantity) + 1;
        item.quantity = newQuantity.toString();
        setCart(currentCart);
      }
    });
  };

  const totalCartPrice = () => {
    let sum = 0;
    cart.items.forEach((item, index) => {
      const itemTotalPrice = Number(item.price) * Number(item.quantity);
      sum += itemTotalPrice;
    });
    return sum;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1 }}>
      {cart.items.length ? (
        <View style={styles.container}>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={cart.items}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              return (
                <View style={styles.cartCard}>
                  <View style={styles.cartCardDetails}>
                    <Image
                      source={{ uri: item.get_image }}
                      style={styles.cartImage}
                    />
                    <View style={styles.cardProductDetailsContainer}>
                      <Text style={styles.cartItemTitle}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>₦{item.price}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        handleIncrementButton(item.id);
                      }}
                    >
                      <AntDesign
                        name="plussquare"
                        size={24}
                        color={color.primary}
                      />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => handleDecrementButton(item.id)}
                    >
                      <AntDesign
                        name="minussquare"
                        size={24}
                        color={color.primary}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      handleRemoveFromCart(item.id);
                    }}
                  >
                    <Text style={styles.removeButtonText}>
                      Remove from cart
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <View style={styles.bottomContainer}>
            <Text style={styles.title}>Total Price: ₦{totalCartPrice()}</Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => {
                navigation.navigate("Checkout");
              }}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
          <StatusBar backgroundColor={color.primary} style="light" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.noTitle}>No item in the Cart</Text>
          <StatusBar backgroundColor={color.primary} style="light" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  quantity: {
    marginHorizontal: 5,
  },
  bottomContainer: {
    margin: 10,
  },
  checkoutButton: {
    margin: 10,
    alignSelf: "center",
    backgroundColor: color.primary,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: color.white,
    fontFamily: "nunito-bold",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "nunito-bold",
  },
  noTitle: {
    fontSize: 24,
    fontFamily: "nunito-bold",
    textAlign: "center",
  },
  removeButton: {
    borderBottomLeftRadius: 5,
    padding: 5,
    backgroundColor: color.primary,
    borderBottomRightRadius: 5,
    marginTop: 5,
  },
  removeButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "nunito-bold",
    color: color.white,
  },
  container: {
    // marginTop: StatusBar.currentHeight,
    backgroundColor: "#fff",
    padding: 5,
    flex: 1,
  },
  cartCard: {
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: color.white,
    borderRadius: 5,
  },
  cartCardDetails: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  cardProductDetailsContainer: {
    width: 150,
  },
  cartImage: {
    height: 50,
    width: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  cartItemTitle: {
    color: color.primary,
    fontFamily: "nunito-bold",
    fontSize: 16,
  },
  cartItemPrice: {
    fontFamily: "nunito-regular",
  },
});

export default function Cart() {
  // const { getCart } = React.useContext(AuthContext);

  return (
    <CartNav.Navigator
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
      <CartNav.Screen
        name="Cart"
        component={CartPage}
        // options={{ headerStyle: {false} }}
      />
      <CartNav.Screen name="Checkout" component={Checkout} />
    </CartNav.Navigator>
  );
}
