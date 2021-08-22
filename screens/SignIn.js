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
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/processors";
import { color, GlobalStyles } from "../styles/global";
import { Formik } from "formik";
import { AntDesign } from "@expo/vector-icons";
import * as Yup from "yup";

const LoginSchema = Yup.object({
  username: Yup.string().required("Username cannot be empty"),
  password: Yup.string().required("Password is required"),
});

export default function SignIn({ navigation }) {
  const { SignIn } = React.useContext(AuthContext);
  const password_ref = useRef();
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
              validationSchema={LoginSchema}
              initialValues={({ username: "" }, { password: "" })}
              onSubmit={(value) => SignIn(value)}
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 4,
  },
});
