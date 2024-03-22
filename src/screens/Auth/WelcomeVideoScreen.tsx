import {
  Pressable,
  ScrollView,
  TextInput,
  View,
  Text,
  Linking,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Colors } from "src/constants/Colors";
import useUserStore from "src/store/userStore";
import BigColoredButton from "src/components/BigColoredButton";
import Video from "react-native-video";
import { useNavigation } from "@react-navigation/native";

const WelcomeVideoScreen = () => {
  const navigation = useNavigation<any>();
  const setIsNewUser = useUserStore((state) => state.setIsNewUser);
  const [loading, setLoading] = useState(true);

  const videoRef = useRef<any>(null);

  const onEnd = () => {
    videoRef.current.seek(0);
  };

  // const videoUrl =
  //   "https://firebasestorage.googleapis.com/v0/b/knoco-dev.appspot.com/o/Kno_Intro_Compressed.mp4?alt=media&token=58e384cf-94b3-458e-bc57-8a0f84ed513b";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
      }}
    >
      {loading && (
        <ActivityIndicator
          style={{ position: "absolute", alignSelf: "center" }}
          size={20}
          color={"white"}
        />
      )}

      <Video
        ref={videoRef}
        ignoreSilentSwitch={"ignore"}
        // posterResizeMode="cover"
        // source={{
        //   uri: videoUrl,
        // }}
        source={require("../../assets/KnoVideo.mp4")}
        style={{ flex: 1 }}
        resizeMode="cover"
        onEnd={onEnd}
        // onProgress={() => console.log("workinge")}
        onReadyForDisplay={() => setLoading(false)}
        onLoad={() => setLoading(true)}
        repeat={true}
      />
      <View
        style={{
          position: "absolute",
          bottom: Platform.OS === "android" ? 17 : 26,
          right: Platform.OS === "android" ? 18 : 25,
        }}
      >
        <BigColoredButton
          style={{ width: 80 }}
          onPress={() => {
            setIsNewUser(false);
            // navigation.navigate("Consent", {
            //   previous: false,
            // });
            navigation?.navigate("Root");
          }}
          text="Skip"
        />
      </View>
    </View>
  );
};

export default WelcomeVideoScreen;
