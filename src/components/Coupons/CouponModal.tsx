// import { Pressable, View, Share } from "react-native";
// import * as Clipboard from "expo-clipboard";
// import { RFPercentage } from "react-native-responsive-fontsize";
// import { LinearGradient } from "expo-linear-gradient";
// import { gradients, Colors } from "src/constants/Colors";
// import { Text } from "../Themed";
// import React, { useState } from "react";
// import BigColoredButton from "../BigColoredButton";
// import { Toast } from "../ToastManager";
// import StrokeText from "../StrokeText";

// type Coupon = {
//   code: string;
//   expiry: string;
// };

// type CouponModalProps = {
//   coupon: Coupon;
//   message: string;
//   heading: string;
//   remainingTime: string;
// };

// const CouponModal: React.FC<CouponModalProps> = (props) => {
//   const [copiedText, setCopiedText] = useState("");

//   const copyToClipboard = async () => {
//     await Clipboard.setStringAsync(props.coupon.code);
//     Toast.success("Code copied!");
//     setCopiedText(props.coupon.code);
//   };
//   return (
//     <Pressable
//       style={{
//         marginBottom: 16,
//       }}
//     >
//       <View
//         style={{
//           // flex: 1,
//           borderRadius: 10,
//           borderWidth: 1,
//           borderBottomWidth: 4,
//           borderColor: Colors.velvet,
//           marginTop: "12%",
//           height: "95%",
//         }}
//       >
//         <LinearGradient
//           colors={gradients.primary}
//           start={[0, 0]}
//           end={[0, 1]}
//           style={{
//             flex: 1,
//             borderRadius: 10,
//             // padding: 20,
//           }}
//         >
//           <Pressable
//             style={{
//               padding: 15,
//               paddingVertical: 16,
//               justifyContent: "center",
//               flex: 1,
//             }}
//           >
//             <View style={{ marginBottom: 12 }}>
//               <View style={{ bottom: 18 }}>
//                 <StrokeText myText={`${props.heading}`} />
//               </View>
//               {/* <Text
//                 textType="LBBold"
//                 style={{
//                   textAlign: "center",
//                   fontSize: RFPercentage(2.5),
//                   color: Colors.velvet,
//                 }}
//               >
//                 {props.heading}
//               </Text> */}
//               {props.remainingTime && (
//                 <Text
//                   textType="LBBold"
//                   style={{
//                     textAlign: "center",
//                     fontSize: RFPercentage(2.5),
//                     color: Colors.velvet,
//                   }}
//                 >
//                   {props.remainingTime}
//                 </Text>
//               )}
//             </View>
//             <Pressable
//               style={{
//                 height: RFPercentage(7),
//                 borderWidth: 1,
//                 borderColor: Colors.velvet,
//                 borderBottomWidth: 4,
//                 borderRadius: 10,
//                 marginBottom: 10,
//               }}
//             >
//               <LinearGradient
//                 colors={gradients.primary}
//                 start={[0, 0]}
//                 end={[1, 1]}
//                 style={{
//                   flex: 1,
//                   padding: 12,
//                   borderRadius: 10,
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Text
//                   textType="LBBold"
//                   style={{
//                     textAlign: "center",
//                     fontSize: RFPercentage(2),
//                     color: Colors.velvet,
//                   }}
//                 >
//                   {props.coupon.code}
//                 </Text>
//               </LinearGradient>
//             </Pressable>

//             <View
//               style={{
//                 flexDirection: "row",
//                 marginBottom: 10,
//                 gap: 10,
//                 marginTop: 10,
//               }}
//             >
//               <BigColoredButton text="Copy" onPress={copyToClipboard} />
//               <BigColoredButton
//                 text="Share"
//                 onPress={() => {
//                   Share.share({
//                     message: `Code is ${props.coupon.code}`,
//                   });
//                 }}
//               />
//             </View>
//             <Text
//               textType="regular"
//               style={{
//                 textAlign: "center",
//                 fontSize: RFPercentage(1.8),
//                 color: Colors.velvet,
//                 top: 15,
//               }}
//             >
//               {props.message}
//             </Text>
//           </Pressable>
//         </LinearGradient>
//       </View>
//     </Pressable>
//   );
// };
// export default CouponModal;

import { Pressable, View, Share, Image, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, Colors } from "src/constants/Colors";
import { Text } from "../Themed";
import React, { useState } from "react";
import BigColoredButton from "../BigColoredButton";
import { Toast } from "../ToastManager";
import StrokeText from "../StrokeText";
import { images } from "src/utils/Images";
import { useNavigation } from "@react-navigation/native";
type Coupon = {
  code: string;
  expiry: string;
};
type CouponModalProps = {
  coupon: Coupon;
  message: string;
  heading: string;
  remainingTime: string;
  onPress?: () => void;
};
const CouponModal: React.FC<CouponModalProps> = (props) => {
  const navigation = useNavigation();
  const [copiedText, setCopiedText] = useState("");
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(props.coupon.code ?? props.coupon);
    Toast.success("Code copied!");
    setCopiedText(props.coupon.code ?? props.coupon);
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderBottomWidth: 5,
        borderRadius: 10,
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
      }}
    >
      <Pressable onPress={props.onPress}>
        <View
          style={{
            margin: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: 20,
            }}
          >
            <Pressable onPress={() => navigation.goBack()}>
              <Image
                source={images.backArrow}
                style={{ width: 55, height: 55 }}
              />
            </Pressable>

            <Text textType="LBBold" style={Styles.headingText}>
              {props.heading}
            </Text>

            <View style={{ height: 20, width: 20 }} />
          </View>
        </View>
      </Pressable>

      <Text textType="medium" style={Styles.messagetext}>
        {props.message}
      </Text>

      <Text textType="LBBold" style={Styles.codetext}>
        {props.coupon.code ?? props.coupon}
      </Text>

      <View
        style={{
          margin: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginBottom: 10,
          }}
        >
          <Pressable
            style={{
              width: 100,
              height: 45,
              // borderWidth: 1,
              marginTop: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={copyToClipboard}
          >
            <View
              style={{
                width: 96,
                height: 42,
                borderWidth: 1,
                borderRadius: 100,
                borderColor: Colors.primary,
                backgroundColor: "#F2F2F2",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  flex: 1,
                }}
              >
                <Image
                  source={require("../../assets/copy.png")}
                  style={{ width: 21, height: 21 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                    // marginTop: 6
                  }}
                >
                  Copy
                </Text>
              </View>
            </View>
          </Pressable>
          <Pressable
            style={{
              width: 100,
              height: 45,
              // borderWidth: 1,
              marginTop: 8,
            }}
            onPress={() => {
              Share.share({
                message: `Code is ${props.coupon.code}`,
              });
            }}
          >
            <View
              style={{
                width: 96,
                height: 42,
                borderWidth: 1,
                borderRadius: 100,
                borderColor: Colors.primary,
                backgroundColor: "#F2F2F2",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  flex: 1,
                }}
              >
                <Image
                  source={require("../../assets/share.png")}
                  style={{ width: 21, height: 21 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                    // marginTop: 6
                  }}
                >
                  Share
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
    // </Pressable>
  );
};
export default CouponModal;
const Styles = StyleSheet.create({
  headingText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: RFPercentage(2.2),
  },
  messagetext: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: RFPercentage(1.75),
    lineHeight: 22,
    width: "88%",
    alignSelf: "center",
  },
  codetext: {
    color: Colors.velvet,
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    top: 4,
  },
});
