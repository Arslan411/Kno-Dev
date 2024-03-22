import { Dimensions, Platform, StatusBar, View } from "react-native";
import React from "react";
import { Text } from "src/components/Themed";
import Logo from "src/assets/Logo";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { Colors, gradients } from "src/constants/Colors";

const AuthHeader = ({
  text,
  subText,
  logoCentered,
}: {
  text?: string;
  subText?: string;
  logoCentered?: boolean;
}) => {
  const height = Dimensions.get("window").height;

  const fetchStatusBarHeight = () => {
    if (Platform.OS === "android") {
      if (StatusBar.currentHeight) return StatusBar.currentHeight;
    } else {
      return Constants.statusBarHeight;
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: height / 5,
        borderRadius: 10,
        borderWidth: 2,
        borderBottomWidth: 6,
        borderColor: Colors.velvet,
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
        {logoCentered ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              width: "100%",
            }}
          >
            <Logo />
          </View>
        ) : (
          <Logo />
        )}

        <View
          style={{
            gap: 6,
          }}
        >
          {text && (
            <Text
              textType="bold"
              style={{
                fontSize: 14,
                color: Colors.velvet,
                textTransform: "uppercase",
              }}
            >
              {text}
            </Text>
          )}

          <Text
            textType="LBRegular"
            style={{
              fontSize: 16,
              color: Colors.velvet,
            }}
          >
            {subText}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default AuthHeader;
