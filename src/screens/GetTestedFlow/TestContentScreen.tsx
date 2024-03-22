import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import BigColoredButton from "src/components/BigColoredButton";
import ButtonWithIcon from "src/components/ButtonWIthIcon";
import Cards from "src/components/Cards/Cards";
import DownButtonWithGradient from "src/components/DownButtonWithGradient";
import DiseaseLabel from "src/components/GetTestedFlow/DiseaseLabel";
import GenericModal from "src/components/GetTestedFlow/GenericModal";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import HomeHeader from "src/components/HomeScreen/Header";
import UserHeader from "src/components/HomeScreen/UserHeader";
import StrokeText from "src/components/StrokeText";
import { Icon, SV, Text } from "src/components/Themed";
import { Colors, gradients } from "src/constants/Colors";
import { Loading, OrderStatus } from "src/constants/enums";
import TestServices from "src/services/TestServices";
import useDiseaseStore from "src/store/diseaseStore";
import useOrderStore from "src/store/orderStore";
import useUserStore from "src/store/userStore";
import { HomeStackScreenProps } from "src/types/NavigationTypes";

const TestContentScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"TestContent">) => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [testInProgress, setTestInProgress] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const { showModal, closeModal } = useModal();
  const stis = useDiseaseStore((state) => state.stis);
  const user = useUserStore((state) => state.user);
  const order = useOrderStore((state) => state.order);

  const disases: string[] = [
    "Herpes I",
    "Herpes II",
    "HIV",
    "Mpox",
    "Trich",
    "Syphilis",
    "Chlamydia",
    "Gonorrhea",
    "Mycoplasma Genitalium",
  ];

  const fetchOrder = async () => {
    setLoading(Loading.loading);
    if (order && user) {
      try {
        const res = await TestServices.fetchOrderStatus();
        if (!res.data.data[0]) {
          setLoading(Loading.idle);
        }

        if (res.data.data[0].status !== OrderStatus.Released) {
          showModal({
            isVisible: true,
            heading: "Test in Progress",
            body: "It looks like you already have a test in progress with knō.",
            anotherBody:
              "Please keep an eye on your notifications screen to track your test status.",
            buttonText: "Okay",
            onClose: () => {
              closeModal();
              // navigation.goBack();
            },
          });
        } else {
          navigation.navigate("IntakeForm");
        }
        setLoading(Loading.idle);
      } catch (error) {
        setLoading(Loading.error);
      }
    } else {
      navigation.navigate("IntakeForm");
      setLoading(Loading.idle);
    }
  };

  return (
    <SV style={styles.container}>
      <UserHeader />
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(16) + 64
              : RFPercentage(16) + 64,
        }}
      >
        <Cards
          checked
          width={RFPercentage(16)}
          imageCard
          customStyles={{ marginVertical: 10 }}
          // onPress={() => fetchOrder()}
        />
        <Cards
          onPress={() => navigation.navigate("CouponScreen")}
          buttonCard
          buttonTitle="Test together"
          buttonSubHeading="Invite your friends to test with you"
          fontSize={RFPercentage(1.7)}
          iconShow
        />
        <Cards
          buttonCard
          buttonTitle="Got questions?"
          buttonSubHeading="Learn more about knō testing"
          customStyles={{ marginVertical: 10 }}
          onPress={() => navigation.navigate("FaqScreen")}
        />

        {/* <View
          style={{
            borderWidth: 1,
            borderBottomWidth: 4,
            borderRadius: 8,
            borderColor: Colors.velvet,
            marginBottom: 16,
            marginTop: "4%",
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0.0, 0.0]}
            end={[0.0, 1.0]}
            style={{
              flex: 1,
              borderRadius: 8,
              paddingTop: 12,
              paddingBottom: 17,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StrokeText myText="Now it works..." fontSize={18} />
          </LinearGradient>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderBottomWidth: 4,
            borderRadius: 17,
            borderColor: Colors.velvet,
            marginBottom: 16,
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0.0, 0.0]}
            end={[1.0, 1.0]}
            style={{
              flex: 1,
              borderRadius: 17,
              // // paddingTop: 20,
              // // paddingBottom: 24,
              // // justifyContent: "center",
              // // alignItems: "center",
              // gap: 12,
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "55%",
                  marginLeft: "15%",
                }}
              >
                <DownButtonWithGradient
                  name={showTest ? "chevron-down" : "chevron-right"}
                  onPress={() => setShowTest(!showTest)}
                />
                <Text
                  textType="LBBold"
                  style={[
                    styles.boxTitle,
                    {
                      marginRight: Platform?.OS === "ios" ? 20 : 0,
                    },
                  ]}
                >
                  What we test for
                </Text>
              </View>
              {showTest
                ? disases.map((disease, index) => (
                    <Text style={[styles.diseaseTxt]}>{disease}</Text>
                    // <DiseaseLabel
                    //   key={index}
                    //   disease={disease.UiName}
                    //   spread
                    //   margin={5}
                    // />
                  ))
                : null}
            </View>
          </LinearGradient>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderBottomWidth: 4,
            borderRadius: 17,
            borderColor: Colors.velvet,
            marginBottom: 16,
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0, 0.3]}
            end={[0, 1]}
            style={{
              flex: 1,
              borderRadius: 17,
              gap: 8,
              paddingHorizontal: 22,
              paddingBottom: showInstructions ? 20 : 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "52%",
                marginLeft: "10%",
              }}
            >
              <DownButtonWithGradient
                name={showInstructions ? "chevron-down" : "chevron-right"}
                onPress={() => setShowInstructions(!showInstructions)}
              />
              <Text
                textType="LBBold"
                style={[
                  styles.boxTitle,
                  { marginRight: Platform?.OS === "ios" ? 20 : 0 },
                ]}
              >
                Instructions
              </Text>
            </View>

            {showInstructions && (
              <Text textType="regular" style={styles.boxText}>
                After a quick patient intake form you will receive a knō kit for
                blood and urine collection. After following the collection
                instructions and returning the knō kit to our lab you will
                receive your results.
              </Text>
            )}
          </LinearGradient>
        </View>
        <View
          style={{
            borderWidth: 1,
            borderBottomWidth: 4,
            borderRadius: 17,
            borderColor: Colors.velvet,
            marginBottom: 16,
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0, 0.3]}
            end={[0, 1]}
            style={{
              flex: 1,
              borderRadius: 17,
              gap: 8,
              paddingHorizontal: 22,
              paddingBottom: showResults ? 20 : 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "60%",
                marginLeft: "10%",
              }}
            >
              <DownButtonWithGradient
                name={showResults ? "chevron-down" : "chevron-right"}
                onPress={() => setShowResults(!showResults)}
              />
              <Text
                textType="LBBold"
                style={[
                  styles.boxTitle,
                  {
                    marginRight: Platform?.OS === "ios" ? 20 : 0,
                  },
                ]}
              >
                Positive Results
              </Text>
            </View>

            {showResults && (
              <Text textType="regular" style={styles.boxText}>
                If you receive positive results a doctor may attempt to contact
                you by phone 3 times. If they are unable to contact you, your
                results will be placed in the app for your review.
              </Text>
            )}
          </LinearGradient>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <BigColoredButton
            onPress={() => {
              navigation.goBack();
            }}
            text="Back"
          />
          <BigColoredButton
            disabled={testInProgress}
            isLoading={loading === Loading.loading}
            onPress={() => {
              navigation.navigate("IntakeForm");
            }}
            text="Next"
          />
        </View> */}
      </ScrollView>
    </SV>
  );
};

export default TestContentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  // title: {
  //   fontSize: 18,
  //   color: Colors.velvet,
  //   paddingVertical: 16,
  //   textAlign: "center",
  // },
  // boxTitle: {
  //   fontSize: 16,
  //   color: Colors.velvet,
  // },
  // boxText: {
  //   fontSize: 14,
  //   color: Colors.velvet,
  //   textAlign: "center",
  //   lineHeight: 28,
  // },
  // diseaseTxt: {
  //   textAlign: "center",
  //   margin: 10,
  //   fontWeight: "600",
  //   fontSize: 15.5,
  //   color: Colors.black,
  // },
});
