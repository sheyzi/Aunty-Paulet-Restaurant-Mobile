import { Alert, Platform } from "react-native";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import axios from "./config/axiosConfig";
import Constants from "expo-constants";

// const getPushToken = async () => {
// 	const token = await Notifications.getExpoPushTokenAsync();
// 	return token;
// };

// const hasNotificationPermission = async () => {
// 	try {
// 		const { status: existingStatus } = await Permissions.getAsync(
// 			Permissions.NOTIFICATIONS
// 		);
// 		let finalStatus = existingStatus;
// 		// If we don't already have permission, ask for it
// 		if (existingStatus !== "granted") {
// 			const { status } = await Permissions.askAsync(
// 				Permissions.NOTIFICATIONS
// 			);
// 			finalStatus = status;
// 		}
// 		if (finalStatus === "granted") return true;
// 		if (finalStatus !== "granted") {
// 			Alert.alert(
// 				"Warning",
// 				"You will not receive reminders if you do not enable push notifications. If you would like to receive reminders, please enable push notifications for Fin in your settings.",
// 				[
// 					{ text: "Cancel" },
// 					// If they said no initially and want to change their mind,
// 					// we can automatically open our app in their settings
// 					// so there's less friction in turning notifications on
// 					{
// 						text: "Enable Notifications",
// 						onPress: () =>
// 							Platform.OS === "ios"
// 								? Linking.openURL("app-settings:")
// 								: Linking.openSettings(),
// 					},
// 				]
// 			);
// 			return false;
// 		}
// 	} catch (error) {
// 		Alert.alert(
// 			"Error",
// 			"Something went wrong while check your notification permissions, please try again later."
// 		);
// 		return false;
// 	}
// };

const addPushToken = async (token) => {
	await SecureStore.setItemAsync("push-token", token);
};

const savePushToken = async (token, userToken) => {
	let axiosConfig = {
		headers: {
			Authorization: `Bearer ${userToken}`,
		},
	};
	axios
		.get(`/users/add/push-token?token=${token}`, axiosConfig)
		.then((res) => {
			console.log(res.data.token);
			addPushToken(res.data.token);
		})
		.catch((err) => {
			console.log(err.response);
		});
};

// export async function registerForPushNotification(userToken) {
// 	const { status } = await Notifications.getPermissionsAsync();
// 	if (status !== "granted") {
// 		const { status } = await Permissions.getAsync(
// 			Permissions.NOTIFICATIONS
// 		);
// 	}
// 	if (status !== "granted") {
// 		Alert.alert("Error", "Failed to get push token Permissions");
// 		return;
// 	}
// 	const token = (await Notifications.getExpoPushTokenAsync()).data;
// 	addPushToken(token);
// 	savePushToken(token, userToken);
// 	return token;
// }

export async function registerForPushNotificationsAsync(userToken) {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted" || existingStatus === "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			Alert.alert("Error", "Failed to get push token Permissions");

			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		addPushToken(token);
		let axiosConfig = {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		};
		axios
			.get(`/users/add/push-token?token=${token}`, axiosConfig)
			.then((res) => {
				console.log(res.data.token);
				addPushToken(res.data.token);
			})
			.catch((err) => {
				console.log(err.response);
			});
	} else {
		alert("Must use physical device for Push Notifications");
	}

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	return token;
}
