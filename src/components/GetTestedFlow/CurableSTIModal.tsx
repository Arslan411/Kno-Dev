import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import ClickableItem from "./ClickableItem";
import { StackNavigation } from "src/types/NavigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useModal } from "../GlobalModal/GlobalModal";
import { GetTestedNavOptions } from "src/screens/GetTestedFlow/IntakeOptionScreen";
import StrokeText from "../StrokeText";
import IconButton from "../IconButton";

type CurableSTIModalProps = {
  previousCurableModalVisible: boolean;
  IntakeFormData: any;
  setPreviousCurableModalVisible: (visible: boolean) => void;
  previousDiseases: { id: number; name: string }[];
  previousCurablediseases: { id: number; name: string }[];
  route?: any;
  NavOptions: GetTestedNavOptions[] | null;
};

const CurableSTIModal = ({
  previousCurableModalVisible,
  setPreviousCurableModalVisible,
  IntakeFormData,
  previousDiseases,
  previousCurablediseases,
  route,
  NavOptions,
}: CurableSTIModalProps) => {
  const navigation = useNavigation<StackNavigation>();
  const { showModal, closeModal } = useModal();

  const navigate = () => {
    closeModal();
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

  const click = () => {
    const timer = setTimeout(() => navigate(), 350);
    return () => clearTimeout(timer);
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={previousCurableModalVisible}
      // onRequestClose={() => {
      //   setModalVisible(false);
      // }}
    >
      <Pressable
        // onPress={() => {
        //   setModalVisible(false);
        // }}
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 4,
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <Pressable
          style={{
            height: RFPercentage(55),
            marginTop: RFPercentage(8),
            marginHorizontal: 8,
            borderColor: Colors.primary,
            borderWidth: 1,
            borderRadius: 10,
            borderBottomWidth: 4,
            backgroundColor: Colors.white,
          }}
        >
          {/* <LinearGradient
            colors={gradients.primary}
            start={[0, 0]}
            end={[1, 1]}
            style={{
              flex: 1,
              padding: 12,
              paddingHorizontal: 12,
              borderRadius: 10,
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          > */}
          <View
            style={{
              flex: 1,
              padding: 12,
              paddingHorizontal: 12,
              borderRadius: 10,
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Text
              textType="LBBold"
              style={{
                textAlign: "center",
                fontSize: 16,
                color: Colors.velvet,
                lineHeight: 25,
                letterSpacing: 0.25,
              }}
            >
              {`Thank you for sharing your \n diagnosis of...`}
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "#BDC99C",
              }}
            >
              <ScrollView
                persistentScrollbar={true}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{
                  justifyContent: "center",
                }}
                style={{
                  maxHeight: RFPercentage(16),
                }}
              >
                {previousCurablediseases.map((symptom, index) => (
                  <ClickableItem key={index} item={symptom.name} checked />
                ))}
              </ScrollView>
            </View>

            <Text
              textType="regular"
              style={{
                textAlign: "center",
                fontSize: RFPercentage(2),
                color: Colors.velvet,
                marginBottom: 12,
                marginHorizontal: 12,
              }}
            >
              Since diagnosis, have you received a follow up test that was
              negative?
            </Text>

            <View
              style={{
                gap: 8,
              }}
            >
              {/* <Pressable
                onPress={() => {
                  if (previousDiseases.length === 0) {
                    setPreviousCurableModalVisible(false);
                    if (NavOptions === null) {
                      // navigation.navigate("ChoosePlan", {
                      //   IntakeForm: IntakeFormData,
                      // });
                      navigation.navigate("ReceivingResults", {
                        IntakeForm: IntakeFormData,
                      });
                    } else if (
                      previousCurablediseases.every(
                        (disease) => disease?.name === "Chlamydia"
                      )
                    ) {
                      // navigation.navigate("ChoosePlan", {
                      //   IntakeForm: IntakeFormData,
                      // });
                      navigation.navigate("ReceivingResults", {
                        IntakeForm: IntakeFormData,
                      });
                    } else if (NavOptions !== null && NavOptions.length > 0) {
                      const nextScreen = NavOptions[0];

                      navigation.navigate(nextScreen.name, {
                        IntakeForm: IntakeFormData,
                        NavOptions: NavOptions,
                      });
                    }
                  } else {
                    setPreviousCurableModalVisible(false);
                    showModal({
                      heading:
                        "Thank you for sharing that you are living with...",
                      isVisible: true,
                      mh: -4,
                      innerBody: (
                        <Text
                          textType="regular"
                          style={{
                            textAlign: "center",
                            fontSize: RFPercentage(2),
                            color: Colors.velvet,
                            marginBottom: 12,
                            marginHorizontal: 12,
                          }}
                        >
                          Thank you for sharing your (
                          {previousDiseases.map((symptom, index) => (
                            <Text
                              key={index}
                              textType="regular"
                              style={{
                                fontSize: RFPercentage(2),
                                color: Colors.velvet,
                              }}
                            >
                              {symptom.name}
                              {index === previousDiseases.length - 1
                                ? ""
                                : ", "}
                            </Text>
                          ))}
                          ) status. A detected or self reported result will be
                          added to your results page.
                        </Text>
                      ),
                      innerChild: (
                        <ScrollView
                          persistentScrollbar={true}
                          showsVerticalScrollIndicator={true}
                          style={{
                            maxHeight: RFPercentage(15),
                          }}
                          contentContainerStyle={{
                            justifyContent: "center",
                          }}
                        >
                          {previousDiseases.map((symptom, index) => (
                            <ClickableItem
                              key={index}
                              item={symptom.name}
                              checked
                            />
                          ))}
                        </ScrollView>
                      ),
                      buttonText: "Got it!",
                      onClose: () => {
                        if (
                          NavOptions === null ||
                          NavOptions === undefined ||
                          NavOptions.length === 0
                        ) {
                          // navigation.navigate("ChoosePlan", {
                          //   IntakeForm: IntakeFormData,
                          // });
                          navigation.navigate("ReceivingResults", {
                            IntakeForm: IntakeFormData,
                          });
                        } else if (
                          NavOptions !== null &&
                          NavOptions.length > 0
                        ) {
                          const nextScreen = NavOptions[0];
                          navigation.navigate(nextScreen.name, {
                            IntakeForm: IntakeFormData,
                            NavOptions: NavOptions,
                          });
                        }
                        closeModal();
                      },
                    });
                  }
                }}
                style={{
                  height: RFPercentage(6),
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                }}
              >
                <LinearGradient
                  colors={[
                    "rgba(213, 187, 234, 0.5)",
                    "rgba(222, 244, 159, 0.5)",
                  ]}
                  start={[0, 0.3]}
                  end={[0, 1]}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    textType="LBBold"
                    style={{
                      fontSize: RFPercentage(2),
                      color: Colors.velvet,
                    }}
                  >
                    Yes
                  </Text>
                </LinearGradient>
              </Pressable> */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <IconButton
                  checked
                  checkedLabel="Yes"
                  width={RFPercentage(19)}
                  height={RFPercentage(5.5)}
                  fontSize={RFPercentage(1.85)}
                  onPress={() => {
                    if (previousDiseases.length === 0) {
                      setPreviousCurableModalVisible(false);
                      if (NavOptions === null) {
                        // navigation.navigate("ChoosePlan", {
                        //   IntakeForm: IntakeFormData,
                        // });
                        navigation.navigate("ReceivingResults", {
                          IntakeForm: IntakeFormData,
                        });
                      } else if (
                        previousCurablediseases.every(
                          (disease) => disease?.name === "Chlamydia"
                        )
                      ) {
                        // navigation.navigate("ChoosePlan", {
                        //   IntakeForm: IntakeFormData,
                        // });
                        navigation.navigate("ReceivingResults", {
                          IntakeForm: IntakeFormData,
                        });
                      } else if (NavOptions !== null && NavOptions.length > 0) {
                        const nextScreen = NavOptions[0];

                        navigation.navigate(nextScreen.name, {
                          IntakeForm: IntakeFormData,
                          NavOptions: NavOptions,
                        });
                      }
                    } else {
                      setPreviousCurableModalVisible(false);
                      showModal({
                        heading:
                          "Thank you for sharing that you are living with...",
                        isVisible: true,
                        mh: -4,
                        innerBody: (
                          <Text
                            textType="regular"
                            style={{
                              textAlign: "center",
                              fontSize: RFPercentage(2),
                              color: Colors.velvet,
                              marginBottom: 12,
                              marginHorizontal: 12,
                            }}
                          >
                            Thank you for sharing your (
                            {previousDiseases.map((symptom, index) => (
                              <Text
                                key={index}
                                textType="regular"
                                style={{
                                  fontSize: RFPercentage(2),
                                  color: Colors.velvet,
                                }}
                              >
                                {symptom.name}
                                {index === previousDiseases.length - 1
                                  ? ""
                                  : ", "}
                              </Text>
                            ))}
                            ) status. A detected or self reported result will be
                            added to your results page.
                          </Text>
                        ),
                        innerChild: (
                          <ScrollView
                            persistentScrollbar={true}
                            showsVerticalScrollIndicator={true}
                            style={{
                              maxHeight: RFPercentage(15),
                            }}
                            contentContainerStyle={{
                              justifyContent: "center",
                            }}
                          >
                            {previousDiseases.map((symptom, index) => (
                              <ClickableItem
                                key={index}
                                item={symptom.name}
                                checked
                              />
                            ))}
                          </ScrollView>
                        ),
                        buttonText: "Got it!",
                        onClose: () => {
                          if (
                            NavOptions === null ||
                            NavOptions === undefined ||
                            NavOptions.length === 0
                          ) {
                            // navigation.navigate("ChoosePlan", {
                            //   IntakeForm: IntakeFormData,
                            // });
                            navigation.navigate("ReceivingResults", {
                              IntakeForm: IntakeFormData,
                            });
                          } else if (
                            NavOptions !== null &&
                            NavOptions.length > 0
                          ) {
                            const nextScreen = NavOptions[0];
                            navigation.navigate(nextScreen.name, {
                              IntakeForm: IntakeFormData,
                              NavOptions: NavOptions,
                            });
                          }
                          closeModal();
                        },
                      });
                    }
                  }}
                />

                <IconButton
                  checked
                  checkedLabel="No"
                  width={RFPercentage(19)}
                  height={RFPercentage(5.5)}
                  fontSize={RFPercentage(1.85)}
                  onPress={() => {
                    setPreviousCurableModalVisible(false);
                    showModal({
                      isVisible: true,
                      heading:
                        "We are very sorry you are not able to test with knō right now.",
                      body: "If you have not received a follow up test for your diagnosis confirming your treatment was successful, it is best to return to your doctor for a follow up.",
                      buttonText: "Exit",
                      onClose: click,
                    });
                  }}
                />
              </View>
              {/* <Pressable
                onPress={() => {
                  setPreviousCurableModalVisible(false);
                  showModal({
                    isVisible: true,
                    heading:
                      "We are very sorry you are not able to test with knō right now.",
                    body: "If you have not received a follow up test for your diagnosis confirming your treatment was successful, it is best to return to your doctor for a follow up.",
                    buttonText: "Exit",
                    onClose: click,
                  });
                }}
                style={{
                  height: RFPercentage(6),
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                }}
              >
                <LinearGradient
                  colors={[
                    "rgba(213, 187, 234, 0.5)",
                    "rgba(222, 244, 159, 0.5)",
                  ]}
                  start={[0, 0.3]}
                  end={[0, 1]}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    textType="LBBold"
                    style={{
                      fontSize: RFPercentage(2),
                      color: Colors.velvet,
                    }}
                  >
                    No
                  </Text>
                </LinearGradient>
              </Pressable> */}
            </View>
            {/* </LinearGradient> */}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CurableSTIModal;
