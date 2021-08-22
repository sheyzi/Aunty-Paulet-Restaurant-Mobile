import React, { useRef } from "react";
import { AuthContext } from "../context/processors";
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
  ScrollView,
} from "react-native";
import { GlobalStyles, color } from "../styles/global";
import { Formik } from "formik";
import { AntDesign } from "@expo/vector-icons";
import * as Yup from "yup";
import axios from "axios";

const RegisterSchema = Yup.object({
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
  const email_ref = useRef();
  const password_ref = useRef();
  const confirm_password_ref = useRef();
  const { SignUp } = React.useContext(AuthContext);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: color.white }}
      >
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
              onSubmit={(value) => SignUp(value)}
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
                      onSubmitEditing={() =>
                        confirm_password_ref.current.focus()
                      }
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
                  <Text style={GlobalStyles.helperText}>
                    Must be same with password
                  </Text>
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 4,
  },
});
