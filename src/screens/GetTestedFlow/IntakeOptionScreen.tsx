import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Cards from "src/components/Cards/Cards";
import CheckBox from "src/components/CheckBox";
import GenericModal from "src/components/GetTestedFlow/GenericModal";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import HomeHeader from "src/components/HomeScreen/Header";
import UserHeader from "src/components/HomeScreen/UserHeader";
import IconButton from "src/components/IconButton";
import { SV, Text } from "src/components/Themed";
import { Colors, gradients } from "src/constants/Colors";
import { Loading } from "src/constants/enums";
import TestServices from "src/services/TestServices";
import useUserStore from "src/store/userStore";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import { Toast } from "src/components/ToastManager";

export type GetTestedNavOptions = {
  name: string;
  value: boolean;
};

const IntakeOptionScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"IntakeOptions">) => {
  const { showModal, closeModal } = useModal();
  const user = useUserStore((state) => state.user);
  const [gender, setGender] = useState<any>(user?.gender ?? "");

  const [previousSTIs, setPreviousSTIs] = useState<boolean | undefined>(
    undefined
  );
  const [currentSymptoms, setCurrentSymptoms] = useState<boolean | undefined>(
    undefined
  );
  const [partnerSTIs, setPartnerSTIs] = useState<boolean | undefined>(
    undefined
  );
  const [PartnerSymptoms, setPartnerSymptoms] = useState<boolean | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<Loading>(Loading.idle);

  var IntakeFormData = route.params.IntakeForm;
  var IntakeFormData = {
    ...IntakeFormData,
    gender,
  };

  var getTestedOptions = route.params.getTestedOptions;
  var getTestedOptions = {
    ...getTestedOptions,
    currentSymptoms,
    PartnerSymptoms,
  };

  // console.log("getTestedOptions--", getTestedOptions);
  const handleNavigation = async () => {
    const updatedOptions: GetTestedNavOptions[] = [
      {
        name: "PreviousSTIs",
        value: previousSTIs === true ? true : false,
      },
      {
        name: "CurrentSymptoms",
        value: currentSymptoms === true ? true : false,
      },
      {
        name: "PartnerPreviousSTIs",
        value: partnerSTIs === true ? true : false,
      },
      {
        name: "PartnerSymptoms",
        value: PartnerSymptoms === true ? true : false,
      },
    ];

    const trueOptions = updatedOptions.filter(
      (option) => option.value === true
    );

    if (trueOptions.length === 0) {
      try {
        setLoading(Loading.loading);
        const res = await TestServices.saveIntakeDetails(IntakeFormData);
        if (res.status === 200) {
          setLoading(Loading.idle);
          navigation.navigate("ChoosePlan", {
            IntakeForm: IntakeFormData,
          });
        }
      } catch (error: any) {
        console.log(error.response.data);
        setLoading(Loading.error);
        showModal({
          isVisible: true,
          heading: "Error",
          body: error.response.data.message,
          buttonText: "Okay",
          onClose: () => {
            closeModal();
          },
        });
      }
    } else {
      try {
        setLoading(Loading.loading);
        const res = await TestServices.saveIntakeDetails(IntakeFormData);
        if (res.status === 200) {
          setLoading(Loading.idle);
          navigation.navigate(trueOptions[0].name, {
            IntakeForm: IntakeFormData,
            NavOptions: trueOptions,
          });
        }
      } catch (error: any) {
        console.log(error.response.data);
        setLoading(Loading.error);
        showModal({
          isVisible: true,
          heading: "Error",
          body: error.response.data.message,
          buttonText: "Okay",
          onClose: () => {
            closeModal();
          },
        });
      }
    }
  };

  const handleNext = () => {
    if (
      !gender ||
      currentSymptoms === undefined ||
      PartnerSymptoms === undefined
    ) {
      Toast.error("Oops! you're missing something");
      return;
    }

    const updatedOptions: GetTestedNavOptions[] = [
      {
        name: "PreviousSTIs",
        value: false,
      },
      {
        name: "CurrentSymptoms",
        value: currentSymptoms === true ? true : false,
      },
      {
        name: "PartnerPreviousSTIs",
        value: false,
      },
      {
        name: "PartnerSymptoms",
        value: PartnerSymptoms === true ? true : false,
      },
    ];

    const trueOptions = updatedOptions.filter(
      (option) => option.value === true
    );

    if (trueOptions.length === 0) {
      navigation.navigate("ChoosePlan", {
        IntakeForm: IntakeFormData,
        getTestedOptions: getTestedOptions,
      });
    } else {
      navigation.navigate(trueOptions[0].name, {
        IntakeForm: IntakeFormData,
        NavOptions: trueOptions,
      });
    }
  };

  return (
    <SV style={{ flex: 1 }}>
      <UserHeader />

      <View style={styles.innerContainer}>
        <Cards
          refrenceCard
          backNavigate
          headerTxt={"Almost done"}
          bottomLabel={user ? "Next" : "Create your account"}
          width={user ? RFPercentage(12) : RFPercentage(29)}
          onNavClick={() => handleNext()}
        >
          <Text textType="medium" style={styles.optionTitle}>
            We just need a little more information to complete your order
          </Text>

          <View style={styles.orderingContainer}>
            <Text textType="medium" style={styles.orderingTitle}>
              Are you currently experiencing any symptoms?
            </Text>
            <View style={styles.row}>
              <IconButton
                checked={currentSymptoms === true}
                checkedLabel={currentSymptoms ? "Yes" : ""}
                unCheckedLabel="Yes"
                mark
                checkedIcon
                onPress={() => setCurrentSymptoms(true)}
              />
              <IconButton
                checked={currentSymptoms === false}
                mark
                checkedIcon
                unCheckedLabel="No"
                checkedLabel={!currentSymptoms ? "No" : ""}
                onPress={() => setCurrentSymptoms(false)}
              />
            </View>
          </View>

          <View
            style={[
              styles.orderingContainer,
              { borderTopWidth: 0, borderBottomWidth: 1 },
            ]}
          >
            <Text textType="medium" style={styles.orderingTitle}>
              Are any current or former partners experiencing any symptoms?
            </Text>
            <View style={styles.row}>
              <IconButton
                checked={PartnerSymptoms === true}
                checkedLabel={PartnerSymptoms ? "Yes" : ""}
                unCheckedLabel="Yes"
                mark
                checkedIcon
                onPress={() => setPartnerSymptoms(true)}
              />
              <IconButton
                checked={PartnerSymptoms === false}
                mark
                checkedIcon
                unCheckedLabel="No"
                checkedLabel={!PartnerSymptoms ? "No" : ""}
                onPress={() => setPartnerSymptoms(false)}
              />
            </View>
          </View>

          <View
            style={[
              styles.orderingContainer,
              { borderTopWidth: 0, borderBottomWidth: 0 },
            ]}
          >
            <Text textType="medium" style={styles.orderingTitle}>
              What was your assigned gender at birth?
            </Text>
            <View style={styles.row}>
              <IconButton
                checked={gender === "Male"}
                checkedLabel={gender === "Male" ? "Male" : "Female"}
                unCheckedLabel="Male"
                mark
                checkedIcon
                onPress={() => setGender("Male")}
              />
              <IconButton
                checked={gender === "Female"}
                mark
                checkedIcon
                unCheckedLabel="Female"
                checkedLabel={gender === "Female" ? "Female" : "Male"}
                onPress={() => setGender("Female")}
              />
            </View>
          </View>
        </Cards>
      </View>
      {/* <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(16) + 64
              : RFPercentage(16) + 48,
          paddingTop: 16,
        }}
      >
        <View style={styles.f1g4}>
          <View
            style={[
              {
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
              },
            ]}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text textType="LBRegular" style={styles.label}>
                Have you previously been diagnosed with any STIs?
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.nameRow}>
            <View
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                },
              ]}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    setPreviousSTIs(true);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckBox
                    rounded
                    checked={previousSTIs === true}
                    onValueChange={() => {
                      setPreviousSTIs(true);
                    }}
                    color={Colors.velvet}
                    checkedColor={Colors.primary}
                    disabledColor={Colors.velvet}
                  />
                  <Text
                    style={{
                      color: Colors.velvet,
                      fontSize: 14,
                      paddingHorizontal: 8,
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
            <View
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                },
              ]}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    setPreviousSTIs(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckBox
                    rounded
                    checked={previousSTIs === false}
                    onValueChange={() => {
                      setPreviousSTIs(false);
                    }}
                    color={Colors.velvet}
                    checkedColor={Colors.primary}
                    disabledColor={Colors.velvet}
                  />
                  <Text
                    style={{
                      color: Colors.velvet,
                      fontSize: 14,
                      paddingHorizontal: 8,
                    }}
                  >
                    No
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </View>
        <View style={styles.f1g4}>
          <View
            style={[
              {
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
              },
            ]}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text textType="LBRegular" style={styles.label}>
                Are you currently experiencing any symptoms?
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.nameRow}>
            <View
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                },
              ]}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    setCurrentSymptoms(true);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckBox
                    rounded
                    checked={currentSymptoms === true}
                    onValueChange={() => {
                      setCurrentSymptoms(true);
                    }}
                    color={Colors.velvet}
                    checkedColor={Colors.primary}
                    disabledColor={Colors.velvet}
                  />
                  <Text
                    style={{
                      color: Colors.velvet,
                      fontSize: 14,
                      paddingHorizontal: 8,
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
            <View
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                },
              ]}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    setCurrentSymptoms(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckBox
                    rounded
                    checked={currentSymptoms === false}
                    onValueChange={() => {
                      setCurrentSymptoms(false);
                    }}
                    color={Colors.velvet}
                    checkedColor={Colors.primary}
                    disabledColor={Colors.velvet}
                  />
                  <Text
                    style={{
                      color: Colors.velvet,
                      fontSize: 14,
                      paddingHorizontal: 8,
                    }}
                  >
                    No
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </View>
        <View style={styles.f1g4}>
          <View
            style={[
              {
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
              },
            ]}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text textType="LBRegular" style={styles.label}>
                Is your current or previous partner living with any STIs?
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.nameRow}>
            <View
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                },
              ]}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    setPartnerSTIs(true);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckBox
                    rounded
                    checked={partnerSTIs === true}
                    onValueChange={() => {
                      setPartnerSTIs(true);
                    }}
                    color={Colors.velvet}
                    checkedColor={Colors.primary}
                    disabledColor={Colors.velvet}
                  />
                  <Text
                    style={{
                      color: Colors.velvet,
                      fontSize: 14,
                      paddingHorizontal: 8,
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
            <View
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                },
              ]}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    setPartnerSTIs(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckBox
                    rounded
                    checked={partnerSTIs === false}
                    onValueChange={() => {
                      setPartnerSTIs(false);
                    }}
                    color={Colors.velvet}
                    checkedColor={Colors.primary}
                    disabledColor={Colors.velvet}
                  />
                  <Text
                    style={{
                      color: Colors.velvet,
                      fontSize: 14,
                      paddingHorizontal: 8,
                    }}
                  >
                    No
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </View>
        <View style={styles.f1g4}>
          <View
            style={[
              {
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
              },
            ]}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text textType="LBRegular" style={styles.label}>
                Is your current or previous partner experiencing any symptoms?
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.nameRow}>
            <View
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                },
              ]}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    setPartnerSymptoms(true);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckBox
                    rounded
                    checked={PartnerSymptoms === true}
                    onValueChange={() => {
                      setPartnerSymptoms(true);
                    }}
                    color={Colors.velvet}
                    checkedColor={Colors.primary}
                    disabledColor={Colors.velvet}
                  />
                  <Text
                    style={{
                      color: Colors.velvet,
                      fontSize: 14,
                      paddingHorizontal: 8,
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
            <View
              style={[
                {
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                },
              ]}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    setPartnerSymptoms(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckBox
                    rounded
                    checked={PartnerSymptoms === false}
                    onValueChange={() => {
                      setPartnerSymptoms(false);
                    }}
                    color={Colors.velvet}
                    checkedColor={Colors.primary}
                    disabledColor={Colors.velvet}
                  />
                  <Text
                    style={{
                      color: Colors.velvet,
                      fontSize: 14,
                      paddingHorizontal: 8,
                    }}
                  >
                    No
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </View>

        <View
          style={{
            gap: 8,
            flexDirection: "row",
            paddingVertical: 32,
          }}
        >
          <View
            style={[
              {
                flex: 1,
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
              },
            ]}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  textType="LBBold"
                  style={{
                    color: Colors.velvet,
                    fontSize: 16,
                    paddingHorizontal: 8,
                  }}
                >
                  Previous
                </Text>
              </Pressable>
            </LinearGradient>
          </View>
          <View
            style={[
              {
                flex: 1,
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
                opacity:
                  previousSTIs === undefined ||
                  currentSymptoms === undefined ||
                  partnerSTIs === undefined ||
                  PartnerSymptoms === undefined
                    ? 0.5
                    : 1,
              },
            ]}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Pressable
                disabled={
                  previousSTIs === undefined ||
                  currentSymptoms === undefined ||
                  partnerSTIs === undefined ||
                  PartnerSymptoms === undefined
                    ? true
                    : false
                }
                onPress={() => {
                  handleNavigation();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading === Loading.loading ? (
                  <ActivityIndicator color={Colors.velvet} />
                ) : (
                  <Text
                    textType="LBBold"
                    style={{
                      fontSize: 16,
                      color: Colors.velvet,
                    }}
                  >
                    Next
                  </Text>
                )}
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </ScrollView> */}
    </SV>
  );
};

export default IntakeOptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
  },
  nameRow: {
    flexDirection: "row",
    gap: 8,
  },
  f1g4: {
    gap: 12,
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    color: Colors.velvet,
    textAlign: "center",
  },
  emailAndPhoneInput: {
    fontFamily: "DMSans_500Medium",
    color: Colors.velvet,
  },

  innerContainer: {
    padding: 10,
  },

  optionTitle: {
    textAlign: "center",
    color: Colors.black,
    fontSize: Platform.OS === "ios" ? RFPercentage(1.9) : RFPercentage(1.7),
    lineHeight: 26,
    width: "85%",
    alignSelf: "center",
  },
  orderingTitle: {
    textAlign: "center",
    fontSize: RFPercentage(2),
    color: Colors.black,
    marginBottom: 10,
  },
  orderingContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 20,
    borderColor: Colors.primary,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "70%",
    alignSelf: "center",
  },
});
