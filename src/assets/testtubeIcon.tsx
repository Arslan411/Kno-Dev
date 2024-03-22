import { Image, Keyboard, Platform, Pressable, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useEffect, useState } from "react";

const TestTube = ({ onPress }: any) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <LinearGradient
      colors={gradients.primary}
      style={{
        height: 62,
        width: 62,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.4,
        borderColor: Colors.primary,
        borderRadius: 50,
        position: "absolute",
        bottom: isKeyboardVisible
          ? -6
          : Platform.OS === "ios"
          ? "25%"
          : RFPercentage(3.2),
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          height: 62,
          width: 62,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 50,
        }}
      >
        <Image
          source={require("src/assets/testTube.png")}
          style={{ width: 30, height: 30 }}
        />
      </Pressable>
    </LinearGradient>
  );
};

export default TestTube;
