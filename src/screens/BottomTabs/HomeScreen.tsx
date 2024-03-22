import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SV } from "src/components/Themed";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import HomeHeader from "src/components/HomeScreen/Header";
import HomeScreenItem, {
  HomeScreenItemProps,
} from "src/components/HomeScreen/HomeScreenItem";
import useUserStore from "src/store/userStore";
import { RFPercentage } from "react-native-responsive-fontsize";
import React, { useEffect, useState } from "react";
import ProfileServices from "src/services/ProfileServices";
import useOrderStore from "src/store/orderStore";
import { OrderStatus } from "src/constants/enums";
import TestServices from "src/services/TestServices";
import { Colors } from "src/constants/Colors";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import usepreviousStiStore from "src/store/previousStiStore";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import analytics from "@react-native-firebase/analytics";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
import styles from "src/components/ToastManager/styles";
import { images } from "src/utils/Images";
import useTokenStore from "src/store/tokenStore";

const HomeScreen = ({ navigation }: HomeStackScreenProps<"Dashboard">) => {
  const isFirstTime = useUserStore((state) => state.isFirstTime);
  const user = useUserStore((state) => state.user);
  const previousStis = usepreviousStiStore((state) => state.previousStis);
  const clear = usepreviousStiStore((state) => state.clear);
  const [testDays, setTestDays] = useState<any>(0);
  const accessToken = useTokenStore((state) => state.accessToken);

  const userPreviousStis = previousStis.find(
    (item) => item.email === user?.primaryEmail
  );
  const order = useOrderStore((state) => state.order);
  const setOrder = useOrderStore((state) => state.setOrder);
  const { showModal, closeModal } = useModal();

  useEffect(() => {
    if (order) {
      const createdOnDateString = order?.CreatedOn;
      const createdOnDate = new Date(createdOnDateString);
      const todayDate = new Date();
      const timeDifference = todayDate.getTime() - createdOnDate.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      setTestDays(daysDifference);
    }
  }, []);

  useEffect(() => {
    if (order?.status === OrderStatus.Released && !userPreviousStis) {
      showModal({
        isVisible: true,
        heading: "Remind us quickly",
        body: "Because we are a little crazy about security, We require users to re-enter self reporting data when they change devices.",
        buttonText: "Let's do it!",
        onClose: () => {
          closeModal();
          navigation.navigate("SelfReporting");
        },
      });
    }
  }, []);

  const handleModel = () => {
    if (order && order?.sampleCollectedOn) {
      showModal({
        isVisible: true,
        heading: "Alert!",
        body: "You have already provided the sample collection date",
        buttonText: "Close",
        onClose: () => {
          closeModal();
        },
      });
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const navigateToImagePicker = async () => {
    if (order !== null && order?.status === OrderStatus.Released) {
      navigation.navigate("ImagePicker");
    } else {
      showModal({
        isVisible: true,
        heading: `Not yet! \n `,
        body: "If you want to add the knō badge to your dating profile pics you have to actually knō first (that’s kind of the whole point).",
        anotherBody:
          "Don’t worry though, just click the button below to order a test and you’ll be on your way to swiping with confidence.",
        buttonText: "Get Tested!",
        onClose: () => {
          closeModal();
          navigation.navigate("TestContent");
        },
      });
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await ProfileServices.fetchProfile();
      if (response.status === 200) {
        useUserStore.setState({
          user: {
            firstName: response.data.data[0].firstName,
            lastName: response.data.data[0].lastName,
            primaryEmail: response.data.data[0].primaryEmail,
            referringEmail: response.data.data[0].referringEmail,
            profilePic:
              response.data.data[0].profilePic !== null
                ? `${response.data.data[0].profilePic}?q=${Date.now()}`
                : null,
            address1: response.data.data[0].address1 ?? "",
            address2: response.data.data[0].address2 ?? "",
            city: response.data.data[0].city ?? "",
            state: response.data.data[0].state ?? "",
            zipCode: response.data.data[0].zip ?? "",
            mobile: response.data.data[0].mobile,
          },
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  const fetchOrder = async () => {
    try {
      const res = await TestServices.fetchOrderStatus();
      console.log(res?.data?.data?.[0]);
      console.log(res);
      if (res?.data && res?.data?.data?.[0]) {
        setOrder(res.data.data[0]);
      }
    } catch (error: any) {
      console.log("--", error.response.data.message);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrder();
    // fetchProfile();
    setRefreshing(false);
  };

  const handleTimeStamp = () => {
    const createdAtDate = new Date(order?.CreatedOn);
    const endTimeDate = new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000);
    // const endTimeDate = new Date(createdAtDate?.getTime() + 5 * 60 * 1000); // 5 minutes in milliseconds
    const currentTime = new Date().toISOString();
    // console.log("currentTime--", currentTime);
    return new Date(currentTime) > endTimeDate;
  };

  const data: HomeScreenItemProps[] = [
    {
      id: 1,
      name: "Get knō kit",
      icon: require("src/assets/home/kno.png"),
      disabled: order && order.status !== OrderStatus.Released ? true : false,
      onPress: () => {
        navigation.navigate("TestContent");
      },
    },
    {
      id: 2,
      name: "Share My Status",
      icon: require("src/assets/home/kiss-mark.png"),
      disabled: order === null,
      onPress: () => {
        if (user?.profilePic) {
          navigation.navigate("ImagePicker");
        } else {
          navigateToImagePicker();
        }
      },
    },
    {
      id: 3,
      name: "My knō Profile",
      icon: require("src/assets/home/aubergine.png"),
      disabled: false,
      onPress: () => navigation.navigate("Profile"),
    },
    {
      id: 4,
      name: "Notifications",
      icon: require("src/assets/sweat.png"),
      disabled: false,
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      id: 5,
      name: "Refer a Friend",
      icon: require("src/assets/home/tulip.png"),
      disabled: false,
      onPress: () => navigation.navigate("CouponScreen"),
    },
    {
      id: 6,
      name: "FAQs",
      icon: require("src/assets/home/peach.png"),
      disabled: false,
      onPress: () => navigation.navigate("FaqScreen"),
    },
    {
      id: 7,
      name:
        order && order.status === OrderStatus.Released
          ? "Test Results"
          : "Test Status",
      icon:
        order && order.status === OrderStatus.Released
          ? require("src/assets/folder.png")
          : require("src/assets/home/microscope.png"),
      disabled: order === null,
      onPress: () => {
        if (order && order.status === OrderStatus.Released) {
          navigation.navigate("Result");
        } else {
          order !== null && navigation.navigate("OrderStatus");
        }
      },
    },

    {
      id: 8,
      name: "Complete Test",
      icon: require("src/assets/syring.png"),
      disabled: order === null,
      onPress: () => {
        if (order && handleTimeStamp()) {
          if (!order?.sampleCollectedOn) {
            navigation.navigate("HomeSampleCollection");
          } else {
            handleModel();
          }
        } else {
          if (
            order &&
            (order.status === OrderStatus.Shipped ||
              order.status === OrderStatus.PendingReceipt ||
              order.status === OrderStatus.InLab ||
              order.status === OrderStatus.ResultsReady ||
              order.status === OrderStatus.InMroReview ||
              order.status === OrderStatus.PendingMroCcf ||
              order.status === OrderStatus.PendingAffidavit ||
              order.status === OrderStatus.DerNotificationRequired ||
              order.status === OrderStatus.LabReview ||
              order.status === OrderStatus.PhysicianDetailsNotFound ||
              order.status === OrderStatus.CustomerInTransit ||
              order.status === OrderStatus.CustomerOutForDelivery ||
              order.status === OrderStatus.CustomerDelivered ||
              order.status === OrderStatus.LabInTransit ||
              order.status === OrderStatus.LabOutForDelivery ||
              order.status === OrderStatus.LabDelivered) &&
            !order?.sampleCollectedOn
          ) {
            navigation.navigate("HomeSampleCollection");
          } else if (order && order?.sampleCollectedOn) {
            handleModel();
          } else {
            console.log("---complete Test else part");
          }
        }
      },
      imgHeight: RFPercentage(6),
      imgWidth: RFPercentage(6),
    },
  ];

  if (order === null) {
    data.splice(6, 2);
  }

  useEffect(() => {
    messaging().setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        switch (remoteMessage.data?.type) {
          case "orderstatus":
            // Linking.openURL(`kno://orderstatus`);
            navigation.navigate("orderstatus");
            break;
          case "results":
            // Linking.openURL(`kno://results`);
            break;
          case "samplecollection":
          // Linking.openURL(`kno://samplecollection`);
          case "photoeditor":
            // Linking.openURL(`kno://photoeditor`);
            break;
          default:
            // Linking.openURL(`kno://orderstatus`);
            break;
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
      navigation.navigate("IntakeForm");
    }
  };

  const handleCompleteTest = () => {
    if (order && handleTimeStamp()) {
      if (!order?.sampleCollectedOn) {
        navigation.navigate("HomeSampleCollection");
      } else {
        handleModel();
      }
    } else {
      if (
        order &&
        (order.status === OrderStatus.Shipped ||
          order.status === OrderStatus.PendingReceipt ||
          order.status === OrderStatus.InLab ||
          order.status === OrderStatus.ResultsReady ||
          order.status === OrderStatus.InMroReview ||
          order.status === OrderStatus.PendingMroCcf ||
          order.status === OrderStatus.PendingAffidavit ||
          order.status === OrderStatus.DerNotificationRequired ||
          order.status === OrderStatus.LabReview ||
          order.status === OrderStatus.PhysicianDetailsNotFound ||
          order.status === OrderStatus.CustomerInTransit ||
          order.status === OrderStatus.CustomerOutForDelivery ||
          order.status === OrderStatus.CustomerDelivered ||
          order.status === OrderStatus.LabInTransit ||
          order.status === OrderStatus.LabOutForDelivery ||
          order.status === OrderStatus.LabDelivered) &&
        !order?.sampleCollectedOn
      ) {
        navigation.navigate("HomeSampleCollection");
      } else if (order && order?.sampleCollectedOn) {
        handleModel();
      } else {
        console.log("---complete Test else part");
      }
    }
  };

  return (
    <SV
      style={{
        flex: 1,
      }}
    >
      <UserHeader />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.velvet]}
          />
        }
        style={{ flex: 1, padding: 10 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(16) + 64
              : RFPercentage(16) + 48,
        }}
      >
        <Cards
          width={RFPercentage(16)}
          imageCard
          fontSize={RFPercentage(1.9)}
          checked
          customStyles={{ marginBottom: 10 }}
          onPress={() => handleCheckOrderStatus()}
        />
        {accessToken ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Cards
              buttonCard
              buttonTitle={testDays}
              buttonSubHeading="Days since last test"
              fontSize={RFPercentage(1.7)}
              iconShow
              hideSecondaryIcon
              customStyles={{ width: "49%" }}
              sourcedImage={images.circular}
              marginLeft={35}
              iconStyle={{ height: 30, width: 30 }}
            />

            <Cards
              onPress={() => {
                navigation.navigate("CouponScreen");
              }}
              buttonCard
              buttonTitle="Share"
              buttonSubHeading="Share testing status"
              fontSize={RFPercentage(1.7)}
              iconShow
              customStyles={{ width: "49%" }}
              sourcedImage={images.handIcon}
              sourcedImageRight={images.phoneIcon}
              iconStyle={{ height: 20, width: 20 }}
            />
          </View>
        ) : (
          <Cards
            onPress={() => navigation.navigate("CouponScreen")}
            buttonCard
            buttonTitle="Test together"
            buttonSubHeading="Invite your friends to test with you"
            fontSize={RFPercentage(1.7)}
            iconShow
          />
        )}

        <Cards
          buttonCard
          buttonTitle="Got questions?"
          buttonSubHeading="Learn more about knō testing"
          customStyles={{ marginVertical: 10 }}
          onPress={() => navigation.navigate("FaqScreen")}
        />

        {order ? (
          <Cards
            buttonCard
            buttonTitle="Complete Test"
            buttonSubHeading="Provide the date and time of your Knō kit"
            customStyles={{ marginVertical: 2 }}
            onPress={handleCompleteTest}
            disabled={handleTimeStamp() === false}
          />
        ) : null}

        {/* <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          {data.map((item) => (
            <HomeScreenItem
              key={item.id}
              id={item.id}
              name={item.name}
              icon={item.icon}
              disabled={item.disabled}
              imgHeight={item.imgHeight}
              imgWidth={item.imgWidth}
              onPress={item.onPress}
            />
          ))}
        </View> */}
      </ScrollView>
    </SV>
  );
};

export default HomeScreen;
