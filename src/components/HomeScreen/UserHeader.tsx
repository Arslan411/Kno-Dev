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

const UserHeader = () => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const user = useUserStore((state) => state.user);
  const isFirstTime = useUserStore((state) => state.isFirstTime);
  const width = Dimensions.get("window").width;
  const result = useResultStore((state) => state.result);
  const order = useOrderStore((state) => state.order);

  const fetchStatusBarHeight = () => {
    if (Platform.OS === "android") {
      if (StatusBar.currentHeight) return StatusBar.currentHeight;
    } else {
      return Constants.statusBarHeight;
    }
  };
  const navigate = async () => {
    setLoading(Loading.loading);
    if (order !== null && order?.status === OrderStatus.Released) {
      // navigation.navigate("ImagePicker");
      // navigation.navigate("LetsDo");
      navigation.navigate("DoDont");
      setLoading(Loading.idle);
    } else {
      setLoading(Loading.error);
      navigation.navigate("DoDont");
      // navigation.navigate("LetsDo");
      // navigation.navigate("GetTest");
    }
  };

  const navigation = useNavigation<StackNavigation>();

  const name = user?.firstName + " " + user?.lastName;
  return (
    <View
      style={{
        width: width,
        height: RFPercentage(12),
        borderBottomWidth: 1,
        borderColor: Colors.primary,
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
          padding: 16,
          borderRadius: 6,
          paddingTop:
            Platform?.OS === "ios"
              ? fetchStatusBarHeight()
              : fetchStatusBarHeight() + 2,

          justifyContent: "space-between",
        }}
      >
        <Logo height={RFPercentage(9)} width={RFPercentage(8)} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "27%",
          }}
        >
          <Pressable
            // disabled={order === null}
            onPress={() => {
              if (user?.profilePic) {
                // navigation.navigate("ImagePicker");
                // navigation.navigate("LetsDo");
                navigate();
              } else {
                navigate();
              }
            }}
            style={{
              height: 40,
              width: 40,
              borderWidth: 2.4,
              borderRadius: 30,
              borderColor: Colors.primary,

              // opacity: order === null ? 0.5 : 1,
              justifyContent: "center",
              alignItems: "center",
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
                    borderColor: Colors.velvet,
                    // borderBottomLeftRadius: 6,
                    // borderBottomRightRadius: 6,
                    height: 36,
                    width: 36,
                    borderRadius: 30,
                  }}
                />
              </>
            ) : (
              <Image
                style={{ height: 22, width: 22, tintColor: Colors.primary }}
                source={require("../../assets/userIcon.png")}
              />
            )}
          </Pressable>

          {!user ? (
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Image
                style={{ height: 32, width: 32, marginRight: 8 }}
                source={require("../../assets/login.png")}
              />
            </Pressable>
          ) : (
            <Pressable>
              <Image
                style={{ height: 55, width: 55 }}
                source={require("../../assets/tag.png")}
              />
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default memo(UserHeader);
