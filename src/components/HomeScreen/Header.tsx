import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StatusBar,
  View,
} from "react-native";
import React, { memo, useState } from "react";
import { Text } from "src/components/Themed";
import Logo from "src/assets/Logo";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { Colors, gradients } from "src/constants/Colors";
import useUserStore from "src/store/userStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "src/types/NavigationTypes";
import { RFPercentage } from "react-native-responsive-fontsize";
import useOrderStore from "src/store/orderStore";
import { Loading, OrderStatus } from "src/constants/enums";
import { useModal } from "../GlobalModal/GlobalModal";
import useResultStore from "src/store/resultStore";

const HomeHeader = () => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const user = useUserStore((state) => state.user);
  const isFirstTime = useUserStore((state) => state.isFirstTime);
  const width = Dimensions.get("window").width;
  const result = useResultStore((state) => state.result);
  const order = useOrderStore((state) => state.order);
  const { showModal, closeModal } = useModal();

  const fetchStatusBarHeight = () => {
    if (Platform.OS === "android") {
      if (StatusBar.currentHeight) return StatusBar.currentHeight;
    } else {
      return Constants.statusBarHeight;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.toLocaleString("default", {
      month: "numeric",
    })}/${d.getDate()}/${d.getFullYear()}`;
  };

  const navigate = async () => {
    setLoading(Loading.loading);
    if (order !== null && order?.status === OrderStatus.Released) {
      // navigation.navigate("ImagePicker");
      navigation.navigate("LetsDo");
      setLoading(Loading.idle);
    } else {
      setLoading(Loading.error);
      // navigation.navigate("LetsDo");
      navigation.navigate("GetTest");
      // showModal({
      //   isVisible: true,
      //   heading: "Not Yet!",
      //   body: "If you want to add the knō badge to your dating profile pics you have to actually knō first (that’s kind of the whole point).",
      //   anotherBody:
      //     "Don’t worry though, just click the button below to order a test and you’ll be on your way to swiping with confidence.",
      //   buttonText: "Get Tested",
      //   onClose: () => {
      //     closeModal();
      //     navigation.navigate("TestContent");
      //   },
      // });
    }
  };

  const navigation = useNavigation<StackNavigation>();

  const name = user?.firstName + " " + user?.lastName;

  return (
    <View
      style={{
        width: width,
        height: RFPercentage(25),
        borderRadius: 10,
        borderWidth: 2,
        borderBottomWidth: 6,
        borderColor: Colors.velvet,
        zIndex: 5,
      }}
    >
      <LinearGradient
        colors={gradients.primary}
        start={[0.0, 0.0]}
        end={[1.0, 1.0]}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          padding: 16,
          borderRadius: 6,
          paddingTop: fetchStatusBarHeight(),
        }}
      >
        <Pressable
          // disabled={order === null}
          onPress={() => {
            if (user?.profilePic) {
              // navigation.navigate("ImagePicker");
              navigation.navigate("LetsDo");
            } else {
              navigate();
            }
          }}
          style={{
            height: RFPercentage(14),
            width: user?.profilePic ? RFPercentage(9.8) : RFPercentage(14),
            borderWidth: 1,
            borderRadius: 10,
            borderColor: Colors.velvet,
            borderBottomWidth: 4,
            opacity: order === null ? 0.5 : 1,
            justifyContent: "center",
          }}
        >
          {loading === Loading.loading ? (
            <ActivityIndicator
              color={Colors.velvet}
              size="large"
              style={{
                alignSelf: "center",
              }}
            />
          ) : user?.profilePic ? (
            <>
              <Image
                source={{
                  uri: user?.profilePic,
                }}
                style={{
                  flex: 1,
                  // marginTop: 1,
                  borderColor: Colors.velvet,
                  borderRadius: 9,
                  borderBottomLeftRadius: 6,
                  borderBottomRightRadius: 6,
                }}
              />
            </>
          ) : (
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                flex: 1,
                flexDirection: "row",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                textType="LBRegular"
                numberOfLines={1}
                style={{
                  fontSize: RFPercentage(2),
                  color: Colors.velvet,
                }}
              >
                Add Photo
              </Text>
            </LinearGradient>
          )}
        </Pressable>

        <View
          style={{
            flex: 1,
            gap: 8,
          }}
        >
          <Logo />
          <Text
            textType="LBRegular"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: RFPercentage(2.5),
              color: Colors.velvet,
              letterSpacing: -0.41,
              textTransform: "capitalize",
            }}
          >
            {name}
          </Text>
          <Text
            textType="regular"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: RFPercentage(2.5),
              color: Colors.velvet,
            }}
          >
            {order?.resultsReleasedOn
              ? `Last tested ${formatDate(order.resultsReleasedOn)}`
              : `Not Tested`}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default memo(HomeHeader);
