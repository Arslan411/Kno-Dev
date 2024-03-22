import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import BigColoredButton from "src/components/BigColoredButton";
import DiseaseLabel from "src/components/GetTestedFlow/DiseaseLabel";
import GenericModal from "src/components/GetTestedFlow/GenericModal";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import HomeHeader from "src/components/HomeScreen/Header";
import StrokeText from "src/components/StrokeText";
import { SV, Text } from "src/components/Themed";
import { Colors, gradients } from "src/constants/Colors";
import { Loading, OrderStatus } from "src/constants/enums";
import TestServices from "src/services/TestServices";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
const GetTestScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"GetTest">) => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [testInProgress, setTestInProgress] = useState<boolean>(false);
  const { showModal, closeModal } = useModal();
  return (
    <SV style={styles.container}>
      <HomeHeader />
      <View
        style={{
          borderWidth: 1,
          borderBottomWidth: 4,
          borderRadius: 8,
          borderColor: Colors.velvet,
          marginTop: 35,
          marginHorizontal: 16,
        }}
      >
        {/* <Text textType="Titan one" style={[styles.title, { marginTop: 30 }]}>
          Not yet!
        </Text> */}
        {/* <Image
          style={{
            height: 35,
            width: 130,
            // resizeMode: "contain",
            alignSelf: "center",
            marginTop: 45,
          }}
          source={require("../../assets/Notyet.png")}
        /> */}

        <View style={{ marginTop: 20, top: 30 }}>
          <StrokeText fontSize={30} myText={`Not yet! ${"\n"} `} />
        </View>

        <View style={{ marginVertical: "13%" }}>
          <Text style={styles.Content}>
            If you want to add the knō badge to your dating profile pics you
            have to actually knō first (that’s kind of the whole point)
          </Text>
          <Text style={[styles.Content]}>
            Don’t worry though, just click the button below to order a test and
            you’ll be on your way to swiping with confidence.
          </Text>
        </View>
        <View
          style={{
            marginBottom: 30,
            height: 50,
            marginHorizontal: 40,
          }}
        >
          <BigColoredButton
            // onPress={() => navigation.navigate("TestContent")}
            onPress={() => navigation.navigate("IntakeForm")}
            isLoading={loading === "loading"}
            disabled={loading === "loading"}
            textStyle={{ fontSize: 14 }}
            text="Get Tested!"
          />
        </View>
      </View>
    </SV>
  );
};
export default GetTestScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: Colors.velvet,
    paddingVertical: 16,
    textAlign: "center",
  },
  Content: {
    fontSize: 16,
    color: Colors.velvet,
    paddingVertical: 16,
    textAlign: "center",
  },
  boxTitle: {
    fontSize: 16,
    color: Colors.velvet,
  },
  boxText: {
    fontSize: 14,
    color: Colors.velvet,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
