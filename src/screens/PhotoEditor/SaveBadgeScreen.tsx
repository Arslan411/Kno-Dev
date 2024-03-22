import React, { useRef, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  Platform,
  FlatList,
  Linking,
} from "react-native";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import LoginForm from "src/components/forms/LoginForm";
import { SV, Text } from "src/components/Themed";
import AuthHeader from "src/components/AuthHeader";
import { Colors, gradients } from "src/constants/Colors";
import { CommonActions } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Loading } from "src/constants/enums";
import useUserStore from "src/store/userStore";
import useOrderStore from "src/store/orderStore";
import useResultStore from "src/store/resultStore";
import ProfileServices from "src/services/ProfileServices";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { Toast } from "src/components/ToastManager";
import Modal from "react-native-modal";
import { isLoading } from "expo-font";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
import IconButton from "src/components/IconButton";

const SaveBadgeScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"SaveBadgeScreen">) => {
  const image = route.params.uri;
  // console.log(" image===--->", image)

  const [copiedText, setCopiedText] = useState("");
  const user = useUserStore((state) => state.user);
  const order = useOrderStore((state) => state.order);
  const result = useResultStore((state) => state.result);
  const [selectedSticker, setSelectedSticker] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const [imageLoading, setImageLoading] = useState<Loading>(Loading.idle);
  const [imageDownloading, setImageDownloading] = useState<Loading>(
    Loading.idle
  );

  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const ref = useRef<any>();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync("shortlink/username”");
    Toast.success("Profile Link copied!");
    setCopiedText("shortlink/username”");
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

  const captureAndSend = async () => {
    ref.current.capture().then((uri: any) => {
      saveImageToGallery(uri);
    });
  };
  const saveImageToGallery = async (uri: string) => {
    setLoading(true);
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const formData = new FormData();
      const file = {
        uri: uri,
        name: uri.split("/").pop() || "profilePicture.png",
        type: "image/png",
      };
      formData.append("profilePicture", file as any);
      const res = await ProfileServices.updateProfileImage(formData);
      if (res.status === 200) {
        fetchProfile();
        setBottomSheetVisible(true);
        setLoading(false);
        // navigation.navigate("Dashboard");
      }
    } catch (e: any) {
      setLoading(false);
      Alert.alert("Error", e.Error);
      console.log(e);
    }
  };

  const emptyList = () => {
    return (
      <View>
        <Text style={style.emptyTxt}>
          No recommended apps currently installed on your phone!
        </Text>
      </View>
    );
  };

  return (
    <SV
      style={{
        flex: 1,
      }}
    >
      {/* <AuthHeader logoCentered /> */}
      <UserHeader />
      <View style={{ padding: 10 }}>
        <Cards backNavigate headerCard headerTxt="Create your badge!">
          <View>
            <View style={style.innerCard}>
              <View
                style={{
                  marginTop: 8,
                  marginLeft: 9,
                  marginRight: 9,
                  backgroundColor: "#420A32",
                  borderRadius: 10,
                }}
              >
                <View>
                  <View
                    style={{
                      alignItems: "center",
                      marginTop: 9,
                      marginBottom: 7,
                    }}
                  >
                    <View style={style.ImageContainer}>
                      <ViewShot
                        style={{
                          alignSelf: "center",
                        }}
                        ref={ref}
                        options={{ format: "jpg", quality: 1 }}
                      >
                        <Image
                          source={{ uri: image }}
                          style={{
                            height: RFPercentage(38),
                            width: RFPercentage(25),
                            borderRadius: 10,
                          }}
                        />
                      </ViewShot>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    position: "absolute",
                    end: 2,
                  }}
                >
                  <Image
                    source={require("../../assets/button.png")}
                    style={{ width: 50, height: 50 }}
                  />
                </View>
              </View>

              <Text style={style.InstructionText}>
                Share your photo or share a link to your profile
              </Text>

              {/* <Text textType="bold" style={style.linkheadingtext}>
                        Profile page link
                    </Text>

                    <Text style={style.linkheadingtext}>
                        “I knō I’m tested -
                        <Text textType="bold" style={style.linkheadingtext}>shortlink/username”</Text>
                    </Text> */}
            </View>

            <View
              style={{
                // flexDirection: "row",
                // gap: 8,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              {/* <IconButton
                disabled
                unCheckedLabel="Copy Profile Link"
                width={RFPercentage(19)}
                height={RFPercentage(5.3)}
                fontSize={RFPercentage(1.85)}
                // onPress={copyToClipboard}
              /> */}
              <IconButton
                checked
                checkedLabel="Save Badge"
                width={RFPercentage(23)}
                height={RFPercentage(6)}
                fontSize={RFPercentage(1.85)}
                onPress={captureAndSend}
                loading={loading}
              />
            </View>
          </View>
        </Cards>
      </View>

      <Modal
        isVisible={isBottomSheetVisible}
        onBackdropPress={() => {
          setBottomSheetVisible(false);
        }}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
        backdropOpacity={0}
      >
        <View style={style.modalContent}>
          <View style={style.headerDivider} />
          <Text style={style.headerTxt}>1 item</Text>
          <Text style={style.imgSizeTxt}>204.35 KB</Text>
          <View style={style.divider} />
          <FlatList
            data={installedApps}
            horizontal
            ListEmptyComponent={emptyList}
            keyExtractor={(item: any, index: any) => item.id + index}
            renderItem={({ item }: any) => (
              <Pressable
                style={style.listContainer}
                onPress={() => Linking.openURL(item?.route)}
              >
                <Image style={style.logo} source={item?.logo} />
                <Text style={style.name}>{item?.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </SV>
  );
};

export default SaveBadgeScreen;

const style = StyleSheet.create({
  headingText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  innerCard: {
    margin: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
  },
  InstructionText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.25,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  ImageContainer: {
    height: RFPercentage(38),
    width: RFPercentage(25),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  CloseBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    width: 155,
    height: 46,
    borderRadius: 100,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  CloseText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.5,
  },
  linkheadingtext: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.25,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  modalContent: {
    backgroundColor: "#131313",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: RFPercentage(33),
  },
  headerDivider: {
    alignSelf: "center",
    height: 2,
    width: "5%",
    backgroundColor: "grey",
    borderRadius: 20,
    top: 6,
  },
  headerTxt: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: RFPercentage(2.5),
    marginLeft: 12,
    marginTop: 20,
  },
  imgSizeTxt: {
    color: "grey",
    fontSize: RFPercentage(1.5),
    fontWeight: "500",
    marginLeft: 12,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "grey",
    marginVertical: 20,
  },
  emptyTxt: {
    color: "white",
    fontSize: RFPercentage(2),
    width: "80%",
    marginLeft: 20,
  },
  name: {
    color: Colors.white,
    fontSize: RFPercentage(2),
    textAlign: "center",
    marginTop: 8,
  },
  listContainer: { margin: 10 },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 60,
  },
});
