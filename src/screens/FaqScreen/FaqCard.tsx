import { View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import styles from "src/components/ToastManager/styles";
import { Text } from "src/components/Themed";
import { Colors } from "src/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
const FaqCard = ({ item }: any) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "95%",
          borderWidth: 1,
          borderColor: "#BDC99C",
          borderRadius: 5,
          margin: 8,
        }}
      >
        <View
          style={{
            margin: 8,
          }}
        >
          <View
            style={
              {
                // width: 305,
              }
            }
          >
            <Text textType="bold" style={Styles.Questiontext}>
              {item.Question}
            </Text>
          </View>
          {/* <View
            style={{
              // width: 305,
              // height: 125,
              // marginTop: -5,
              marginTop: 4,
              // padding: -40,
              // marginTop: 1
              // borderWidth: 1
            }}
          > */}
          <Text style={Styles.answertext}>{item.Answer}</Text>
          {/* </View> */}
        </View>
      </View>
    </View>
  );
};
export default FaqCard;
const Styles = StyleSheet.create({
  Questiontext: {
    color: Colors.velvet,
    fontSize: RFPercentage(1.8),
    lineHeight: 20,
    letterSpacing: 0.25,
    marginTop: 6,
  },
  answertext: {
    color: Colors.velvet,
    fontSize: RFPercentage(1.7),
    lineHeight: 24,
    letterSpacing: 0.4,
    top: 5,
  },
});
