import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from "react-native";
import { color, GlobalStyles } from "../styles/global";
import { Formik } from "formik";
import { AntDesign } from "@expo/vector-icons";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LoginSchema = Yup.object({
  username: Yup.string().required("Username cannot be empty"),
  password: Yup.string().required("Password is required"),
});

export default function SignIn({ navigation }) {
  const login_url = "http://192.168.43.137:8000/auth/token/login/";
  const password_ref = useRef();
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("token", value);
    } catch (e) {
      // saving error
      Alert.alert("Huh", "Something went wrong please try again!");
    }
  };
  const login = ({ username, password }) => {
    console.log(`Username is ${username}, Password is ${password}`);
    axios
      .post(login_url, { username: username, password: password })
      .then((res) => {
        console.log(res.data.auth_token);
        storeData(res.data.auth_token);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Sorry!!", "Invalid Username or Password");
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
            validationSchema={LoginSchema}
            initialValues={({ username: "" }, { password: "" })}
            onSubmit={(value) => login(value)}
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
                    returnKeyType="next"
                    placeholder="Username"
                    onSubmitEditing={() => password_ref.current.focus()}
                    blurOnSubmit={false}
                  />
                </View>
                {errors.username && touched.username ? (
                  <Text style={GlobalStyles.errorText}>
                    {touched.username && errors.username}
                  </Text>
                ) : null}
                {/* End Username Field */}

                {/* Password Field */}
                <View style={GlobalStyles.control}>
                  <AntDesign name="key" size={24} color={color.dark} />
                  <TextInput
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    style={GlobalStyles.input}
                    returnKeyType="go"
                    placeholder="Password"
                    ref={password_ref}
                    onSubmitEditing={() => handleSubmit()}
                    secureTextEntry
                  />
                </View>
                {errors.password && touched.password ? (
                  <Text style={GlobalStyles.errorText}>
                    {touched.password && errors.password}
                  </Text>
                ) : null}
                {/* End Password Field */}

                {/* Button Container */}
                <View style={GlobalStyles.buttonContainer}>
                  <TouchableOpacity onPress={handleSubmit} color="#616365">
                    <Text style={GlobalStyles.button}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.push("SignUp")}>
                    <Text
                      style={{
                        padding: 8,
                        textAlign: "center",
                        color: color.dark2,
                      }}
                    >
                      Don't have an account??{" "}
                      <Text style={{ color: color.primary }}>
                        Register Here
                      </Text>
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
