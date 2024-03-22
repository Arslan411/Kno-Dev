import { SV, Text } from "src/components/Themed";
import HomeHeader from "src/components/HomeScreen/Header";
import { Platform, ScrollView, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Colors, gradients } from "src/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import FormGradient from "src/components/forms/FormGradient";
import ClickableItem from "src/components/GetTestedFlow/ClickableItem";
import { useState } from "react";
import BigColoredButton from "src/components/BigColoredButton";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import PreviousSTIModal from "src/components/GetTestedFlow/PreviousSTIModal";
import usepreviousStiStore from "src/store/previousStiStore";
import useUserStore from "src/store/userStore";
import { previousStiType } from "src/store/previousStiStore";
import StrokeText from "src/components/StrokeText";

const SelfReportingScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"SelfReporting">) => {
  const [noneSelected, setNoneSelected] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const previousStis = usepreviousStiStore((state) => state.previousStis);
  const setPreviousSti = usepreviousStiStore((state) => state.setPreviousSti);

  const navigate = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

  const user = useUserStore((state) => state.user);
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
  ];

  return (
    <SV style={{ flex: 1 }}>
      <HomeHeader />
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
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderBottomWidth: 4,
            borderColor: Colors.velvet,
            margin: 12,
            borderRadius: 12,
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0, 0]}
            end={[1, 1]}
            style={{
              flex: 1,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <FormGradient
              style={{
                borderTopWidth: 0,
                borderStartWidth: 0.25,
                borderEndWidth: 0.25,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <StrokeText
                  fontSize={20}
                  myText={`My partner is living with the following...`}
                />
                {/* <Text
                  textType="LBBold"
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: Colors.velvet,
                  }}
                >
                  I’ve previously been diagnosed
                  {"\n"}
                  with the following...
                </Text> */}
              </View>
            </FormGradient>

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
          </LinearGradient>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            marginBottom: 16,
            marginHorizontal: 12,
          }}
        >
          <BigColoredButton
            onPress={() => {
              navigation.goBack();
            }}
            text="Previous"
          />
          <BigColoredButton
            disabled={selectedDiseases.length === 0 && !noneSelected}
            onPress={() => {
              if (noneSelected) {
                // store email and blank array
                const userIndex = previousStis.findIndex(
                  (item: previousStiType) =>
                    item.email === user?.primaryEmail || ""
                );

                if (userIndex !== -1) {
                  const updatedPreviousStis = [...previousStis];
                  updatedPreviousStis[userIndex].stis = [];
                  setPreviousSti(updatedPreviousStis);
                } else {
                  const newEntry = {
                    email: user?.primaryEmail || "",
                    stis: [],
                  };

                  setPreviousSti([...previousStis, newEntry]);
                }

                navigate();
              } else {
                setModalVisible(true);
              }
            }}
            text="Next"
          />
        </View>
      </ScrollView>

      <PreviousSTIModal
        NavOptions={[]}
        IntakeFormData={undefined}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        previousdiseases={selectedDiseases}
      />
    </SV>
  );
};

export default SelfReportingScreen;
