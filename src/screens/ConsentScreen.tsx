import { Linking, Platform, Pressable, View } from "react-native";
import React from "react";
import { Colors, gradients } from "src/constants/Colors";
import { SV, Text } from "src/components/Themed";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import CheckBox from "src/components/CheckBox";
import AuthHeader from "src/components/AuthHeader";
import BigColoredButton from "src/components/BigColoredButton";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import StrokeText from "src/components/StrokeText";

const ConsentScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"Consent">) => {
  const [checked, setChecked] = React.useState<boolean>(false);
  return (
    <SV
      style={{
        flex: 1,
      }}
    >
      <AuthHeader logoCentered />

      <View
        style={{
          height: Platform.OS === "ios" ? RFPercentage(38) : RFPercentage(44),
          borderWidth: 1,
          borderBottomWidth: 4,
          borderRadius: 8,
          borderColor: Colors.velvet,
          marginHorizontal: 16,
          marginTop: RFPercentage(8),
        }}
      >
        <LinearGradient
          colors={gradients.primary}
          start={[0.0, 1.0]}
          end={[1.0, 1.0]}
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <StrokeText
            fontSize={26}
            myText={`Some legal stuff  
          `}
          />

          <Text
            style={{
              fontSize: 16,
              color: Colors.velvet,
              textAlign: "center",
              bottom: "8%",
            }}
          >
            Please review the documentation
            <Pressable
              onPress={() => {
                Linking.openURL("https://kno.co/pages/policies");
              }}
              style={{
                flexDirection: "row",
              }}
            >
              <Text
                textType="bold"
                style={{
                  fontSize: 16,
                  color: Colors.primary,
                  alignSelf: "flex-end",
                  marginBottom: -4,
                }}
              >
                {" "}
                found here.{" "}
              </Text>
            </Pressable>
            By clicking “I agree” below you acknowledge that you have read,
            understand, and agree to these terms.
          </Text>

          <Pressable
            onPress={() => {
              setChecked(!checked);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              alignSelf: "center",
              bottom: 10,
            }}
          >
            <CheckBox
              rounded
              checked={checked}
              onValueChange={setChecked}
              color={Colors.velvet}
              checkedColor={Colors.primary}
              disabledColor={Colors.velvet}
            />
            <Text
              style={{
                color: Colors.velvet,
                fontSize: 16,
              }}
            >
              I agree
            </Text>
          </Pressable>

          <Pressable
            disabled={!checked}
            onPress={() => {
              navigation.navigate("Register");
            }}
            style={{
              alignSelf: "center",
              opacity: !checked ? 0.5 : 1,
              borderWidth: 1,
              borderColor: Colors.velvet,
              borderBottomWidth: 4,
              borderRadius: 10,
              bottom: 7,
            }}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                padding: 16,
                paddingHorizontal: 48,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                textType="LBBold"
                style={{
                  fontSize: 16,
                  color: Colors.velvet,
                }}
              >
                Submit
              </Text>
            </LinearGradient>
          </Pressable>
        </LinearGradient>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: RFPercentage(12),
          flexDirection: "row",
          padding: 16,
          gap: 8,
        }}
      >
        <BigColoredButton
          onPress={() => {
            if (!route?.params?.previous) {
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } else {
              navigation.goBack();
            }
          }}
          text="Previous"
        />
      </View>
    </SV>
  );
};

export default ConsentScreen;
