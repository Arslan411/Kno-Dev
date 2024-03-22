import React from "react";
import { SV, Text } from "src/components/Themed";
import AuthHeader from "src/components/AuthHeader";
import { Dimensions, View, ScrollView } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Slider } from "src/components/Slider";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import { RFPercentage } from "react-native-responsive-fontsize";
import SliderButton from "src/components/SliderButton";
import StrokeText from "src/components/StrokeText";

const TenetTwoScreen = ({ navigation }: RootStackScreenProps<"TenetTwo">) => {
  const width = Dimensions.get("window").width;
  const handleEndReached = () => {
    navigation.navigate("TenetThree");
  };

  return (
    <SV
      style={{
        flex: 1,
      }}
    >
      <AuthHeader logoCentered />

      <View
        style={{
          paddingTop: RFPercentage(20),
        }}
      >
        <ScrollView
          style={{
            borderWidth: 1,
            margin: 16,
            borderBottomWidth: 4,
            borderRadius: 8,
            borderColor: Colors.velvet,
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0.0, 0.0]}
            end={[1.0, 1.0]}
            style={{
              flex: 1,
              borderRadius: 8,
              padding: 16,
              paddingVertical: 14,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ top: 10 }}>
              <StrokeText
                myText={`I will use the knō app to share that I have tested by adding the knō ${"\n"} badge to my dating profile pics.
              `}
              />
            </View>

            {/* <Text
              textType="LBBold"
              style={{
                fontSize: 20,
                color: Colors.velvet,
                paddingVertical: 16,
                textAlign: "center",
              }}
            >
              I plan to share that I have tested publicly and only share my
              testing results when it is appropriate, like one on one
              conversations.
            </Text> */}
          </LinearGradient>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          <Slider
            text="I agree!"
            onEndReached={handleEndReached}
            sliderElement={<SliderButton />}
            containerStyle={{
              backgroundColor: "transparent",
              borderRadius: 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              borderWidth: 1,
              borderColor: Colors.velvet,
              borderBottomWidth: 4,
            }}
          />
        </View>
      </View>
    </SV>
  );
};

export default TenetTwoScreen;
