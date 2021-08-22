import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Button,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../context/processors";
import { color, GlobalStyles } from "../styles/global";
import { Formik } from "formik";
import * as Yup from "yup";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import axios from "../config/axiosConfig";
import * as Sentry from "sentry-expo";

const AddressSchema = Yup.object({
  name: Yup.string()
    .min(4, "Cannot be less than 4 characters")
    .required("Name is required"),
  phone: Yup.string()
    .required("Phone number is required!")
    .min(10, "Phone number can not be less than 10 characters")
    .max(11, "Phone number can not be greater than 11 characters"),
  streetAddress: Yup.string().required("Address is required"),
});
export default function Checkout({ navigation, route, params }) {
  const { getCart, resetCart } = React.useContext(AuthContext);
  const [userToken, setUserToken] = React.useState(null);
  const [cart, setCart] = React.useState({ items: [] });
  const [userDetails, setUserDetails] = React.useState({});
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
      });
  };

  async function getValueAsync() {
    let result = await SecureStore.getItemAsync("userToken");
    setUserToken(result);
    getUserData(result);
  }

  React.useEffect(() => {
    getCart().then((value) => setCart(value));
    getValueAsync();
  }, []);

  const totalCartPrice = () => {
    let sum = 0;
    cart.items.forEach((item, index) => {
      const itemTotalPrice = Number(item.price) * Number(item.quantity);
      sum += itemTotalPrice;
    });
    sum = sum + 300;
    return sum;
  };

  const checkOut = async ({ name, phone, streetAddress, city, state }) => {
    console.log(city);
    let order_details = {
      receiver_name: name,
      receiver_phone_number: phone,
      receiver_street_address: streetAddress,
      receiver_city: city,
      receiver_state: state,

      amount: totalCartPrice(),
    };
    let order_items = [];
    cart.items.forEach((item, index) => {
      var newItem = {
        product_id: item.id,
        price: item.price,
        quantity: item.quantity.toString(),
      };
      order_items.push(newItem);
    });

    let data = {
      order_details: order_details,
      order_items: order_items,
    };

    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    };

    await axios
      .post("/order", data, axiosConfig)
      .then((res) => {
        resetCart();
        navigation.navigate("Menu");
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Order Successful",
          text2: "Your food would be delivered as soon as possible",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
      })
      .catch((err) => {
        if (
          err.response.data.detail ==
          "Insufficient balance!! Please fund your account to complete your order!!"
        ) {
          navigation.navigate("Profile");
        }

        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error",
          text2: "err.response",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });

        console.log(err.response);
        Sentry.Native.captureException(err);
      });
  };

  const phoneRef = React.useRef();
  const streetRef = React.useRef();
  const cityRef = React.useRef();
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Fill in your details and pay to complete your order
      </Text>
      <Formik
        validationSchema={AddressSchema}
        initialValues={
          ({ name: "" },
          { phone: "" },
          { streetAddress: "" },
          { city: "Ikorodu" },
          { state: "Lagos" })
        }
        onSubmit={(value) => checkOut(value)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
          values,
        }) => (
          <View style={styles.formContainer}>
            <View style={styles.control}>
              <AntDesign
                name="user"
                size={30}
                style={styles.formIcon}
                color={color.primary}
              />
              <TextInput
                placeholder="Enter Receiver's name"
                autoCapitalize="words"
                autoCompleteType="name"
                blurOnSubmit={false}
                returnKeyType="next"
                importantForAutofill="auto"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                onSubmitEditing={() => phoneRef.current.focus()}
                style={styles.input}
              />
            </View>
            {errors.name && touched.name ? (
              <Text style={GlobalStyles.errorText}>
                {touched.name && errors.name}
              </Text>
            ) : null}
            <View style={styles.control}>
              <AntDesign
                name="phone"
                size={30}
                style={styles.formIcon}
                color={color.primary}
              />
              <TextInput
                placeholder="Enter Receiver's phone number"
                autoCompleteType="tel"
                blurOnSubmit={false}
                returnKeyType="next"
                importantForAutofill="auto"
                keyboardType="numeric"
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                onSubmitEditing={() => streetRef.current.focus()}
                value={values.phone}
                style={styles.input}
                ref={phoneRef}
              />
            </View>
            {errors.phone && touched.phone ? (
              <Text style={GlobalStyles.errorText}>
                {touched.phone && errors.phone}
              </Text>
            ) : null}
            <View style={styles.control}>
              <FontAwesome5
                name="address-book"
                size={30}
                style={styles.formIcon}
                color={color.primary}
              />
              <TextInput
                placeholder="Enter Street Address"
                blurOnSubmit={false}
                returnKeyType="go"
                importantForAutofill="auto"
                value={values.streetAddress}
                style={styles.input}
                ref={streetRef}
                onChangeText={handleChange("streetAddress")}
                onSubmitEditing={handleSubmit}
                onBlur={handleBlur("streetAddress")}
              />
            </View>
            {errors.streetAddress && touched.streetAddress ? (
              <Text style={GlobalStyles.errorText}>
                {touched.streetAddress && errors.streetAddress}
              </Text>
            ) : null}
            <View style={styles.control}>
              <FontAwesome5
                name="city"
                size={30}
                style={styles.formIcon}
                color={color.primary}
              />
              <TextInput
                onBlur={handleBlur("city")}
                blurOnSubmit={false}
                ref={cityRef}
                value="Ikorodu"
                style={styles.input}
                editable={false}
              />
            </View>
            {errors.city && touched.city ? (
              <Text style={GlobalStyles.errorText}>
                {touched.city && errors.city}
              </Text>
            ) : null}
            <View style={styles.control}>
              <FontAwesome5
                name="city"
                size={30}
                style={styles.formIcon}
                color={color.primary}
              />
              <TextInput
                value="Lagos"
                editable={false}
                blurOnSubmit={true}
                returnKeyType="go"
                style={styles.input}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Text style={styles.title}>
                Account Balance: ₦{userDetails.balance}
              </Text>
              {userDetails.balance > totalCartPrice() ? (
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={GlobalStyles.buttonContainer}
                >
                  <Text style={GlobalStyles.button}>
                    Proceed to Pay ₦{totalCartPrice()}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={GlobalStyles.buttonContainer}>
                  <Text style={GlobalStyles.button}>Fund Account</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  formIcon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginVertical: 15,
  },
  control: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: color.light,
    margin: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  input: {
    margin: 5,
    padding: 5,
    fontSize: 16,
    fontFamily: "nunito-regular",
    width: WIDTH - 100,
  },
  container: {
    padding: 5,
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "nunito-bold",
    textAlign: "center",
    color: color.primary,
  },
});
