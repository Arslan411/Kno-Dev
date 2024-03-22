import { SV, Text } from "src/components/Themed";
import HomeHeader from "src/components/HomeScreen/Header";
import { Platform, Pressable, ScrollView, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Colors, gradients } from "src/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import FormGradient from "src/components/forms/FormGradient";
import ClickableItem from "src/components/GetTestedFlow/ClickableItem";
import { useState } from "react";
import BigColoredButton from "src/components/BigColoredButton";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import GenericSymptomsModal from "src/components/GetTestedFlow/GenericSymptomsModal";
import StrokeText from "src/components/StrokeText";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";

const CurrentSymptomsScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"CurrentSymptoms">) => {
  const [noneSelected, setNoneSelected] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const symptoms: string[] = [
    "Cloudy/Bloody Discharge",
    "Yellow/Green Discharge",
    "Painful Urination",
    "Painful/Swollen Testicles",
    "Painful Bowel Movements",
    "Painful Intercourse",
    "Penile Itching/Irritation",
    "Anal Itching",
    "Testicular Pain",
    "Fever",
    "Aching Joints",
    "Weight Loss",
    "Abdominal Pain",
    "Painful Sores",
    "Non-painful Sores",
    "Sore Throat",
    "Headache",
    "Rash",
    "Swollen Lymph Nodes",
    "Fatigue",
    "Diarrhea",
    "Other",
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
            headerTxt={"I’m currently experiencing the following..."}
            textStyle={{
              width: "80%",
              textAlign: "center",
              fontSize: RFPercentage(2.0),
              marginTop: 10,
            }}
            disabled={currentSymptoms.length === 0 && !noneSelected}
            onNavClick={() => {
              setModalVisible(true);
            }}
          >
            <View
              style={{
                paddingVertical: 12,
              }}
            >
              {symptoms.map((item) => (
                <ClickableItem
                  key={item}
                  item={item}
                  onPress={() => {
                    if (currentSymptoms.includes(item)) {
                      setCurrentSymptoms(
                        currentSymptoms.filter((symptom) => symptom !== item)
                      );
                    } else {
                      setCurrentSymptoms([...currentSymptoms, item]);
                    }
                    setNoneSelected(false);
                  }}
                  checked={currentSymptoms.includes(item)}
                />
              ))}
            </View>
          </Cards>
        </View>
      </ScrollView>

      <GenericSymptomsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selected={currentSymptoms}
        heading="We are very sorry you are experiencing..."
        body="These things happen, but the knō test is designed for screening."
        secondBody="When experiencing symptoms it is best to visit a doctor for a more specific test and potentially treatment."
        buttonText="Exit"
      />
    </SV>
  );
};

export default CurrentSymptomsScreen;
