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
import PartnerSTIModal from "src/components/GetTestedFlow/PartnerSTIModal";
import { GetTestedNavOptions } from "./IntakeOptionScreen";
import StrokeText from "src/components/StrokeText";
import Cards from "src/components/Cards/Cards";
import UserHeader from "src/components/HomeScreen/UserHeader";

const PartnerSTIsScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"PartnerPreviousSTIs">) => {
  const [noneSelected, setNoneSelected] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [CurrentNavOptions, setCurrentNavOptions] = useState<
    GetTestedNavOptions[]
  >(route.params.NavOptions);

  useEffect(() => {
    setCurrentNavOptions((prevNavOptions) => {
      if (Array.isArray(prevNavOptions)) {
        return prevNavOptions.filter(
          (option) => option.name !== "PartnerPreviousSTIs"
        );
      }
      return [];
    });
  }, []);

  const [selectedDiseases, setSelectedDiseases] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const diseases = [
    { Id: 1, UiName: "Herpes I" },
    { Id: 2, UiName: "Herpes II" },
    { Id: 3, UiName: "HIV" },
    // { Id: 6, UiName: "Hepatitis B" },
    // { Id: 7, UiName: "Hepatitus C" },
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
            headerTxt={`My partner is living with the following...`}
            textStyle={{
              width: "80%",
              textAlign: "center",
              fontSize: RFPercentage(2.0),
              marginTop: 10,
            }}
            disabled={!noneSelected && selectedDiseases.length === 0}
            onNavClick={() => {
              if (noneSelected) {
                const nextRoute = CurrentNavOptions
                  ? CurrentNavOptions[0]
                  : null;
                // navigation.navigate(nextRoute ? nextRoute.name : "ChoosePlan", {
                //   IntakeForm: route.params.IntakeForm,
                //   NavOptions: CurrentNavOptions,
                // });
                navigation.navigate(
                  nextRoute ? nextRoute.name : "ReceivingResults",
                  {
                    IntakeForm: route.params.IntakeForm,
                    NavOptions: CurrentNavOptions,
                  }
                );
              } else if (selectedDiseases.length > 0) {
                setModalVisible(true);
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

              <ClickableItem
                item="None of the above"
                onPress={() => {
                  setSelectedDiseases([]);
                  setNoneSelected(true);
                }}
                checked={noneSelected}
              />
            </View>
          </Cards>
        </View>
      </ScrollView>

      <PartnerSTIModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        previousdiseases={selectedDiseases}
        IntakeForm={route.params.IntakeForm}
      />
    </SV>
  );
};

export default PartnerSTIsScreen;
