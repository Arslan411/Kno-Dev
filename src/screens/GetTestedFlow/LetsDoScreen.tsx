import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { StyleSheet, Image, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import AuthHeader from "src/components/AuthHeader";
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

const LetsDoScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"LetsDo">) => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [testInProgress, setTestInProgress] = useState<boolean>(false);
  const { showModal, closeModal } = useModal();

  return (
    <SV style={styles.container}>
      <AuthHeader subText="Share Your kno Status" />
      <View
        style={{
          borderWidth: 1,
          borderBottomWidth: 4,
          borderRadius: 8,
          borderColor: Colors.velvet,
          marginTop: "15%",
          marginHorizontal: 16,
        }}
      >
        <LinearGradient
          colors={gradients.primary}
          start={[0.1, 0.6]}
          end={[0.8, 0.6]}
          //   start={[0.3, 0.65]}
          //   end={[0.8, 0.6]}
          style={{
            borderRadius: 8,
            borderColor: Colors.velvet,
            // marginTop: "15%",
            // marginHorizontal: 16,
          }}
        >
          <View style={{ marginTop: 25 }}>
            <StrokeText
              fontSize={24}
              myText={`Time to update your \n dating app profile pics!`}
            />
          </View>

          <View style={{ marginVertical: "10%" }}>
            <Text style={styles.Content}>
              You did the thing, you got tested.
            </Text>
            <Text style={[styles.Content]}>
              Why let others know you knō? Pride? Encouragement? Support? Or
              maybe you just want to look good out there in the sea of potential
              matches?
            </Text>
            <Text style={[styles.Content]}>
              Whatever your reason, we’ve got you.
            </Text>
          </View>
          <View style={styles.btnView}>
            <BigColoredButton
              onPress={() => navigation.navigate("DoDont")}
              textStyle={{ fontSize: 14 }}
              text="Let's Do it!"
            />
          </View>
        </LinearGradient>
      </View>
    </SV>
  );
};

export default LetsDoScreen;

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
    fontSize: RFPercentage(2.3),
    // fontSize: 16,
    color: Colors.velvet,
    paddingVertical: 14,
    textAlign: "center",
  },
  btnView: {
    height: 50,
    marginHorizontal: 40,
    marginBottom: "10%",
  },
});
