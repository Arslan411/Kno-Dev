import { registerRootComponent } from "expo";
import App from "./App";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

// AppRegistry.registerHeadlessTask(
//   "ReactNativeFirebaseMessagingHeadlessTask",
//   (message) => storeData(message)
// );
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("notificationData", jsonValue);
  } catch (e) {
    console.log("notifee erorr , ", e);
  }
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("remoteMessageremoteMessageremoteMessage", remoteMessage);
  storeData(remoteMessage);
});

registerRootComponent(App);
