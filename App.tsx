import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "src/navigation";
import ToastManager from "src/components/ToastManager";

import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

import {
  LibreBaskerville_400Regular,
  LibreBaskerville_700Bold,
} from "@expo-google-fonts/libre-baskerville";
import { TitanOne_400Regular } from "@expo-google-fonts/titan-one";

import { useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GlobalModalProvider } from "src/components/GlobalModal/GlobalModal";
// import { Linking } from "react-native";
// import messaging, {
//   FirebaseMessagingTypes,
// } from "@react-native-firebase/messaging";
// import { useNavigation } from "@react-navigation/native";
import { firebase } from "@react-native-firebase/analytics";

export default function App() {
  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
    TitanOne_400Regular,
  });

  async function handleEnableAnalytics() {
    if (!__DEV__) {
      await firebase.analytics().setAnalyticsCollectionEnabled(true);
    }
  }

  useEffect(() => {
    handleEnableAnalytics();
  }, []);

  // const navigation = useNavigation<any>();

  // useEffect(() => {
  //   messaging().setBackgroundMessageHandler(
  //     async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  //       switch (remoteMessage.data?.type) {
  //         case "orderstatus":
  //           // Linking.openURL(`kno://orderstatus`);
  //           navigation.navigate("orderstatus");
  //           break;
  //         case "results":
  //           Linking.openURL(`kno://results`);
  //           break;
  //         case "samplecollection":
  //           Linking.openURL(`kno://samplecollection`);
  //         case "photoeditor":
  //           Linking.openURL(`kno://photoeditor`);
  //           break;
  //         default:
  //           Linking.openURL(`kno://orderstatus`);
  //           break;
  //       }
  //     }
  //   );
  // }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GlobalModalProvider>
        <StatusBar style="dark" />
        <ToastManager />
        <Navigation />
      </GlobalModalProvider>
    </SafeAreaProvider>
  );
}
