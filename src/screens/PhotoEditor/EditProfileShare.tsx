import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import AuthHeader from "src/components/AuthHeader";
import { SV, Text } from "src/components/Themed";
import { Colors, gradients } from "src/constants/Colors";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import * as MediaLibrary from "expo-media-library";
import { Loading } from "src/constants/enums";
import { useState, useRef, useEffect } from "react";
import ProfileServices from "src/services/ProfileServices";
import useUserStore from "src/store/userStore";
import ViewShot from "react-native-view-shot";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import Modal from "react-native-modal";

const ZoomImg = ({ imgSource }: any) => {
  return (
    <View>
      <View
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <ReactNativeZoomableView
          maxZoom={2}
          pinchToZoomInSensitivity={4}
          pinchToZoomOutSensitivity={4}
          minZoom={1}
          zoomStep={0.5}
          contentWidth={800}
          contentHeight={830}
          bindToBorders
          style={{
            width: Platform.OS === "ios" ? 75 : 60,
            maxHeight: 50,
            alignSelf: "flex-end",
            marginBottom: "105%",
            marginRight: "4%",
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            }}
            source={imgSource}
          />
        </ReactNativeZoomableView>
      </View>
    </View>
  );
};

const EditProfileShare = ({
  navigation,
  route,
}: HomeStackScreenProps<"ShareImage">) => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const photo = route.params.uri;
  const [selectedSticker, setSelectedSticker] = useState<any>(null);
  const ref = useRef<any>();
  const stickerList = [
    { id: 1, uri: require("../../assets/gradientLogo.png") },
    { id: 3, uri: require("../../assets/sticker3.png") },
    { id: 2, uri: require("../../assets/sticker2.png") },
  ];

  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const socialArr = [
    {
      id: 1,
      name: "CMB",
      route: "cmb://",
      logo: require("../../assets/cmb.jpg"),
    },
    {
      id: 2,
      name: "bumble",
      route: "bumble://",
      logo: require("../../assets/bumble.png"),
    },
    {
      id: 3,
      name: "tinder",
      route: "tinder://",
      logo: require("../../assets/tinder.png"),
    },
    {
      id: 4,
      name: "hinge",
      route: "hinge://",
      logo: require("../../assets/hinge.png"),
    },
    {
      id: 5,
      name: "feeld",
      route: "feeld://",
      logo: require("../../assets/feedld.jpeg"),
    },
    {
      id: 6,
      name: "OKCupid",
      route: "okcupid://",
      logo: require("../../assets/okcupid.png"),
    },
    {
      id: 7,
      name: "Grindr",
      route: "grindr://",
      logo: require("../../assets/grindr.png"),
    },
    {
      id: 8,
      name: "HUD",
      route: "hud://",
      logo: require("../../assets/hud.png"),
    },
    {
      id: 9,
      name: "BLK",
      route: "blk://",
      logo: require("../../assets/blk.png"),
    },
    {
      id: 10,
      name: "Pof",
      route: "pof://",
      logo: require("../../assets/pof.png"),
    },
    {
      id: 11,
      name: "Hily",
      route: "hily://",
      logo: require("../../assets/hily.png"),
    },
    {
      id: 12,
      name: "happn",
      route: "happn://",
      logo: require("../../assets/happn.png"),
    },
    {
      id: 13,
      name: "Pure",
      route: "pure://",
      logo: require("../../assets/pure.png"),
    },
    {
      id: 14,
      name: "HER",
      route: "her://",
      logo: require("../../assets/her.png"),
    },
    {
      id: 15,
      name: "Zoe",
      route: "zoe://",
      logo: require("../../assets/zoe.jpeg"),
    },
    {
      id: 16,
      name: "AM",
      route: "ashleymadison://",
      logo: require("../../assets/am.png"),
    },
  ];

  useEffect(() => {
    socialArr?.forEach((item) => {
      checkIfAppIsInstalled(item);
    });
  }, []);

  const checkIfAppIsInstalled = async (item: any) => {
    Linking.canOpenURL(item?.route)
      .then((supported) => {
        if (supported) {
          if (!installedApps.includes(item)) {
            setInstalledApps((prevApps) => [...prevApps, item]);
          }
        }
      })
      .catch((error) => console.error("error of installed apps", error));
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
            mobile: response.data.data[0].mobile,
            address1: response.data.data[0].address1,
            address2: response.data.data[0].address2,
            city: response.data.data[0].city,
            state: response.data.data[0].state,
            zipCode: response.data.data[0].zipCode,
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
    setLoading(Loading.loading);
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
        setLoading(Loading.idle);
        // navigation.navigate("Dashboard");
      }
    } catch (e: any) {
      setLoading(Loading.error);
      Alert.alert("Error", e.Error);
      console.log(e);
    }
  };

  useEffect(() => {
    setSelectedSticker({
      id: 2,
      uri: require("../../assets/gradientLogo.png"),
    });
  }, []);

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
    <SV>
      <AuthHeader subText="Time to Shine" text="" />
      <ScrollView
        scrollEnabled={Platform.OS == "android"}
        showsVerticalScrollIndicator={false}
        style={style.container}
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(16) + 100
              : RFPercentage(16) + 48,
        }}
      >
        <View
          style={{
            height: RFPercentage(70),
            borderRadius: 10,
            borderWidth: 1,
            borderBottomWidth: 4,
            borderColor: Colors.velvet,
            flexDirection: "column",
            justifyContent: "space-around",
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 20,
          }}
        >
          <View style={style.imgContainer}>
            <ViewShot
              style={{
                alignSelf: "center",
              }}
              ref={ref}
              options={{ format: "jpg", quality: 1 }}
            >
              <Image
                style={[style.image]}
                source={{
                  uri: photo,
                }}
              />

              {/* {selectedSticker && (
                <Sticker
                  source={selectedSticker?.uri}
                  imageType={selectedSticker?.type}
                />
              )} */}
              <View
                style={{
                  position: "absolute",
                  height: RFPercentage(36),
                  width: RFPercentage(27.7),
                  alignSelf: "flex-start",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,

                  overflow: "hidden",
                }}
              >
                <ZoomImg imgSource={selectedSticker?.uri} />
              </View>
            </ViewShot>
          </View>

          <View style={style.stickersContainer}>
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={style.gradientContainer}
            >
              <View style={style.row}>
                {stickerList?.map((sticker: any) => (
                  <TouchableOpacity
                    key={sticker.id}
                    onPress={() => setSelectedSticker(sticker)}
                  >
                    <Image source={sticker.uri} style={style.knoStickers} />
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </View>
          <Pressable
            onPress={captureAndSend}
            style={{
              height: RFPercentage(7),
              borderWidth: 1,
              borderColor: Colors.velvet,
              borderBottomWidth: 4,
              borderRadius: 10,
              marginHorizontal: 40,
            }}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading === Loading.loading ? (
                <ActivityIndicator color={Colors.velvet} size="small" />
              ) : (
                <Text
                  textType="LBBold"
                  style={{
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                  }}
                >
                  Download and Share
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        <Modal
          isVisible={isBottomSheetVisible}
          onBackdropPress={() => {
            setBottomSheetVisible(false);
            // navigation.navigate("Dashboard");
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
              style={style.list}
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
      </ScrollView>
    </SV>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 12,
  },
  image: {
    height: RFPercentage(36),
    width: RFPercentage(27.7),
    resizeMode: "cover",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  openPicker: {
    margin: 12,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  titleOpen: {
    color: "#fff",
    fontWeight: "bold",
    padding: 12,
  },
  stickersContainer: {
    borderWidth: 1,
    borderColor: Colors.velvet,
    borderBottomWidth: 7,
    borderRadius: 15,
  },
  gradientContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 15,
    height: RFPercentage(12),
  },
  knoStickers: {
    width: Platform.OS === "ios" ? 110 : 105,
    height: Platform.OS === "ios" ? 75 : 70,
    resizeMode: "contain",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    rowGap: 0.2,
    justifyContent: "space-evenly",
  },
  stickers: {
    width: RFPercentage(5),
    height: RFPercentage(3),
    resizeMode: "contain",
  },
  column: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: RFPercentage(12.7),
  },
  row1: {
    width: RFPercentage(18),
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
    left: 7,
  },
  logoStickers: {
    width: RFPercentage(5),
    height: RFPercentage(4.2),
    resizeMode: "contain",
  },
  imgContainer: {
    height: RFPercentage(37),
    width: RFPercentage(28),
    borderWidth: 2,
    borderColor: Colors.velvet,
    borderBottomWidth: 7,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  modalContent: {
    backgroundColor: "#131313",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: RFPercentage(33),
  },
  headerTxt: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: RFPercentage(2.5),
    marginLeft: 12,
    marginTop: 20,
  },
  name: {
    color: Colors.white,
    fontSize: RFPercentage(2),
    textAlign: "center",
    marginTop: 8,
  },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 60,
  },
  listContainer: { margin: 10 },
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
  list: {
    // bottom: 2,
  },
  headerDivider: {
    alignSelf: "center",
    height: 2,
    width: "5%",
    backgroundColor: "grey",
    borderRadius: 20,
    top: 6,
  },
  emptyTxt: {
    color: "white",
    fontSize: RFPercentage(2),
    width: "80%",
    marginLeft: 20,
  },
});
export default EditProfileShare;
