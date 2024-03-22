import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { StyleSheet, Image, View, Pressable } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import AuthHeader from "src/components/AuthHeader";
import BigColoredButton from "src/components/BigColoredButton";
import Cards from "src/components/Cards/Cards";
import DiseaseLabel from "src/components/GetTestedFlow/DiseaseLabel";
import GenericModal from "src/components/GetTestedFlow/GenericModal";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import HomeHeader from "src/components/HomeScreen/Header";
import UserHeader from "src/components/HomeScreen/UserHeader";
import IconButton from "src/components/IconButton";
import { SV, Text } from "src/components/Themed";
import { Colors, gradients } from "src/constants/Colors";
import { Loading, OrderStatus } from "src/constants/enums";
import TestServices from "src/services/TestServices";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import { images } from "src/utils/Images";

const DoDontScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"DoDont">) => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [testInProgress, setTestInProgress] = useState<boolean>(false);
  const { showModal, closeModal } = useModal();

  return (
    <SV style={styles.container}>
      <UserHeader />
      <View style={styles.innerContainer}>
        <Cards backNavigate headerCard headerTxt="Proper badge placement">
          <View
            style={{
              margin: 8,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: Colors.primary,
            }}
          >
            <View
              style={{
                borderRadius: 5,
                backgroundColor: Colors.primaryDark1,
                flexDirection: "row",
                margin: 10,
                padding: 10,
                justifyContent: "space-around",
                width: "94%",
                alignSelf: "center",
              }}
            >
              <Image style={styles.doImg} source={images.doImg} />
              <Image style={styles.dontsImg} source={images.dontImg} />
            </View>

            <Text style={styles.text1}>
              You'll want to be sure not to cover your face. We recommend
              placing your badge in the top right corner.
            </Text>
          </View>

          <View
            style={{
              margin: 3,
              marginBottom: 11,

              alignItems: "center",
            }}
          >
            <IconButton
              onPress={() => navigation.navigate("ImagePicker")}
              unCheckedLabel="Got it"
              txtColor={Colors.primaryDark1}
            />
          </View>
        </Cards>
      </View>
    </SV>
  );
};

export default DoDontScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 10,
  },
  SplashCard: {
    margin: 8,
    borderWidth: 1,
    borderBottomWidth: 5,
    borderRadius: 10,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  headingText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 16,
    marginRight: 24,
    marginLeft: 25,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  text1: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: RFPercentage(1.8),
    lineHeight: 23,
    letterSpacing: 0.25,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
  },
  button: {
    margin: 8,
    width: 100,
    height: 50,
  },
  text2: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  checks: {
    position: "absolute",
    bottom: 5,
    marginLeft: 47,
  },
  centerBadge: {
    width: 80,
    position: "absolute",
    marginTop: 58,
    marginLeft: 21,
  },
  cornerBadge: {
    width: 50,
    position: "absolute",
    end: 7,
    marginTop: 10,
  },
  doImg: {
    height: 215,
    width: 145,
    resizeMode: "contain",
  },
  dontsImg: {
    height: 215,
    width: 145,
    resizeMode: "contain",
  },
});

// import { LinearGradient } from "expo-linear-gradient";
// import { useEffect, useState } from "react";
// import { set } from "react-hook-form";
// import { StyleSheet, Image, View } from "react-native";
// import { RFPercentage } from "react-native-responsive-fontsize";
// import AuthHeader from "src/components/AuthHeader";
// import BigColoredButton from "src/components/BigColoredButton";
// import DiseaseLabel from "src/components/GetTestedFlow/DiseaseLabel";
// import GenericModal from "src/components/GetTestedFlow/GenericModal";
// import { useModal } from "src/components/GlobalModal/GlobalModal";
// import HomeHeader from "src/components/HomeScreen/Header";
// import { SV, Text } from "src/components/Themed";
// import { Colors, gradients } from "src/constants/Colors";
// import { Loading, OrderStatus } from "src/constants/enums";
// import TestServices from "src/services/TestServices";
// import { HomeStackScreenProps } from "src/types/NavigationTypes";

// const DoDontScreen = ({
//   navigation,
//   route,
// }: HomeStackScreenProps<"DoDont">) => {
//   const [loading, setLoading] = useState<Loading>(Loading.idle);
//   const [testInProgress, setTestInProgress] = useState<boolean>(false);
//   const { showModal, closeModal } = useModal();

//   return (
//     <SV style={styles.container}>
//       <AuthHeader subText="Do’s and Don’ts" />
//       <View
//         style={{
//           borderWidth: 1,
//           borderBottomWidth: 4,
//           borderRadius: 8,
//           borderColor: Colors.velvet,
//           marginVertical: "6%",
//           marginHorizontal: 16,
//         }}
//       >
//         <LinearGradient
//           colors={gradients.primary}
//           start={[0.4, 0.5]}
//           end={[0.8, 0.5]}
//           style={{
//             borderRadius: 8,
//             borderColor: Colors.velvet,
//           }}
//         >
//           <View>
//             <View style={styles.headingView}>
//               <Image
//                 style={styles.heading}
//                 source={require("../../assets/badgeImg.png")}
//               />
//             </View>
//             <View style={styles.imageView}>
//               <Image
//                 style={styles.imageStyle}
//                 source={require("../../assets/doImage.png")}
//               />
//               <Image
//                 style={styles.imageStyle}
//                 source={require("../../assets/DontImage.png")}
//               />
//             </View>
//           </View>
//           <View style={styles.btnView}>
//             <BigColoredButton
//               onPress={() => navigation.navigate("ImagePicker")}
//               // isLoading={loading === "loading"}
//               // disabled={loading === "loading"}
//               textStyle={{ fontSize: 14 }}
//               text="Got it"
//             />
//           </View>
//         </LinearGradient>
//       </View>
//     </SV>
//   );
// };

// export default DoDontScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   btnView: {
//     height: 50,
//     marginHorizontal: 35,
//     marginVertical: "5%",
//   },
//   headingView: {
//     borderWidth: 1,
//     borderBottomWidth: 4,
//     borderRadius: 6,
//     padding: "4%",
//   },
//   heading: {
//     height: 26,
//     width: 300,
//     alignSelf: "center",
//   },
//   imageView: {
//     flexDirection: "row",
//     marginVertical: "10%",
//     justifyContent: "space-evenly",
//   },
//   imageStyle: {
//     height: 226,
//     width: 155,
//     alignSelf: "center",
//   },
// });
