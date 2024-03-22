import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import ClickableItem from "./ClickableItem";
import {
  HomeStackParamList,
  ProfileStackParamList,
  RootStackParamList,
  RootTabParamList,
  StackNavigation,
} from "src/types/NavigationTypes";
import { RouteProp, useNavigation } from "@react-navigation/native";
import usepreviousStiStore from "src/store/previousStiStore";
import useUserStore from "src/store/userStore";
import { GetTestedNavOptions } from "src/screens/GetTestedFlow/IntakeOptionScreen";
import StrokeText from "../StrokeText";
import IconButton from "../IconButton";

type PreviousSTIModalProps = {
  modalVisible: boolean;
  IntakeFormData: any;
  setModalVisible: (visible: boolean) => void;
  previousdiseases: { id: number; name: string }[];
  route?: RouteProp<
    RootStackParamList &
      RootTabParamList &
      ProfileStackParamList &
      HomeStackParamList,
    "PreviousSTIs"
  >;
  NavOptions: GetTestedNavOptions[] | null;
};

const PreviousSTIModal = ({
  modalVisible,
  IntakeFormData,
  setModalVisible,
  previousdiseases,
  route,
  NavOptions,
}: PreviousSTIModalProps) => {
  const navigation = useNavigation<StackNavigation>();
  const setPreviousSti = usepreviousStiStore((state) => state.setPreviousSti);
  const user = useUserStore((state) => state.user);
  const previousStis = usepreviousStiStore((state) => state.previousStis);
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2].name;

  const navigate = () => {
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

  const click = () => {
    const timer = setTimeout(() => navigate(), 350);
    return () => clearTimeout(timer);
  };

  const userExistsInPreviousStis = previousStis.some(
    (entry) => entry.email === user?.primaryEmail
  );

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <Pressable
        style={{
          flex: 1,
          justifyContent: "center",
          marginHorizontal: 6,
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <Pressable
          style={{
            height: RFPercentage(55),
            marginTop: RFPercentage(8),
            marginHorizontal: 6,
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
            {/* <StrokeText
              myText={`Thank you for \n sharing that you are\nliving with...`}
            /> */}

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
              {`Thank you for sharing that you are living with...`}
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
                {previousdiseases.map((symptom, index) => (
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
              Thank you for sharing your (
              {previousdiseases.map((symptom, index) => (
                <Text
                  key={index}
                  textType="regular"
                  style={{
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                  }}
                >
                  {symptom.name}
                  {index === previousdiseases.length - 1 ? "" : ", "}
                </Text>
              ))}
              ) status. A detected or self reported result will be added to your
              results page.
            </Text>

            {/* <Pressable
              onPress={() => {
                setModalVisible(false);

                if (userExistsInPreviousStis) {
                  const updatedPreviousStis = previousStis.map((entry) => {
                    if (entry.email === user?.primaryEmail) {
                      return {
                        ...entry,
                        stis: previousdiseases.map((disease) => disease.id),
                      };
                    }
                    return entry;
                  });

                  setPreviousSti(updatedPreviousStis);
                } else {
                  const newEntry = {
                    email: user?.primaryEmail || "",
                    stis: previousdiseases.map((disease) => disease.id),
                  };

                  setPreviousSti([...previousStis, newEntry]);
                }

                if (prevRoute === "Dashboard") {
                  click();
                } else if (
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
                } else if (NavOptions !== null && NavOptions.length > 0) {
                  const nextScreen = NavOptions[0];
                  navigation.navigate(nextScreen.name, {
                    IntakeForm: IntakeFormData,
                    NavOptions: NavOptions,
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
                  Got It!
                </Text>
              </LinearGradient>
            </Pressable> */}
            {/* </LinearGradient> */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                checked
                checkedLabel="Got it"
                width={RFPercentage(19)}
                height={RFPercentage(5.5)}
                fontSize={RFPercentage(1.85)}
                onPress={() => {
                  setModalVisible(false);

                  if (userExistsInPreviousStis) {
                    const updatedPreviousStis = previousStis.map((entry) => {
                      if (entry.email === user?.primaryEmail) {
                        return {
                          ...entry,
                          stis: previousdiseases.map((disease) => disease.id),
                        };
                      }
                      return entry;
                    });

                    setPreviousSti(updatedPreviousStis);
                  } else {
                    const newEntry = {
                      email: user?.primaryEmail || "",
                      stis: previousdiseases.map((disease) => disease.id),
                    };

                    setPreviousSti([...previousStis, newEntry]);
                  }

                  if (prevRoute === "Dashboard") {
                    click();
                  } else if (
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
                  } else if (NavOptions !== null && NavOptions.length > 0) {
                    const nextScreen = NavOptions[0];
                    navigation.navigate(nextScreen.name, {
                      IntakeForm: IntakeFormData,
                      NavOptions: NavOptions,
                    });
                  }
                }}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default PreviousSTIModal;
