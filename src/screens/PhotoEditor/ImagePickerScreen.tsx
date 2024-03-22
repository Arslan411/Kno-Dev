import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Image,
  Alert,
  Linking,
  PermissionsAndroid,
  FlatList,
} from "react-native";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import { SV, Text } from "src/components/Themed";
import ImagePicker, {
  Image as CropPickerImage,
} from "react-native-image-crop-picker";
import { Platform } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, gradients } from "src/constants/Colors";
import AuthHeader from "src/components/AuthHeader";
import useUserStore from "src/store/userStore";
import ProfileServices from "src/services/ProfileServices";
import { Loading, OrderStatus, StatusCode } from "src/constants/enums";
import * as MediaLibrary from "expo-media-library";
import BigColoredButton from "src/components/BigColoredButton";
import { Toast } from "src/components/ToastManager";
import RNFetchBlob from "rn-fetch-blob";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import Modal from "react-native-modal";
import useOrderStore from "src/store/orderStore";
// import CustomButton from "src/components/CustomButton/CustomButton";
// import GradientButton from "src/components/CustomButton/GradientButton";
import useResultStore from "src/store/resultStore";
import ViewShot from "react-native-view-shot";
import { WebViewModal } from "src/components/WebviewModel";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
import IconButton from "src/components/IconButton";
import { useModal } from "src/components/GlobalModal/GlobalModal";

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
            marginBottom: "114%",
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

const ImagePickerScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"ImagePicker">) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [modelVisible, setModelVisible] = useState(false);
  const user = useUserStore((state) => state.user);
  const order = useOrderStore((state) => state.order);
  const result = useResultStore((state) => state.result);
  const [selectedSticker, setSelectedSticker] = useState<any>(null);
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [imageLoading, setImageLoading] = useState<Loading>(Loading.idle);
  const [imageDownloading, setImageDownloading] = useState<Loading>(
    Loading.idle
  );
  const { showModal, closeModal } = useModal();

  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const ref = useRef<any>();

  const badgeList = [
    { id: 1, uri: require("../../assets/sticker5.png") },
    { id: 2, uri: require("../../assets/sticker6.png") },
    { id: 3, uri: require("../../assets/sticker3.png") },
    { id: 4, uri: require("../../assets/sticker3.png") },
    { id: 5, uri: require("../../assets/sticker2.png") },
    { id: 6, uri: require("../../assets/gradientLogo.png") },
  ];

  useEffect(() => {
    setSelectedSticker({
      id: 6,
      uri: require("../../assets/gradientLogo.png"),
    });
  }, []);

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

  const imageUrl = `${user?.profilePic}`;

  const checkPermission = async () => {
    setBottomSheetVisible(true);
    if (Platform.OS === "android" && Platform.Version <= 32) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message:
              "App needs access to your storage to download Photos and Videos",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadImage();
        } else {
          Alert.alert(
            "Permissions needed",
            "App needs access to your storage to download Photos and Videos",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },

              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    } else {
      downloadImage();
    }
  };

  const downloadImage = () => {
    setImageDownloading(Loading.loading);
    let date = new Date();
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          "/kno_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ".png",
        description: "knō",
      },
    };
    config(options)
      .fetch("GET", imageUrl)
      .then((res) => {
        if (Platform.OS === "ios") {
          saveToCameraRoll(res.path());
        }
        setImageDownloading(Loading.idle);
        Toast.success("Image Downloaded Successfully.");
      })
      .catch((err) => {
        setImageDownloading(Loading.idle);
        Toast.error("Error in downloading image.");
      });
  };

  const saveToCameraRoll = (imagePath: string) => {
    CameraRoll.saveToCameraRoll(imagePath, "photo")
      .then(() => {
        console.log("Image saved to Camera Roll on iOS");
      })
      .catch((error) => {
        console.log("Error saving image to Camera Roll on iOS", error);
      });
  };

  const deleteProfilePicture = async () => {
    setLoading(Loading.loading);
    try {
      const res = await ProfileServices.deleteProfileImage();
      if (res.status === 200) {
        fetchProfile();
        setLoading(Loading.idle);
      }
    } catch (error: any) {
      setLoading(Loading.idle);
      useUserStore.setState({
        user: {
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          primaryEmail: user?.primaryEmail ?? "",
          referringEmail: user?.referringEmail ?? "",
          profilePic: null,
          address1: user?.address1 ?? "",
          address2: user?.address2 ?? "",
          city: user?.city ?? "",
          state: user?.state ?? "",
          zipCode: user?.zipCode ?? "",
          mobile: user?.mobile ?? "",
        },
      });
    }
  };

  const pickAndCropImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissions needed",
        "Please allow access to your photos to continue",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },

          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return;
    } else {
      ImagePicker.openPicker({
        width: 700,
        height: 1000,
        cropping: true,
        cropperActiveWidgetColor: Colors.primaryLight,
        cropperStatusBarColor: Colors.primaryLight,
        cropperToolbarColor: Colors.white,
        cropperToolbarWidgetColor: Colors.velvet,
        cropperTintColor: Colors.velvet,
        // cropperChooseColor: Colors.velvet,
        cropperToolbarTitle: "Crop Image",
        cropperChooseText: "Choose",
        cropperCancelText: "Cancel",
        forceJpg: false,
        maxFiles: 1,
        mediaType: "photo",
        cropperAspectRatio: [7, 10],
      })
        .then((image: CropPickerImage) => {
          setPhoto(image.path);
          // navigation.navigate("PhotoEditor", { uri: image.path });
        })
        .catch((error: Error) => {
          console.log(error);
        });
    }
  };

  const captureAndSend = async () => {
    ref.current.capture().then((uri: any) => {
      // saveImageToGallery(uri);
      navigation.navigate("SaveBadgeScreen", { uri: uri });
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

  const emptyList = () => {
    return (
      <View>
        <Text style={style.emptyTxt}>
          No recommended apps currently installed on your phone!
        </Text>
      </View>
    );
  };

  const HeaderText =
    order && order?.status === OrderStatus.Released
      ? "Awaiting your results"
      : photo
      ? "Create your badge!"
      : "You'll need a kit";

  // const InnerCardText =
  //   order && order?.status !== OrderStatus.Released
  //     ? photo
  //       ? "Be sure to share your photo on your favorite dating app"
  //       : "Your results aren't in yet, once they are you'll be able to save and share your badge."
  //     : "You'll need to order a kit and get your results before you can create your badge. You can learn more about badge creation below.";

  const InnerCardText =
    order && order?.status === OrderStatus.Released
      ? "Your results aren't in yet, once they are you'll be able to save and share your badge."
      : photo
      ? "Be sure to share your photo on your favorite dating app"
      : "You'll need to order a kit and get your results before you can create your badge. You can learn more about badge creation below.";

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
  return (
    <SV>
      <UserHeader />
      <ScrollView
        style={style.container}
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(16) + 64
              : RFPercentage(16) + 48,
        }}
      >
        <View style={style.innerContainer}>
          <Cards backNavigate headerCard headerTxt={HeaderText}>
            <View style={style.innerCard}>
              <Pressable
                onPress={pickAndCropImage}
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
                        {photo ? (
                          <Image
                            source={{ uri: photo }}
                            style={{
                              height: RFPercentage(38),
                              width: RFPercentage(25),
                              borderRadius: 10,
                            }}
                          />
                        ) : (
                          <Image
                            source={require("../../assets/grouppicker.png")}
                            style={{
                              height: RFPercentage(38),
                              width: RFPercentage(25),
                              borderRadius: 10,
                            }}
                          />
                        )}

                        {/* <View
                        style={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          zIndex: 3,
                        }}
                      >
                        <Image
                          source={require("../../assets/kno5.png")}
                          style={{
                            width: RFPercentage(8.9),
                            height: RFPercentage(3.6),
                          }}
                        />
                      </View>

                      <View
                        style={{
                          position: "absolute",
                          top: "42%",
                          zIndex: 3,
                          alignSelf: "center",
                        }}
                      >
                        <Image
                          source={require("../../assets/kno5.png")}
                          style={{
                            width: RFPercentage(8.9),
                            height: RFPercentage(3.6),
                          }}
                        />
                      </View>

                      <View
                        style={{
                          position: "absolute",
                          bottom: 2,
                          end: 2,
                          margin: 5,
                          zIndex: 3,
                        }}
                      >
                        <Image
                          source={require("../../assets/kno5.png")}
                          style={{
                            width: RFPercentage(8.9),
                            height: RFPercentage(3.6),
                          }}
                        />
                      </View> */}

                        <View style={style.cornerBadge}>
                          <ZoomImg imgSource={selectedSticker?.uri} />
                        </View>
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
              </Pressable>

              <View style={style.badgeContainer}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {badgeList.map((sticker: any) => (
                      <View style={{}}>
                        <Pressable
                          key={sticker.id}
                          onPress={() => setSelectedSticker(sticker)}
                        >
                          {selectedSticker?.id === sticker.id ? (
                            <View
                              style={{
                                borderWidth: 1,
                                borderRadius: 5,
                                alignItems: "center",
                                paddingRight: 6,
                                borderColor: Colors.primary,
                                paddingLeft: 6,
                              }}
                            >
                              <Image
                                source={sticker.uri}
                                style={style.knoSticker}
                              />
                            </View>
                          ) : (
                            <View style={{}}>
                              <Image
                                source={sticker.uri}
                                style={style.knoSticker}
                              />
                            </View>
                          )}
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <Text style={style.InstructionText}>{InnerCardText}</Text>
            </View>

            {order && order?.status === OrderStatus.Released ? (
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  top: 1,
                }}
              >
                <IconButton
                  unCheckedLabel="Learn"
                  width={RFPercentage(16)}
                  height={58}
                  onPress={() => setModelVisible(true)}
                />
                <IconButton
                  checked
                  checkedLabel={"Save"}
                  width={RFPercentage(16)}
                  height={58}
                  opacity={photo == null ? 0.5 : 1}
                  disabled={photo == null}
                  onPress={captureAndSend}
                />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  top: 1,
                }}
              >
                <IconButton
                  checkedIcon
                  width={RFPercentage(19)}
                  // height={RFPercentage(5.5)}
                  checked
                  checkedLabel={"Get tested"}
                  height={58}
                  onPress={handleCheckOrderStatus}
                />
                <IconButton
                  unCheckedLabel="Learn"
                  width={RFPercentage(16)}
                  height={58}
                  onPress={() => setModelVisible(true)}
                />
              </View>
            )}
            {modelVisible && (
              <WebViewModal
                onClose={() => setModelVisible(false)}
                link={"https://kno.co/"}
              />
            )}
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
      </ScrollView>
    </SV>
  );
};
export default ImagePickerScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 12,
    alignContent: "center",
  },
  innerContainer: {
    // padding: 10,
  },
  image: {
    height: RFPercentage(34),
    width: RFPercentage(25),
    borderRadius: 12,
    alignSelf: "center",
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
  logo: {
    height: 60,
    width: 60,
    borderRadius: 60,
  },
  SplashCard: {
    margin: 8,
    borderWidth: 1,
    borderBottomWidth: 5,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
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
  cornerBadge: {
    position: "absolute",
    height: RFPercentage(38),
    width: RFPercentage(25),
    alignSelf: "flex-start",
    borderRadius: 10,
    overflow: "hidden",
  },
  badgeContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.primary,
    flexDirection: "row",
    padding: 8,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  knoSticker: {
    // width: Platform.OS === "ios" ? 110 : 80,
    // height: Platform.OS === "ios" ? 75 : 50,
    width: 70,
    height: 40,
    resizeMode: "contain",
  },
  InstructionText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: RFPercentage(1.9),
    lineHeight: 25.5,
    letterSpacing: 0.25,
    marginBottom: 10,
    width: "95%",
    alignSelf: "center",
  },
  ImageContainer: {
    height: RFPercentage(38),
    width: RFPercentage(25),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  CloseBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    width: 100,
    height: 40,
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
});

// previous code

// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   ScrollView,
//   View,
//   Pressable,
//   Image,
//   Alert,
//   Linking,
//   ActivityIndicator,
//   PermissionsAndroid,
//   FlatList,
// } from "react-native";
// import { HomeStackScreenProps } from "src/types/NavigationTypes";
// import { SV, Text } from "src/components/Themed";
// import ImagePicker, {
//   Image as CropPickerImage,
// } from "react-native-image-crop-picker";
// import { Platform } from "react-native";
// import { RFPercentage } from "react-native-responsive-fontsize";
// import { LinearGradient } from "expo-linear-gradient";
// import { Colors, gradients } from "src/constants/Colors";
// import AuthHeader from "src/components/AuthHeader";
// import useUserStore from "src/store/userStore";
// import ProfileServices from "src/services/ProfileServices";
// import { Loading } from "src/constants/enums";
// import * as MediaLibrary from "expo-media-library";
// import BigColoredButton from "src/components/BigColoredButton";
// import { Toast } from "src/components/ToastManager";
// import RNFetchBlob from "rn-fetch-blob";
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";
// import Modal from "react-native-modal";

// const ImagePickerScreen = ({
//   navigation,
//   route,
// }: HomeStackScreenProps<"ImagePicker">) => {
//   const [photo, setPhoto] = useState<string | null>(null);
//   const user = useUserStore((state) => state.user);
//   const [loading, setLoading] = useState<Loading>(Loading.idle);
//   const [imageLoading, setImageLoading] = useState<Loading>(Loading.idle);
//   const [imageDownloading, setImageDownloading] = useState<Loading>(
//     Loading.idle
//   );

//   const [installedApps, setInstalledApps] = useState<string[]>([]);
//   const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

//   const socialArr = [
//     {
//       id: 1,
//       name: "CMB",
//       route: "cmb://",
//       logo: require("../../assets/cmb.jpg"),
//     },
//     {
//       id: 2,
//       name: "bumble",
//       route: "bumble://",
//       logo: require("../../assets/bumble.png"),
//     },
//     {
//       id: 3,
//       name: "tinder",
//       route: "tinder://",
//       logo: require("../../assets/tinder.png"),
//     },
//     {
//       id: 4,
//       name: "hinge",
//       route: "hinge://",
//       logo: require("../../assets/hinge.png"),
//     },
//     {
//       id: 5,
//       name: "feeld",
//       route: "feeld://",
//       logo: require("../../assets/feedld.jpeg"),
//     },
//     {
//       id: 6,
//       name: "OKCupid",
//       route: "okcupid://",
//       logo: require("../../assets/okcupid.png"),
//     },
//     {
//       id: 7,
//       name: "Grindr",
//       route: "grindr://",
//       logo: require("../../assets/grindr.png"),
//     },
//     {
//       id: 8,
//       name: "HUD",
//       route: "hud://",
//       logo: require("../../assets/hud.png"),
//     },
//     {
//       id: 9,
//       name: "BLK",
//       route: "blk://",
//       logo: require("../../assets/blk.png"),
//     },
//     {
//       id: 10,
//       name: "Pof",
//       route: "pof://",
//       logo: require("../../assets/pof.png"),
//     },
//     {
//       id: 11,
//       name: "Hily",
//       route: "hily://",
//       logo: require("../../assets/hily.png"),
//     },
//     {
//       id: 12,
//       name: "happn",
//       route: "happn://",
//       logo: require("../../assets/happn.png"),
//     },
//     {
//       id: 13,
//       name: "Pure",
//       route: "pure://",
//       logo: require("../../assets/pure.png"),
//     },
//     {
//       id: 14,
//       name: "HER",
//       route: "her://",
//       logo: require("../../assets/her.png"),
//     },
//     {
//       id: 15,
//       name: "Zoe",
//       route: "zoe://",
//       logo: require("../../assets/zoe.jpeg"),
//     },
//     {
//       id: 16,
//       name: "AM",
//       route: "ashleymadison://",
//       logo: require("../../assets/am.png"),
//     },
//   ];

//   useEffect(() => {
//     socialArr?.forEach((item) => {
//       checkIfAppIsInstalled(item);
//     });
//   }, []);

//   const checkIfAppIsInstalled = async (item: any) => {
//     Linking.canOpenURL(item?.route)
//       .then((supported) => {
//         if (supported) {
//           if (!installedApps.includes(item)) {
//             setInstalledApps((prevApps) => [...prevApps, item]);
//           }
//         }
//       })
//       .catch((error) => console.error("error of installed apps", error));
//   };

//   const fetchProfile = async () => {
//     try {
//       const response = await ProfileServices.fetchProfile();
//       if (response.status === 200) {
//         useUserStore.setState({
//           user: {
//             firstName: response.data.data[0].firstName,
//             lastName: response.data.data[0].lastName,
//             primaryEmail: response.data.data[0].primaryEmail,
//             referringEmail: response.data.data[0].referringEmail,
//             profilePic:
//               response.data.data[0].profilePic !== null
//                 ? `${response.data.data[0].profilePic}?q=${Date.now()}`
//                 : null,
//             address1: response.data.data[0].address1 ?? "",
//             address2: response.data.data[0].address2 ?? "",
//             city: response.data.data[0].city ?? "",
//             state: response.data.data[0].state ?? "",
//             zipCode: response.data.data[0].zip ?? "",
//             mobile: response.data.data[0].mobile,
//           },
//         });
//       }
//     } catch (error: any) {
//       console.log(error.response.data.message);
//     }
//   };

//   const imageUrl = `${user?.profilePic}`;

//   const checkPermission = async () => {
//     setBottomSheetVisible(true);
//     if (Platform.OS === "android" && Platform.Version <= 32) {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: "Storage Permission Required",
//             message:
//               "App needs access to your storage to download Photos and Videos",
//             buttonPositive: "OK",
//           }
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           downloadImage();
//         } else {
//           Alert.alert(
//             "Permissions needed",
//             "App needs access to your storage to download Photos and Videos",
//             [
//               {
//                 text: "Cancel",
//                 onPress: () => console.log("Cancel Pressed"),
//                 style: "cancel",
//               },

//               {
//                 text: "Open Settings",
//                 onPress: () => Linking.openSettings(),
//               },
//             ]
//           );
//         }
//       } catch (err) {
//         // To handle permission related exception
//         console.warn(err);
//       }
//     } else {
//       downloadImage();
//     }
//   };

//   const downloadImage = () => {
//     setImageDownloading(Loading.loading);
//     let date = new Date();
//     const { config, fs } = RNFetchBlob;
//     let PictureDir = fs.dirs.PictureDir;
//     let options = {
//       fileCache: true,
//       addAndroidDownloads: {
//         useDownloadManager: true,
//         notification: true,
//         path:
//           PictureDir +
//           "/kno_" +
//           Math.floor(date.getTime() + date.getSeconds() / 2) +
//           ".png",
//         description: "knō",
//       },
//     };
//     config(options)
//       .fetch("GET", imageUrl)
//       .then((res) => {
//         if (Platform.OS === "ios") {
//           saveToCameraRoll(res.path());
//         }
//         setImageDownloading(Loading.idle);
//         Toast.success("Image Downloaded Successfully.");
//       })
//       .catch((err) => {
//         setImageDownloading(Loading.idle);
//         Toast.error("Error in downloading image.");
//       });
//   };

//   const saveToCameraRoll = (imagePath: string) => {
//     CameraRoll.saveToCameraRoll(imagePath, "photo")
//       .then(() => {
//         console.log("Image saved to Camera Roll on iOS");
//       })
//       .catch((error) => {
//         console.log("Error saving image to Camera Roll on iOS", error);
//       });
//   };

//   const deleteProfilePicture = async () => {
//     setLoading(Loading.loading);
//     try {
//       const res = await ProfileServices.deleteProfileImage();
//       if (res.status === 200) {
//         fetchProfile();
//         setLoading(Loading.idle);
//       }
//     } catch (error: any) {
//       setLoading(Loading.idle);
//       useUserStore.setState({
//         user: {
//           firstName: user?.firstName ?? "",
//           lastName: user?.lastName ?? "",
//           primaryEmail: user?.primaryEmail ?? "",
//           referringEmail: user?.referringEmail ?? "",
//           profilePic: null,
//           address1: user?.address1 ?? "",
//           address2: user?.address2 ?? "",
//           city: user?.city ?? "",
//           state: user?.state ?? "",
//           zipCode: user?.zipCode ?? "",
//           mobile: user?.mobile ?? "",
//         },
//       });
//     }
//   };

//   const pickAndCropImage = async () => {
//     const { status } = await MediaLibrary.requestPermissionsAsync();

//     if (status !== "granted") {
//       Alert.alert(
//         "Permissions needed",
//         "Please allow access to your photos to continue",
//         [
//           {
//             text: "Cancel",
//             onPress: () => console.log("Cancel Pressed"),
//             style: "cancel",
//           },

//           {
//             text: "Open Settings",
//             onPress: () => Linking.openSettings(),
//           },
//         ]
//       );
//       return;
//     } else {
//       ImagePicker.openPicker({
//         width: 700,
//         height: 1000,
//         cropping: true,
//         cropperActiveWidgetColor: Colors.primaryLight,
//         cropperStatusBarColor: Colors.primaryLight,
//         cropperToolbarColor: Colors.white,
//         cropperToolbarWidgetColor: Colors.velvet,
//         cropperTintColor: Colors.velvet,
//         // cropperChooseColor: Colors.velvet,
//         cropperToolbarTitle: "Crop Image",
//         cropperChooseText: "Choose",
//         cropperCancelText: "Cancel",
//         forceJpg: false,
//         maxFiles: 1,
//         mediaType: "photo",
//         cropperAspectRatio: [7, 10],
//       })
//         .then((image: CropPickerImage) => {
//           setPhoto(image.path);
//           navigation.navigate("PhotoEditor", { uri: image.path });
//         })
//         .catch((error: Error) => {
//           console.log(error);
//         });
//     }
//   };

//   const emptyList = () => {
//     return (
//       <View>
//         <Text style={style.emptyTxt}>
//           No recommended apps currently installed on your phone!
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <SV>
//       <AuthHeader text="Step 2/4" subText="Choose A Photo" />
//       <ScrollView
//         style={style.container}
//         contentContainerStyle={{
//           paddingBottom:
//             Platform.OS === "ios"
//               ? RFPercentage(16) + 64
//               : RFPercentage(16) + 48,
//         }}
//       >
//         {user?.profilePic && (
//           <View
//             style={{
//               height: RFPercentage(45),
//               borderRadius: 10,
//               borderWidth: 1,
//               borderBottomWidth: 4,
//               borderColor: Colors.velvet,
//             }}
//           >
//             <LinearGradient
//               colors={gradients.primary}
//               start={[0, 0]}
//               end={[1, 1]}
//               style={{
//                 flex: 1,
//                 borderRadius: 10,
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               {imageLoading === Loading.loading && (
//                 <View
//                   style={{
//                     position: "absolute",
//                     zIndex: 1,
//                     width: "100%",
//                     height: "100%",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <ActivityIndicator
//                     size="large"
//                     color={Colors.velvet}
//                     animating={true}
//                   />
//                 </View>
//               )}

//               <Image
//                 style={style.image}
//                 source={{
//                   uri: user.profilePic,
//                 }}
//                 onLoadStart={() => setImageLoading(Loading.loading)}
//                 onLoadEnd={() => setImageLoading(Loading.idle)}
//               />
//             </LinearGradient>
//           </View>
//         )}

//         {user?.profilePic && (
//           <>
//             <BigColoredButton
//               isLoading={loading === Loading.loading}
//               style={{ marginTop: 12 }}
//               text="Delete Profile Picture"
//               onPress={() => {
//                 Alert.alert(
//                   "Delete Profile Picture",
//                   "Are you sure you want to delete your profile picture?",
//                   [
//                     {
//                       text: "Cancel",
//                       onPress: () => console.log("Cancel Pressed"),
//                       style: "cancel",
//                     },
//                     {
//                       text: "Delete",
//                       onPress: () => deleteProfilePicture(),
//                     },
//                   ]
//                 );
//               }}
//             />
//             <BigColoredButton
//               isLoading={imageDownloading === Loading.loading}
//               style={{ marginTop: 12 }}
//               text="Download And Share Profile Pic"
//               onPress={checkPermission}
//             />
//             <BigColoredButton
//               style={{ marginTop: 12 }}
//               text="Choose Another Image"
//               onPress={pickAndCropImage}
//             />
//           </>
//         )}

//         {!user?.profilePic && (
//           <View
//             style={{
//               height: RFPercentage(62),
//               borderRadius: 10,
//               borderWidth: 1,
//               borderBottomWidth: 4,
//               borderColor: Colors.velvet,
//               marginTop: "8%",
//             }}
//           >
//             <LinearGradient
//               colors={gradients.primary}
//               start={[0, 0]}
//               end={[1, 1]}
//               style={{
//                 flex: 1,
//                 borderRadius: 10,
//                 padding: 10,
//                 justifyContent: "center",
//                 // alignItems: "center",
//               }}
//             >
//               <Pressable
//                 onPress={pickAndCropImage}
//                 style={{
//                   height: RFPercentage(6.5),
//                   borderWidth: 1,
//                   borderColor: Colors.velvet,
//                   borderBottomWidth: 4,
//                   borderRadius: 10,
//                   marginHorizontal: "8%",
//                 }}
//               >
//                 <LinearGradient
//                   colors={gradients.primary}
//                   start={[0, 0.3]}
//                   end={[0, 1]}
//                   style={{
//                     flex: 1,
//                     padding: 12,
//                     borderRadius: 10,
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Text
//                     textType="LBBold"
//                     style={{
//                       fontSize: RFPercentage(1.85),
//                       color: Colors.velvet,
//                     }}
//                   >
//                     Choose An Image To Start
//                   </Text>
//                 </LinearGradient>
//               </Pressable>
//             </LinearGradient>
//           </View>
//         )}

//         <Modal
//           isVisible={isBottomSheetVisible}
//           onBackdropPress={() => {
//             setBottomSheetVisible(false);
//             // navigation.navigate("Dashboard");
//           }}
//           style={{
//             justifyContent: "flex-end",
//             margin: 0,
//           }}
//           backdropOpacity={0}
//         >
//           <View style={style.modalContent}>
//             <View style={style.headerDivider} />
//             <Text style={style.headerTxt}>1 item</Text>
//             <Text style={style.imgSizeTxt}>204.35 KB</Text>
//             <View style={style.divider} />
//             <FlatList
//               data={installedApps}
//               horizontal
//               ListEmptyComponent={emptyList}
//               keyExtractor={(item: any, index: any) => item.id + index}
//               renderItem={({ item }: any) => (
//                 <Pressable
//                   style={style.listContainer}
//                   onPress={() => Linking.openURL(item?.route)}
//                 >
//                   <Image style={style.logo} source={item?.logo} />
//                   <Text style={style.name}>{item?.name}</Text>
//                 </Pressable>
//               )}
//             />
//           </View>
//         </Modal>
//       </ScrollView>
//     </SV>
//   );
// };

// export default ImagePickerScreen;

// const style = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginHorizontal: 12,
//     marginTop: 12,
//     alignContent: "center",
//   },
//   image: {
//     height: RFPercentage(34),
//     width: RFPercentage(25),
//     borderRadius: 12,
//     alignSelf: "center",
//   },
//   openPicker: {
//     margin: 12,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   titleOpen: {
//     color: "#fff",
//     fontWeight: "bold",
//     padding: 12,
//   },
//   modalContent: {
//     backgroundColor: "#131313",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: RFPercentage(33),
//   },
//   headerTxt: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: RFPercentage(2.5),
//     marginLeft: 12,
//     marginTop: 20,
//   },
//   name: {
//     color: Colors.white,
//     fontSize: RFPercentage(2),
//     textAlign: "center",
//     marginTop: 8,
//   },
//   listContainer: { margin: 10 },
//   imgSizeTxt: {
//     color: "grey",
//     fontSize: RFPercentage(1.5),
//     fontWeight: "500",
//     marginLeft: 12,
//     marginTop: 3,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "grey",
//     marginVertical: 20,
//   },
//   headerDivider: {
//     alignSelf: "center",
//     height: 2,
//     width: "5%",
//     backgroundColor: "grey",
//     borderRadius: 20,
//     top: 6,
//   },
//   emptyTxt: {
//     color: "white",
//     fontSize: RFPercentage(2),
//     width: "80%",
//     marginLeft: 20,
//   },
//   logo: {
//     height: 60,
//     width: 60,
//     borderRadius: 60,
//   },
// });
