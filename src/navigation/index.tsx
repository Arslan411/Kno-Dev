import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { DefaultTheme } from "src/constants/Colors";
import ForgotPasswordScreen from "src/screens/Auth/ForgotPasswordScreen";
import LoginScreen from "src/screens/Auth/LoginScreen";
import OpenEmailScreen from "src/screens/Auth/OpenEmailScreen";
import RegisterScreen from "src/screens/Auth/RegisterScreen";
import RegistrationSuccessScreen from "src/screens/Auth/RegistrationSuccessScreen";
import SetPasswordScreen from "src/screens/Auth/SetPasswordScreen";
import ConsentScreen from "src/screens/ConsentScreen";
import { RootStackParamList } from "types/NavigationTypes";
import LoginVerifyOTPScreen from "src/screens/Auth/LoginVerifyOTPScreen";
import useTokenStore from "src/store/tokenStore";
import AuthServices from "src/services/AuthServices";
import SplashScreen from "src/screens/SplashScreen";
import RegisterVerifyOTPScreen from "src/screens/Auth/RegisterVerifyOTPScreen";
import useUserStore from "src/store/userStore";
import TenetOneScreen from "src/screens/TenetOneScreen";
import TenetTwoScreen from "src/screens/TenetTwoScreen";
import TenetThreeScreen from "src/screens/TenetThreeScreen";
import TenetFourScreen from "src/screens/TenetFourScreen";
import * as Linking from "expo-linking";
import EditProfileScreen from "src/screens/Profile/EditProfileScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import FetchProfileScreen from "src/screens/FetchProfileScreen";
import PaymentWebViewScreen from "src/screens/GetTestedFlow/PaymentWebviewScreen";
import useOrderStore from "src/store/orderStore";
import SampleCollectionScreen from "src/screens/Dashboard/SampleCollectionScreen";
import { OrderStatus } from "src/constants/enums";
import useSampleCollectionStore from "src/store/sampleCollectionStore";
import useResultStore from "src/store/resultStore";
import useDiseaseStore from "src/store/diseaseStore";
import * as SecureStore from "expo-secure-store";
import {
  Alert,
  AppState,
  AppStateStatus,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import LearnMoreWebView from "src/screens/Auth/LearnMoreWebView";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import WelcomeVideoScreen from "src/screens/Auth/WelcomeVideoScreen";
// import VersionCheck from "react-native-version-check";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaymentSuccessScreen from "src/screens/GetTestedFlow/PaymentSuccessScreen";
import ChoosePlanScreen from "src/screens/GetTestedFlow/ChoosePlanScreen";

export default function Navigation() {
  const { showModal, closeModal } = useModal();
  const isNewUserFcm = useUserStore((state) => state.isNewUserFcm);
  const setNewUserFcm = useUserStore((state) => state.setNewUserFcm);
  const user = useUserStore((state) => state?.user);
  const navigationRef = React.useRef<any>();
  const url = Linking.useURL();

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("notificationData");
      const notifee = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (notifee?.notification && !user) {
        console.log("notifications testinf---->", notifee);
        openModal(notifee);
      }
    } catch (e) {
      console.log("val err", e);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  // React.useEffect(() => {
  //   const id = {
  //     appID: 6451420414,
  //     appName: "Kno",
  //   };
  //   const checkAppVersion = async () => {
  //     try {
  //       const latestVersion =
  //         Platform.OS === "ios"
  //           ? await fetch(
  //               `https://itunes.apple.com/us/lookup?bundleId=com.kno.app`
  //             )
  //               .then((r) => r.json())
  //               .then((res) => {
  //                 console.log("res--->>>", res?.results[0]?.version);
  //                 return res?.results[0]?.version;
  //               })
  //           : await VersionCheck.getLatestVersion({
  //               provider: "playStore",
  //               packageName: "com.kno.app",
  //               ignoreErrors: true,
  //             });

  //       const currentVersion = VersionCheck.getCurrentVersion();

  //       console.log("latestVersion--", latestVersion, currentVersion);

  //       if (latestVersion > currentVersion) {
  //         Alert.alert(
  //           "Update Required",
  //           "A new version of the app is available. Please update to continue using the app.",
  //           [
  //             {
  //               text: "Update Now",
  //               onPress: () => {
  //                 Linking.openURL(
  //                   Platform.OS === "ios"
  //                     ? VersionCheck.getAppStoreUrl({
  //                         appID: id,
  //                       })
  //                     : VersionCheck.getPlayStoreUrl({
  //                         packageName: "com.yourapp.package",
  //                       })
  //                 );
  //               },
  //             },
  //           ],
  //           { cancelable: false }
  //         );
  //       } else {
  //         // App is up-to-date; proceed with the app
  //       }
  //     } catch (error) {
  //       // Handle error while checking app version
  //       console.error("Error checking app version:", error);
  //     }
  //   };

  //   checkAppVersion();
  // }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();

    if (Platform.OS === "android") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    const disabled = authStatus === messaging.AuthorizationStatus.DENIED;

    if (enabled) {
      try {
        const token = await messaging().getToken();
        if (token) {
          if (isNewUserFcm) {
            handleUserCreation(token);
            console.log("FCM sent successfully!");
          } else {
            console.log("FCM already sent!");
          }
        }
      } catch (error: any) {
        console.log(error.response.data);
      }
    }

    if (disabled) {
      if (Platform.OS === "android") {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
      Alert.alert(
        "Notification Permission",
        "Please enable notification permission in settings",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    }
  }
  const handleUserCreation = async (fcmToken: any) => {
    try {
      const res = await AuthServices.sendFCMToken(fcmToken);
      if (res?.status === 200) {
        setNewUserFcm(false);
      }
    } catch (error: any) {
      console.log("user_creation_Fcm_error:", error);
    }
  };
  React.useEffect(() => {
    requestUserPermission();
  }, []);

  const openModal = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    showModal({
      isVisible: true,
      heading:
        typeof remoteMessage?.notification?.title === "object"
          ? JSON.stringify(remoteMessage?.notification?.title)
          : remoteMessage?.notification?.title || "Notification Title",
      body:
        typeof remoteMessage?.notification?.body === "object"
          ? JSON.stringify(remoteMessage?.notification?.body)
          : remoteMessage?.notification?.body || "Notification Body",
      buttonText: "Okay",
      onClose: () => {
        closeModal();
        AsyncStorage.clear();
      },
    });
  };

  React.useEffect(() => {
    messaging().setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log("remoteMessage----111", remoteMessage);
        if (!user) {
          openModal(remoteMessage);
        }
      }
    );
  }, []);

  const prefix = Linking.createURL("/");
  const config = {
    screens: {
      Login: "login",
      Register: "register",
      SetPassword: {
        path: "resetpassword/:token",
        parse: {
          token: (token: string) => `${token}`,
        },
      },
      SampleCollection: "samplecollection",
      Root: {
        screens: {
          Home: {
            screens: {
              OrderStatus: "orderstatus",
              ImagePicker: "photoeditor",
              HomeSampleCollection: "homesamplecollection",
            },
          },
          Result: "results",
        },
      },
    },
  };

  const linking = {
    prefixes: [prefix, "kno://"],
    config,
  };

  // React.useEffect(() => {
  //   messaging().setBackgroundMessageHandler(
  //     async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  //       switch (remoteMessage.data?.type) {
  //         case "orderstatus":
  //           // Linking.openURL(`kno://orderstatus`);
  //           console.log(
  //             " navigationRef.current?.navigate--",
  //             navigationRef.current?.navigate
  //           );
  //           navigationRef.current?.navigate("SampleCollection");
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

  return (
    <NavigationContainer
      theme={DefaultTheme}
      linking={linking as any}
      ref={navigationRef}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const refreshToken = useTokenStore((state) => state.refreshToken);
  const clearToken = useTokenStore((state) => state.clear);
  const user = useUserStore((state) => state.user);
  const isNewUser = useUserStore((state) => state.isNewUser);
  const order = useOrderStore((state) => state.order);
  const clearUser = useUserStore((state) => state.clear);
  const clearStatus = useOrderStore((state) => state.clear);
  const clearResult = useResultStore((state) => state.clear);
  const clearStiList = useDiseaseStore((state) => state.clear);
  const clearSampleCollection = useSampleCollectionStore(
    (state) => state.clear
  );

  const [loading, setLoading] = React.useState<boolean>(false);
  const { showModal, closeModal } = useModal();

  const { SampleCollection, setSampleCollection } = useSampleCollectionStore(
    (state) => ({
      SampleCollection: state.sampleCollection,
      setSampleCollection: state.setSampleCollection,
    })
  );

  React.useEffect(() => {
    if (
      (order?.sampleCollectedOn === null &&
        order?.status === OrderStatus.CustomerDelivered) ||
      (order?.sampleCollectedOn === null &&
        order?.status === OrderStatus.LabInTransit) ||
      (order?.sampleCollectedOn === null &&
        order?.status === OrderStatus.LabDelivered) ||
      (order?.sampleCollectedOn === null &&
        order?.status === OrderStatus.LabOutForDelivery)
    ) {
      setSampleCollection(false);
    } else {
      setSampleCollection(true);
    }
  }, [order, SampleCollection]);

  const fetchAccessToken = async () => {
    try {
      if (refreshToken) {
        setLoading(true);
        const res = await AuthServices.fetchAccessToken(refreshToken);
        // LogOut();
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  const clear = React.useCallback(async () => {
    await clearUser();
    await clearToken();
    await clearStatus();
    await clearResult();
    await clearStiList();
    await clearSampleCollection();
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("accessToken");
  }, []);

  const LogOut = async () => {
    try {
      const response = await AuthServices.logout();
      if (response.status === 200) {
        closeModal();
        clear();
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.response.data);
      setLoading(false);
      // Toast.error(error.response.data.message);
    }
  };

  React.useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      const logoutTimeout = 600000;

      const backgroundTimer = setTimeout(() => {
        // LogOut();
      }, logoutTimeout);

      switch (state) {
        case "background":
        case "inactive":
          console.log(
            "App is in the background at",
            new Date().toLocaleTimeString()
          );
          return () => clearTimeout(backgroundTimer);
        case "active":
          console.log("App is active at", new Date().toLocaleTimeString());
          clearTimeout(backgroundTimer);

          break;
        default:
          break;
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    fetchAccessToken();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {!refreshToken || refreshToken ? (
        <Stack.Group>
          {isNewUser && (
            <Stack.Screen
              name="WelcomeVideoScreen"
              component={WelcomeVideoScreen}
              options={{ headerShown: false }}
            />
          )}

          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginVerifyOTP"
            component={LoginVerifyOTPScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterVerifyOTP"
            component={RegisterVerifyOTPScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistrationSuccess"
            component={RegistrationSuccessScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OpenEmail"
            component={OpenEmailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TenetOne"
            component={TenetOneScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TenetTwo"
            component={TenetTwoScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="TenetThree"
            component={TenetThreeScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="TenetFour"
            component={TenetFourScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="Consent"
            component={ConsentScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="LearnMoreWebView"
            component={LearnMoreWebView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SetPassword"
            component={SetPasswordScreen}
            options={{
              headerShown: false,
            }}
            initialParams={{ token: "" }}
            getId={({ params }) => params.token}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentWebView"
            component={PaymentWebViewScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChoosePlan"
            component={ChoosePlanScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="FetchProfile"
            component={FetchProfileScreen}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      ) : refreshToken && !user ? (
        <Stack.Screen
          name="FetchProfile"
          component={FetchProfileScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentWebView"
            component={PaymentWebViewScreen}
            options={{ headerShown: false }}
          />
        </>
      )}

      {/* <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        /> */}

      {/* {!refreshToken ? (
        <Stack.Group>
          {isNewUser && (
            <Stack.Screen
              name="WelcomeVideoScreen"
              component={WelcomeVideoScreen}
              options={{ headerShown: false }}
            />
          )}

          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginVerifyOTP"
            component={LoginVerifyOTPScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterVerifyOTP"
            component={RegisterVerifyOTPScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistrationSuccess"
            component={RegistrationSuccessScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OpenEmail"
            component={OpenEmailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TenetOne"
            component={TenetOneScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TenetTwo"
            component={TenetTwoScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="TenetThree"
            component={TenetThreeScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="TenetFour"
            component={TenetFourScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="Consent"
            component={ConsentScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="LearnMoreWebView"
            component={LearnMoreWebView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SetPassword"
            component={SetPasswordScreen}
            options={{
              headerShown: false,
            }}
            initialParams={{ token: "" }}
            getId={({ params }) => params.token}
          />
        </Stack.Group>
      ) : refreshToken && !user ? (
        <Stack.Screen
          name="FetchProfile"
          component={FetchProfileScreen}
          options={{ headerShown: false }}
        />
      ) : refreshToken && user && !SampleCollection ? (
        <Stack.Screen
          name="SampleCollection"
          component={SampleCollectionScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentWebView"
            component={PaymentWebViewScreen}
            options={{ headerShown: false }}
          />
        </>
      )} */}
    </Stack.Navigator>
  );
}
