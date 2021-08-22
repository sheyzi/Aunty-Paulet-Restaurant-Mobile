import React from "react";
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Modal,
	TouchableWithoutFeedback,
	Keyboard,
	ActivityIndicator,
} from "react-native";
import { GlobalStyles, color } from "../styles/global";
import axios from "../config/axiosConfig";
import * as SecureStore from "expo-secure-store";

import Toast from "react-native-toast-message";
import realAxios from "axios";
import Loading from "./Loading";
import { AntDesign } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import * as Sentry from "sentry-expo";

export default function Fund({ navigation }) {
	const [encryptionKey, setEncryptionKey] = React.useState(null);
	const [secretKey, setSecretKey] = React.useState(null);
	const [publicKey, setPublicKey] = React.useState(null);
	const [userDetails, setUserDetails] = React.useState(null);
	const [userToken, setUserToken] = React.useState({});
	const [isLoading, setIsLoading] = React.useState(true);

	const webview = React.useRef();

	const [link, setLink] = React.useState(null);
	const [txRef, setTxRef] = React.useState(null);
	const [pageLoading, setPageLoading] = React.useState(true);

	const [response, setResponse] = React.useState();
	const [makePayment, setMakePayment] = React.useState(false);
	const [paymentStatus, setPaymentStatus] = React.useState("");
	const [modalVisible, setModalVisible] = React.useState(false);
	const [amount, setAmount] = React.useState("");

	const handleModalVisibility = () => setModalVisible(!modalVisible);

	function getEncryptionKey(token) {
		let axiosConfig = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		axios
			.get("/encryption-key", axiosConfig)
			.then((res) => {
				setEncryptionKey(res.data.encryption_key);
				setSecretKey(res.data.secret_key);
				setPublicKey(res.data.public_key);
			})
			.catch((err) => {
				Toast.show({
					type: "error",
					position: "top",
					text1: "Error",
					text2: "Something went wrong please try reopening the app and check your internet connection",
					visibilityTime: 4000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				console.log(err);
				Sentry.Native.captureException(err);
			});
	}

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
		getEncryptionKey(result);
		getUserData(result);
	}

	function getTxRef() {
		txref =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15);
		return txref;
	}

	function handleChangeText(value) {
		setAmount(value);
	}
	React.useEffect(() => {
		getValueAsync();
		setTimeout(() => {
			setIsLoading(false);
		}, 300);
	}, []);

	if (isLoading) {
		return <Loading />;
	}
	const generateRef = (length) => {
		var a =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
				""
			);
		var b = [];
		for (var i = 0; i < length; i++) {
			var j = (Math.random() * (a.length - 1)).toFixed(0);
			b[i] = a[j];
		}
		return b.join("");
	};

	const handlePayment = async () => {
		const axiosConfig = {
			headers: {
				Authorization: `Bearer ${secretKey}`,
			},
		};
		const txref = generateRef(11);
		setTxRef(txref);
		const params = {
			tx_ref: generateRef(11),
			amount: amount,
			currency: "NGN",
			payment_options: "card",
			redirect_url: "https://secret-temple-37744.herokuapp.com/docs",
			customer: {
				email: userDetails.email,
				username: userDetails.username,
			},
			customizations: {
				title: "Account Funding",
				description: "Fund your Aunty Paulet Restaurant Account",
				logo: "https://res.cloudinary.com/sheyzisilver/image/upload/v1628805489/icon_nf9gqn.png",
			},
		};

		realAxios
			.post(
				"https://api.flutterwave.com/v3/payments",
				params,
				axiosConfig
			)
			.then((res) => {
				let payment_link = res.data.data.link;
				console.log(payment_link);
				setLink(payment_link);
				handleModalVisibility();
			})
			.catch((err) => {
				console.log(err.response);
				Sentry.Native.captureException(err);
			});
	};
	function getQueryVariable(url, variable) {
		var query = url;
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (decodeURIComponent(pair[0]) == variable) {
				return decodeURIComponent(pair[1]);
			}
		}
		console.log("Query variable %s not found", variable);
	}

	const handleWebViewNavigationStateChange = (newNavState) => {
		const { url } = newNavState;
		if (url.includes("?status=successful")) {
			setModalVisible(false);
			const t_id = getQueryVariable(url, "transaction_id");
			console.log(getQueryVariable(url, "transaction_id"));
			const axiosConfig = {
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			};
			axios
				.get(`/users/fund?t_id=${t_id}`, axiosConfig)
				.then((res) => {
					console.log(res.data);
					navigation.navigate("Menu");
				})
				.catch((err) => {
					console.log(err);
					Sentry.Native.captureException(err);
				});
		}
	};

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				setModalVisible(false);
				Keyboard.dismiss();
			}}
		>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, backgroundColor: color.white }}
			>
				<Modal
					visible={modalVisible}
					transparent={true}
					backgroundColor="#000000"
					animationType="slide"
				>
					<View
						style={{
							flex: 1,
							flexDirection: "column",
							// justifyContent: "center",
							// alignItems: "center",
							backgroundColor: "rgba(0,0,0,0.5)",
						}}
					>
						<TouchableWithoutFeedback
							onPress={() => {
								setModalVisible(false);
								Keyboard.dismiss();
							}}
						>
							<View style={{ flex: 1 }}></View>
						</TouchableWithoutFeedback>
						<View
							style={{
								height: "80%",
								backgroundColor: "#fff",
								borderTopRightRadius: 40,
								borderTopLeftRadius: 40,
								paddingTop: 24,
								paddingHorizontal: 10,
							}}
						>
							{pageLoading && <Loading />}
							<WebView
								onLoad={() => {
									setPageLoading(false);
								}}
								style={{ flex: 1 }}
								ref={webview}
								source={{ uri: link }}
								onNavigationStateChange={
									handleWebViewNavigationStateChange
								}
							/>
						</View>
					</View>
				</Modal>
				<View style={styles.container}>
					<View style={{ flex: 1, margin: 16 }}>
						<Text style={styles.inputLabel}>
							How much do you want to deposit?
						</Text>
						<View style={GlobalStyles.control}>
							<TextInput
								style={GlobalStyles.input}
								keyboardType="numeric"
								placeholder="₦10,000"
								onChangeText={handleChangeText}
								value={amount}
							/>
						</View>

						{amount ? (
							<TouchableOpacity
								onPress={handlePayment}
								style={GlobalStyles.buttonContainer}
							>
								<Text style={GlobalStyles.button}>
									Pay ₦{amount}{" "}
								</Text>
							</TouchableOpacity>
						) : (
							<View></View>
						)}
					</View>
				</View>
			</ScrollView>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: color.white,
		padding: 5,
	},
	inputLabel: {
		fontSize: 16,
		fontFamily: "nunito-bold",
	},
	button: {
		textAlign: "center",

		color: color.light,
		fontSize: 18,
		padding: 10,
		fontFamily: "nunito-bold",
	},
});
