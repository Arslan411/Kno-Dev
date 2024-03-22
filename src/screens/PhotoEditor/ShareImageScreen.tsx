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
  ImageBackground,
  
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import AuthHeader from "src/components/AuthHeader";
import { SV, Text } from "src/components/Themed";
import { Colors, gradients } from "src/constants/Colors";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import * as MediaLibrary from "expo-media-library";
import { Loading } from "src/constants/enums";
import { useState } from "react";
import ProfileServices from "src/services/ProfileServices";
import useUserStore from "src/store/userStore";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import ViewShot from "react-native-view-shot";

const ZoomImg = ({ imgSource }: any) => {
  return (
    <View
      style={
        {
          // alignItems: "center",
          // justifyContent: "center",
          // backgroundColor: "yellow",
        }
      }
    >
      <View
        style={{
          // height: RFPercentage(27.5),
          // width: RFPercentage(27.4),
          height: "100%",
          width: "100%",
          // marginLeft: "2%",
          // backgroundColor: "red",
        }}
      >
        <ReactNativeZoomableView
          maxZoom={3}
          pinchToZoomInSensitivity={4}
          pinchToZoomOutSensitivity={4}
          minZoom={1}
          zoomStep={0.5}
          contentWidth={700}
          contentHeight={700}
          bindToBorders
          style={{
            width: 40,
            maxHeight: 20,

            alignSelf: "flex-end",
            // justifyContent: "flex-end",
            marginBottom: "70%",
            marginRight: "5%",
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

const Sticker = ({ source, backgroundImageSize, imageType }: any) => {
  const [stickerPosition, setStickerPosition] = useState({ x: 0, y: 0 });
  const stickerPositionAnimated = useRef(
    new Animated.ValueXY(stickerPosition)
  ).current;
  const isDragging = useRef(false);
  const imageWidth =
    imageType == "logo" && Platform.OS === "android"
      ? 211
      : Platform.OS === "android"
      ? 185
      : imageType == "logo" && Platform.OS === "ios"
      ? 250
      : Platform.OS === "ios"
      ? 222
      : 0; // Set the width of your background image
  const imageHeight = Platform.OS === "android" ? 210 : 244; // Set the height of your background image
  const stickerWidth = 20; // Set the width of your sticker
  const stickerHeight = 20; // Set the height of your sticker
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      isDragging.current = true;
    },
    onPanResponderMove: (e, gestureState) => {
      let newX = stickerPosition.x + gestureState.dx;
      let newY = stickerPosition.y + gestureState.dy;
      // Constrain the sticker's position to stay within the image boundaries
      if (newX < 0) {
        newX = 0;
      } else if (newX + stickerWidth > imageWidth) {
        newX = imageWidth - stickerWidth;
      }
      if (newY < 0) {
        newY = 0;
      } else if (newY + stickerHeight > imageHeight) {
        newY = imageHeight - stickerHeight;
      }
      stickerPositionAnimated.setValue({ x: newX, y: newY });
    },
    onPanResponderRelease: () => {
      isDragging.current = false;
      setStickerPosition({
        x: stickerPositionAnimated.x._value,
        y: stickerPositionAnimated.y._value,
      });
    },
  });
  return (
    <View
      style={{
        position: "absolute",
        height: RFPercentage(27.5),
        width: RFPercentage(28),
        alignSelf: "flex-start",
        // backgroundColor: "red",
      }}
    >
      <ZoomImg imgSource={source} />
    </View>
    // <Animated.View
    //   {...panResponder.panHandlers}
    //   style={{
    //     position: "absolute",
    //     transform: stickerPositionAnimated.getTranslateTransform(),
    //   }}
    // >
    //   <Image
    //     source={source}
    //     style={{
    //       height: 30,
    //       resizeMode: "contain",
    //       aspectRatio: imageType === "logo" ? 40 / 40 : 20 / 10,
    //     }}
    //   />
    // </Animated.View>
  );
};
const ShareImageScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"ShareImage">) => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const photo = route.params.uri;

  const navigate = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
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
        setLoading(Loading.idle);
        navigate();
      }
    } catch (e: any) {
      setLoading(Loading.error);
      Alert.alert("Error", e.Error);
    }
  };

  return (
    <SV>
      <AuthHeader text="" subText="" />
      <ScrollView
        style={style.container}
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(16) + 64
              : RFPercentage(16) + 48,
        }}
      >
        <View
          style={{
            padding: 16,
            height: RFPercentage(55),
            borderRadius: 10,
            borderWidth: 1,
            borderBottomWidth: 4,
            borderColor: Colors.velvet,
            gap: 24,
          }}
        >
          <Image
            style={style.image}
            source={{
              uri: photo,
            }}
            source={require("../../assets/imgContainer.png")}
          >
            <ViewShot
              style={{
                // width: Platform.OS === "android" ? 205 : 260,

                alignSelf: "center",
              }}
              ref={ref}
              options={{ format: "jpg", quality: 1 }}
            >
              <Image
                style={[style.image, { transform: [{ skewX: "-0.8deg" }] }]}
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
                  height: RFPercentage(27.5),
                  width: RFPercentage(28),
                  alignSelf: "flex-start",
                }}
              >
                <ZoomImg imgSource={selectedSticker?.uri} />
              </View>
            </ViewShot>
          </ImageBackground>
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
              <View style={style.column}>
                {knoList?.map((sticker: any) => (
                  <TouchableOpacity
                    key={sticker.id}
                    onPress={() => setSelectedSticker(sticker)}
                  >
                    <Image source={sticker.uri} style={style.stickers} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={style.row1}>
                {logoStickers?.map((sticker: any) => (
                  <TouchableOpacity
                    key={sticker.id}
                    onPress={() => setSelectedSticker(sticker)}
                  >
                    <Image
                      source={sticker.uri}
                      style={[
                        style.logoStickers,
                        {
                          height:
                            sticker?.bg == false
                              ? RFPercentage(2.5)
                              : RFPercentage(3.3),
                          width:
                            sticker?.bg == false
                              ? RFPercentage(4)
                              : RFPercentage(4),
                          marginTop: sticker?.bg == false ? 3 : 0,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </View>
          <Pressable
            onPress={() => saveImageToGallery(photo)}
            style={{
              height: RFPercentage(6.5),
              borderWidth: 1,
              borderColor: Colors.velvet,
              borderBottomWidth: 4,
              borderRadius: 10,
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
                  Save
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>
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
    width: RFPercentage(28),
    height: RFPercentage(40),
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
});

export default ShareImageScreen;
