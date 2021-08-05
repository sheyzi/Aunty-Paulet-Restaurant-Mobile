import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Button,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../context/processors";
import { color, GlobalStyles } from "../styles/global";
import { Formik } from "formik";
import * as Yup from "yup";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const AddressSchema = Yup.object({
  name: Yup.string()
    .min(4, "Cannot be less than 4 characters")
    .required("Name is required"),
  phone: Yup.string()
    .required("Phone number is required!")
    .min(10, "Phone number can not be less than 10 characters")
    .max(11, "Phone number can not be greater than 11 characters"),
  streetAddress: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
});
export default function Checkout() {
  const { getCart } = React.useContext(AuthContext);

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
          { city: "" },
          { state: "Lagos" })
        }
        onSubmit={(value) => console.log(value)}
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
                returnKeyType="next"
                importantForAutofill="auto"
                value={values.streetAddress}
                style={styles.input}
                ref={streetRef}
                onChangeText={handleChange("streetAddress")}
                onSubmitEditing={() => city.current.focus()}
                onBlur={handleBlur("streetAddress")}
                multiline={true}
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
                placeholder="Enter City"
                onChangeText={handleChange("city")}
                onBlur={handleBlur("city")}
                blurOnSubmit={false}
                returnKeyType="go"
                onSubmitEditing={() => handleSubmit()}
                importantForAutofill="auto"
                ref={cityRef}
                value={values.city}
                style={styles.input}
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
              <Button
                color={color.primary}
                onPress={handleSubmit}
                title="Proceed to payment"
              />
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
