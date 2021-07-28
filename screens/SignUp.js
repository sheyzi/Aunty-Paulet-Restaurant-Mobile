import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import { GlobalStyles, color } from "../styles/global";
import { Formik } from "formik";
import { AntDesign } from "@expo/vector-icons";
import * as Yup from "yup";
import axios from "axios";

RegisterSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Not a valid email"),
  username: Yup.string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirm_password: Yup.string().test(
    "passwords-match",
    "Passwords must match",
    function (value) {
      return this.parent.password === value;
    }
  ),
});

export default function SignUp({ navigation }) {
  const reg_url = "http://192.168.43.137:8000/auth/users/";
  const email_ref = useRef();
  const password_ref = useRef();
  const confirm_password_ref = useRef();
  const register = ({ email, username, password }) => {
    console.log(
      `Email is ${email}, Username is ${username}, Password is ${password}`
    );
    axios
      .post(reg_url, { email: email, username: username, password: password })
      .then((res) => navigation.push("SignIn"))
      .catch((err) => {
        Alert.alert("Huh!", "Something");
        console.log(err);
      });
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={GlobalStyles.authPageContainer}>
        <View style={GlobalStyles.logoContainer}>
          <Image
            source={require("../assets/adaptive-icon.png")}
            style={GlobalStyles.logo}
          />
        </View>
        <View style={styles.formContainer}>
          <Formik
            validationSchema={RegisterSchema}
            initialValues={
              ({ email: "" },
              { username: "" },
              { password: "" },
              { confirm_password: "" })
            }
            onSubmit={(value) => register(value)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
              values,
            }) => (
              <View>
                {/* Username Field */}
                <View style={GlobalStyles.control}>
                  <AntDesign name="user" size={24} color={color.dark} />

                  <TextInput
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    value={values.username}
                    style={GlobalStyles.input}
                    placeholder="Username"
                    returnKeyType="next"
                    onSubmitEditing={() => email_ref.current.focus()}
                    blurOnSubmit={false}
                  />
                </View>
                {errors.username && touched.username ? (
                  <Text style={GlobalStyles.errorText}>
                    {touched.username && errors.username}
                  </Text>
                ) : null}
                {/* End Username Field */}

                {/* Email Field */}
                <View style={GlobalStyles.control}>
                  <AntDesign name="mail" size={24} color={color.dark} />

                  <TextInput
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    style={GlobalStyles.input}
                    placeholder="Email"
                    returnKeyType="next"
                    ref={email_ref}
                    onSubmitEditing={() => password_ref.current.focus()}
                    blurOnSubmit={false}
                  />
                </View>
                {errors.email && touched.email ? (
                  <Text style={GlobalStyles.errorText}>
                    {touched.email && errors.email}
                  </Text>
                ) : null}
                {/* End Email Field */}

                {/* Password Field */}
                <View style={GlobalStyles.control}>
                  <AntDesign name="key" size={24} color={color.dark} />

                  <TextInput
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    style={GlobalStyles.input}
                    placeholder="Password"
                    returnKeyType="next"
                    secureTextEntry
                    ref={password_ref}
                    onSubmitEditing={() => confirm_password_ref.current.focus()}
                    blurOnSubmit={false}
                  />
                </View>
                {errors.password && touched.password ? (
                  <Text style={GlobalStyles.errorText}>
                    {touched.password && errors.password}
                  </Text>
                ) : null}
                {/* End Password Field */}

                {/* Confirm Password */}
                <View style={GlobalStyles.control}>
                  <AntDesign name="key" size={24} color={color.dark} />
                  <TextInput
                    onChangeText={handleChange("confirm_password")}
                    onBlur={handleBlur("confirm_password")}
                    value={values.confirm_password}
                    style={GlobalStyles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    returnKeyType="go"
                    ref={confirm_password_ref}
                    onSubmitEditing={() => handleSubmit()}
                  />
                </View>
                {errors.confirm_password && touched.confirm_password ? (
                  <Text style={GlobalStyles.errorText}>
                    {touched.confirm_password && errors.confirm_password}
                  </Text>
                ) : null}
                {/* End Confirm Password Field */}

                {/* Button Containers */}
                <View style={GlobalStyles.buttonContainer}>
                  <TouchableOpacity onPress={handleSubmit} color="#616365">
                    <Text style={GlobalStyles.button}>Register</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.push("SignIn")}>
                    <Text
                      style={{
                        padding: 8,
                        textAlign: "center",
                        color: color.dark2,
                      }}
                    >
                      Already have an account??{" "}
                      <Text style={{ color: color.primary }}>Login Here</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* End Button Container */}
              </View>
            )}
          </Formik>
        </View>
        {/* <Text style={GlobalStyles.inputLabel}>Enter Username</Text> */}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 4,
  },
});
