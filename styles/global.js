import { StyleSheet, StatusBar, Platform } from "react-native";

export const color = {
  primary: "#E15A11",
  secondary: "#5a351C",
  dark: "#100C0A",
  dark2: "#616365",
  dark3: "#8E969C",
  light: "#EDEEEF",
  light2: "#C9BFB3",
  white: "#fff",
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
    padding: 10,
  },
  CardStyle: { padding: 5 },
  title: {
    fontSize: 24,
    paddingVertical: 5,
    fontFamily: "nunito-bold",
    // textAlign: "center",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    paddingVertical: 5,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  authPageContainer: {
    flex: 1,
    backgroundColor: color.white,
    padding: 20,
    justifyContent: "center",
  },
  control: {
    backgroundColor: color.light,
    borderRadius: 3,
    paddingHorizontal: 5,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 5,
  },
  button: {
    textAlign: "center",
    backgroundColor: color.primary,
    color: color.light,
    fontSize: 18,
    padding: 10,
    fontFamily: "nunito-bold",
    borderRadius: 3,
  },

  logoContainer: {
    top: 50,
    alignSelf: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
  input: {
    flex: 1,
    backgroundColor: color.light,
    color: color.dark,
    padding: 10,
    fontSize: 18,
    fontFamily: "nunito-regular",
    borderRadius: 3,
    height: 50,
  },
  helperText: {
    color: color.light2,
    // paddingVertical: 2,
    fontSize: 11,
  },
});
