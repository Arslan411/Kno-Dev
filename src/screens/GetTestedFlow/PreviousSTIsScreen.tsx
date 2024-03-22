import { SV, Text } from "src/components/Themed";
import HomeHeader from "src/components/HomeScreen/Header";
import { Platform, ScrollView, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Colors, gradients } from "src/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import FormGradient from "src/components/forms/FormGradient";
import ClickableItem from "src/components/GetTestedFlow/ClickableItem";
import { useEffect, useState } from "react";
import BigColoredButton from "src/components/BigColoredButton";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import PreviousSTIModal from "src/components/GetTestedFlow/PreviousSTIModal";
import usepreviousStiStore from "src/store/previousStiStore";
import useUserStore from "src/store/userStore";
import { previousStiType } from "src/store/previousStiStore";
import StrokeText from "src/components/StrokeText";
import CurableSTIModal from "src/components/GetTestedFlow/CurableSTIModal";
import { GetTestedNavOptions } from "./IntakeOptionScreen";
import Cards from "src/components/Cards/Cards";
import UserHeader from "src/components/HomeScreen/UserHeader";
import IconButton from "src/components/IconButton";

const PreviousSTIsScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"PreviousSTIs">) => {
  const [noneSelected, setNoneSelected] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [curableModalVisible, setCurableModalVisible] =
    useState<boolean>(false);
  const previousStis = usepreviousStiStore((state) => state.previousStis);
  const setPreviousSti = usepreviousStiStore((state) => state.setPreviousSti);
  const IntakeFormData = route.params.IntakeForm;
  const [CurrentNavOptions, setCurrentNavOptions] = useState<
    GetTestedNavOptions[]
  >(route.params.NavOptions);

  useEffect(() => {
    setCurrentNavOptions((prevNavOptions) => {
      if (Array.isArray(prevNavOptions)) {
        return prevNavOptions.filter(
          (option) => option.name !== "PreviousSTIs"
        );
      }
      return [];
    });
  }, []);

  const user = useUserStore((state) => state.user);
  const [selectedDiseases, setSelectedDiseases] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [selectedCurableDiseases, setSelectedCurableDiseases] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const diseases = [
    { Id: 1, UiName: "Herpes I" },
    { Id: 2, UiName: "Herpes II" },
    { Id: 3, UiName: "HIV" },
  ];

  const CurableDiseases = [
    { Id: 4, UiName: "Mpox" },
    { Id: 5, UiName: "Trich" },
    { Id: 8, UiName: "Syphilis" },
    { Id: 9, UiName: "Chlamydia" },
    { Id: 10, UiName: "Gonorrhea" },
    { Id: 11, UiName: "Mycoplasm Genitalium" },
  ];

  return (
    <SV style={{ flex: 1 }}>
      <UserHeader />
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(16) + 64
              : RFPercentage(16) + 64,
        }}
      >
        <View style={{ padding: 10 }}>
          <Cards
            backNavigate
            bottomLabel={"Next"}
            width={RFPercentage(12)}
            refrenceCard
            headerTxt={`I've previously been diagnosed ${"\n"} with the following...`}
            textStyle={{
              width: "80%",
              textAlign: "center",
              fontSize: RFPercentage(2.0),
              marginTop: 10,
            }}
            disabled={
              selectedDiseases.length === 0 &&
              selectedCurableDiseases.length === 0 &&
              !noneSelected
            }
            onNavClick={() => {
              if (selectedCurableDiseases.length > 0) {
                setCurableModalVisible(true);
              } else if (selectedDiseases.length > 0) {
                setModalVisible(true);
              } else if (
                (noneSelected && CurrentNavOptions === null) ||
                CurrentNavOptions.length === 0
              ) {
                // navigation.navigate("ChoosePlan", {
                //   IntakeForm: IntakeFormData,
                // });
                navigation.navigate("ReceivingResults", {
                  IntakeForm: IntakeFormData,
                });
              } else if (
                noneSelected &&
                CurrentNavOptions !== null &&
                CurrentNavOptions.length > 0
              ) {
                const nextScreen = CurrentNavOptions[0];
                navigation.navigate(nextScreen.name, {
                  IntakeForm: IntakeFormData,
                  NavOptions: CurrentNavOptions,
                });
              }
            }}
          >
            <View
              style={{
                paddingVertical: 12,
              }}
            >
              {diseases.map((item) => (
                <ClickableItem
                  key={item.Id}
                  item={item.UiName}
                  onPress={() => {
                    const itemName = item.UiName;
                    const itemId = item.Id;
                    if (
                      selectedDiseases.some((disease) => disease.id === itemId)
                    ) {
                      setSelectedDiseases((prevDiseases) =>
                        prevDiseases.filter((disease) => disease.id !== itemId)
                      );
                    } else {
                      setSelectedDiseases((prevDiseases) => [
                        ...prevDiseases,
                        { id: itemId, name: itemName },
                      ]);
                    }
                    setNoneSelected(false);
                  }}
                  checked={selectedDiseases.some(
                    (disease) => disease.id === item.Id
                  )}
                />
              ))}

              {CurableDiseases.map((item) => (
                <ClickableItem
                  key={item.Id}
                  item={item.UiName}
                  onPress={() => {
                    const itemName = item.UiName;
                    const itemId = item.Id;
                    if (
                      selectedCurableDiseases.some(
                        (disease) => disease.id === itemId
                      )
                    ) {
                      setSelectedCurableDiseases((prevDiseases) =>
                        prevDiseases.filter((disease) => disease.id !== itemId)
                      );
                    } else {
                      setSelectedCurableDiseases((prevDiseases) => [
                        ...prevDiseases,
                        { id: itemId, name: itemName },
                      ]);
                    }
                    setNoneSelected(false);
                  }}
                  checked={selectedCurableDiseases.some(
                    (disease) => disease.id === item.Id
                  )}
                />
              ))}

              <ClickableItem
                item="None of the above"
                onPress={() => {
                  setSelectedDiseases([]);
                  setSelectedCurableDiseases([]);
                  const userIndex = previousStis.findIndex(
                    (item: previousStiType) => item.email === user?.primaryEmail
                  );

                  if (userIndex !== -1) {
                    const updatedPreviousStis = [...previousStis];
                    updatedPreviousStis[userIndex].stis = [];
                    setPreviousSti(updatedPreviousStis);
                  }
                  setNoneSelected(true);
                }}
                checked={noneSelected}
              />
            </View>
          </Cards>
        </View>

        {/* <BigColoredButton
            disabled={
              selectedDiseases.length === 0 &&
              selectedCurableDiseases.length === 0 &&
              !noneSelected
            }
            onPress={() => {
              console.log("CurrentNavOptions", CurrentNavOptions);
              if (selectedCurableDiseases.length > 0) {
                setCurableModalVisible(true);
              } else if (selectedDiseases.length > 0) {
                setModalVisible(true);
              } else if (
                (noneSelected && CurrentNavOptions === null) ||
                CurrentNavOptions.length === 0
              ) {
                navigation.navigate("ChoosePlan", {
                  IntakeForm: IntakeFormData,
                });
              } else if (
                noneSelected &&
                CurrentNavOptions !== null &&
                CurrentNavOptions.length > 0
              ) {
                const nextScreen = CurrentNavOptions[0];
                navigation.navigate(nextScreen.name, {
                  IntakeForm: IntakeFormData,
                  NavOptions: CurrentNavOptions,
                });
              }
            }}
            text="Next"
          /> */}
      </ScrollView>

      <PreviousSTIModal
        NavOptions={CurrentNavOptions}
        IntakeFormData={IntakeFormData}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        previousdiseases={selectedDiseases}
        route={route}
      />

      <CurableSTIModal
        NavOptions={CurrentNavOptions}
        IntakeFormData={IntakeFormData}
        previousDiseases={selectedDiseases}
        previousCurablediseases={selectedCurableDiseases}
        previousCurableModalVisible={curableModalVisible}
        setPreviousCurableModalVisible={setCurableModalVisible}
        route={route}
      />
    </SV>
  );
};

export default PreviousSTIsScreen;
