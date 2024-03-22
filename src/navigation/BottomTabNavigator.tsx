import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList, StackNavigation } from "src/types/NavigationTypes";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, gradients } from "src/constants/Colors";
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  View,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import NotificationsScreen from "src/screens/BottomTabs/NotificationsScreen";
import IconKno from "src/assets/IconKno";
import IconSweat from "src/assets/IconSweat";
import IconHome from "src/assets/IconHome";
import ProfileScreen from "src/screens/BottomTabs/ProfileScreen";
import { RFPercentage } from "react-native-responsive-fontsize";
import HomeStackNavigator from "./HomeStackNavigator";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import NotificationServices from "src/services/NotificationServices";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import { useNavigation } from "@react-navigation/native";
import useOrderStore from "src/store/orderStore";
import ResultScreen from "src/screens/Result/ResultScreen";
import IconFolder from "src/assets/IconFolder";
import { OrderStatus } from "src/constants/enums";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "src/store/userStore";
import TestTube from "src/assets/testtubeIcon";
import TestContentScreen from "src/screens/GetTestedFlow/TestContentScreen";
import MenuIcon from "src/assets/menuIcon";
import CheckIcon from "src/assets/checkIcon";
import ResultDetailsScreen from "src/screens/Result/ResultDetailsScreen";
import PastResultScreen from "src/screens/Result/PastResultScreen";
import IntakeFormScreen from "src/screens/GetTestedFlow/IntakeFormScreen";

const BottomTab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator();

const ResultStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ResultScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
      <Stack.Screen
        name="ResultDetailsScreen"
        component={ResultDetailsScreen}
      />
      <Stack.Screen name="PastResultScreen" component={PastResultScreen} />
    </Stack.Navigator>
  );
};

function BottomTabNavigator() {
  const { showModal, closeModal } = useModal();
  const bottomTabNavigation = useNavigation<StackNavigation>();
  const order = useOrderStore((state) => state.order);
  const user = useUserStore((state) => state?.user);

  const displayNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ) => {
    const channelId = await notifee.createChannel({
      id: "important",
      name: "Important Notifications",
      importance: AndroidImportance.HIGH,
    });
    notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId: channelId,
        smallIcon: "ic_notification",
      },
    });
  };

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
          console.log("token--", token);
          const res = await NotificationServices.addDeviceToken(token);
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

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("notificationData");
      const notifee = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (notifee?.notification && user) {
        notifeeModal(notifee);
      }
    } catch (e) {
      console.log("val err", e);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const notifeeModal = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ) => {
    if (remoteMessage?.data?.checkout === "true") {
      showModal({
        isVisible: true,
        heading:
          typeof remoteMessage.notification?.title === "object"
            ? JSON.stringify(remoteMessage.notification?.title)
            : remoteMessage.notification?.title || "Notification Title",
        body:
          typeof remoteMessage.notification?.body === "object"
            ? JSON.stringify(remoteMessage.notification?.body)
            : remoteMessage.notification?.body || "Notification Body",
        buttonText: "Okay",
        onClose: () => {
          closeModal();
          AsyncStorage.clear();
        },
      });
      bottomTabNavigation?.navigate("ChoosePlan", {
        IntakeForm: user,
      });
    } else {
      showModal({
        isVisible: true,
        heading:
          typeof remoteMessage.notification?.title === "object"
            ? JSON.stringify(remoteMessage.notification?.title)
            : remoteMessage.notification?.title || "Notification Title",
        body:
          typeof remoteMessage.notification?.body === "object"
            ? JSON.stringify(remoteMessage.notification?.body)
            : remoteMessage.notification?.body || "Notification Body",
        buttonText: "Okay",
        onClose: () => {
          closeModal();
          AsyncStorage.clear();
        },
      });
    }
  };

  const openModal = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    showModal({
      isVisible: true,
      heading:
        typeof remoteMessage.data?.pushTitle === "object"
          ? JSON.stringify(remoteMessage.data?.pushTitle)
          : remoteMessage.data?.pushTitle || "Notification Title",
      body:
        typeof remoteMessage.data?.pushMessage === "object"
          ? JSON.stringify(remoteMessage.data?.pushMessage)
          : remoteMessage.data?.pushMessage || "Notification Body",
      buttonText:
        remoteMessage.data?.type === "orderstatus" ||
        remoteMessage.data?.type === "results" ||
        remoteMessage.data?.type === "samplecollection" ||
        remoteMessage.data?.type === "photoeditor"
          ? "View"
          : "Okay",
      onClose: () => {
        switch (remoteMessage.data?.type) {
          case "orderstatus":
            Linking.openURL(`kno://orderstatus`);
            break;
          case "results":
            Linking.openURL(`kno://results`);
            break;
          case "samplecollection":
            Linking.openURL(`kno://homesamplecollection`);
          case "photoeditor":
            Linking.openURL(`kno://photoeditor`);
            break;
          default:
            break;
        }
        closeModal();
      },
    });
  };

  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage((remoteMessage) => {
      if (remoteMessage?.notification?.title) {
        notifeeModal(remoteMessage);
      } else {
        openModal(remoteMessage);
      }
    });

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    messaging().setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        if (remoteMessage?.notification?.title && !remoteMessage.data?.type) {
          notifeeModal(remoteMessage);
        } else {
          switch (remoteMessage.data?.type) {
            case "orderstatus":
              bottomTabNavigation.navigate("Home", {
                screen: "OrderStatus",
              });
              break;
            case "results":
              bottomTabNavigation.navigate("Result");
              break;
            case "samplecollection":
              bottomTabNavigation.navigate("Home", {
                screen: "SampleCollection",
              });
            case "photoeditor":
              bottomTabNavigation.navigate("Home", {
                screen: "PhotoEditor",
              });
              break;
            default:
              bottomTabNavigation.navigate("Notifications");
              break;
          }
        }
      }
    );
  }, []);

  const handleCheckOrderStatus = () => {
    if (order && order?.status !== OrderStatus.Released) {
      showModal({
        isVisible: true,
        heading: "Test in Progress",
        body: "It looks like you already have a test in progress with knō.",
        anotherBody:
          "Please keep an eye on your notifications screen to track your test status.",
        buttonText: "Okay",
        onClose: () => {
          closeModal();
        },
      });
    } else {
      bottomTabNavigation.navigate("IntakeForm");
    }
  };

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: Platform.OS === "ios" ? 12 : 0,
          height: Platform.OS === "ios" ? RFPercentage(8) + 3 : RFPercentage(7),
        },

        tabBarBackground: () => (
          <LinearGradient
            colors={gradients.primary}
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderTopColor: Colors.primary,
                borderBottomWidth: 4,
                borderColor: Colors.velvet,
              }}
            />
          </LinearGradient>
        ),
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: () => <IconHome />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            bottomTabNavigation.navigate("Dashboard");
          },
        }}
      />

      <BottomTab.Screen
        name="ResultStack"
        component={ResultStack}
        options={{
          headerShown: false,

          tabBarIcon: (props) => {
            return (
              <CheckIcon
                {...props}
                opacity={
                  order && order.status === OrderStatus.Released ? 1 : 0.3
                }
                // onPress={() => {
                //   if (order && order.status === OrderStatus.Released) {
                //     bottomTabNavigation?.navigate("Result");
                //   }
                // }}
                onPress={() => bottomTabNavigation?.navigate("ResultStack")}
              />
            );
          },
        }}
      />

      <BottomTab.Screen
        name="IntakeFormScreen"
        component={IntakeFormScreen}
        options={{
          headerShown: false,
          // tabBarIcon: () => <TestTube />,
          tabBarIcon: (props: any) => {
            return (
              <TestTube
                {...props}
                onPress={() => {
                  handleCheckOrderStatus();
                }}
              />
            );
          },
        }}
      />

      <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => <IconSweat />,
        }}
      />
      {/* 
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          // tabBarIcon: () => <IconKno />,
          tabBarIcon: () => <MenuIcon />,
        }}
      /> */}

      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: (props: any) => {
            return (
              <MenuIcon
                {...props}
                user={user}
                onPress={() => {
                  if (user) {
                    bottomTabNavigation?.navigate("Profile");
                  } else {
                    bottomTabNavigation?.navigate("IntakeFormScreen");
                  }
                }}
              />
            );
          },
        }}
      />
    </BottomTab.Navigator>
  );
}

export default BottomTabNavigator;
