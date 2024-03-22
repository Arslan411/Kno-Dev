import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SV, Text } from "src/components/Themed";
import { Colors, gradients } from "src/constants/Colors";
import PhotoEditor from "@baronha/react-native-photo-editor";
import { useEffect, useState } from "react";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import AuthHeader from "src/components/AuthHeader";

const PhotoEditorScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"PhotoEditor">) => {
  const [photo, setPhoto] = useState<string>(route?.params?.uri);
  const [stickers, setStickers] = useState([]);

  const onEdit = async () => {
    try {
      if (photo) {
        // const path = await PhotoEditor.open({
        //   path: `file://:${photo}`,
        //   stickers,
        // });
        // navigation.navigate("ShareImage", { uri: path as string });
        // navigation.navigate("ShareImage", { uri: photo as string });
        navigation.navigate("EditProfileShare", { uri: photo as string });
      }
    } catch (e: any) {
      console.log(e);
      // Alert.alert("", e.message);
    }
  };

  useEffect(() => {
    onEdit();
  }, []);

  return (
    <SV>
      <AuthHeader text="Step 3/4" subText="" />
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
          />

          <Pressable
            onPress={onEdit}
            style={{
              height: RFPercentage(7),
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
              <Text
                textType="LBBold"
                style={{
                  fontSize: RFPercentage(2),
                  color: Colors.velvet,
                }}
              >
                Open Editor
              </Text>
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

export default PhotoEditorScreen;
