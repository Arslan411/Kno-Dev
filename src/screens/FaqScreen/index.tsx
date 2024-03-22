import { StyleSheet } from "react-native";
import { Icon, SV, Text } from "src/components/Themed";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import React, { useState } from "react";
import { Colors, gradients } from "src/constants/Colors";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  View,
  Image,
  FlatList,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import FormGradient from "src/components/forms/FormGradient";
import { Pressable } from "react-native";
import FaqList from "src/components/FaqList/FaqList";
import { Loading } from "src/constants/enums";
import ProfileServices from "src/services/ProfileServices";
import StrokeText from "src/components/StrokeText";
import AuthHeader from "src/components/AuthHeader";
import styles from "src/components/ToastManager/styles";
import FaqCard from "./FaqCard";
import { images } from "src/utils/Images";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
// import { FlatList } from "react-native-gesture-handler";
export type QuestionType = {
  Question: string;
  Answer: string;
  text: string;
  subtext: string;
};
const FaqScreen = ({ navigation }: HomeStackScreenProps<"FaqScreen">) => {
  const [data, setData] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  const FaqData = [
    {
      Answer: `Dating is fun. Testing isn't.knō-ing makes testing worth while.Yes, we screen for a wide range of STIs.Yes, we make the process simpler.Yes, we make sharing your testing history simple.Yes, we make you look like more of a snack in the process with the knō app & the knō badges.`,
      Question: "What makes knō different than other at-home STI testing kits?",
    },
    {
      Answer: `knō allows you to test for a lot of stuff - all in one kit - if you are into that kinda thing.If you must know, here's the list:
\u25CF Herpes 1
\u25CF Herpes 2
\u25CF HIV
\u25CF Mpox
\u25CF Trich
\u25CF Syphilis
\u25CF Chlamydia
\u25CF Gonorrhea
\u25CF Mycoplasma Genitalium`,
      Question: `What STIs does my knō kit screen for?`,
    },
    {
      Answer: `Valid is a strong word. We don't know what you get up to in between tests - and that's fine, we're into it. We expire results every 6 months to promote regular testing - but how often you test is highly dependent on your own sexual activity & how many partners you have.`,
      Question: `How long are my results valid?`,
    },
    {
      Answer: `Results should generally be available within one week of shipping your kit to our labs.`,
      Question: `How long does it take to get my results?`,
    },
    {
      Answer: `Unfortunately, no. knō was created as a regular screening service to help support sex-positivity and communication through shame-free at-home testing. That said - we are not doctors. If you or your partner are symptomatic, or think you've been exposed, it's likely you'll need to be tested anyway - but a doctor will be able to prescribe precautionary medicine, refer you to specialists, and provide a whole plethora of other services (oral and anal swabs) that we simply cannot.`,
      Question: `Should I test with knō if I'm symptomatic or think I've been exposed?`,
    },
    {
      Answer: `There's always going to be those who try to cheat the system. knō makes it so that faking results would be incredibly difficult - outside of stealing someone else's blood.\nIn reality, it's much easier to fake a PDF than an entire app ecosystem - so if you want to play safe, just ask that your potential partner logs into their account to share results IRL.`,
      Question: `Can  knō results be faked?`,
    },
  ];

  const fetchFaqs = async () => {
    setLoading(Loading.loading);
    try {
      const response = await ProfileServices.fetchFaqs();
      if (response.status === 200) {
        setData(response.data.data);
        setLoading(Loading.idle);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      setLoading(Loading.error);
    }
  };
  React.useEffect(() => {
    fetchFaqs();
  }, []);
  const handleToggle = (index: number) => {
    setSelectedQuestionIndex(index);
  };
  return (
    <SV style={{ flex: 1 }}>
      <UserHeader />
      {loading === Loading.loading ? (
        <View
          style={{
            paddingTop: RFPercentage(25),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.velvet} />
        </View>
      ) : (
        <View style={{ padding: 10 }}>
          <Cards headerCard backNavigate headerTxt="FAQ’s">
            <View
              style={{
                backgroundColor: Colors.white,
                margin: 8,
                borderRadius: 12,
                height: "81%",
              }}
            >
              <Text textType="bold" style={Styles.heading2}>
                You should knō the answers to these questions
              </Text>

              <View style={{ height: "101%" }}>
                <FlatList
                  data={FaqData}
                  renderItem={({ item }) => (
                    <View>
                      <FaqCard item={item} />
                    </View>
                  )}
                />
              </View>
            </View>
          </Cards>
        </View>
      )}
    </SV>
  );
};
export default FaqScreen;
const Styles = StyleSheet.create({
  headingText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 18,
    marginRight: 24,
    marginLeft: 95,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  heading2: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: RFPercentage(1.8),
    lineHeight: 20,
    letterSpacing: 0.25,
    marginBottom: 10,
  },
});

{
  /* <View style={{ alignItems: "center" }}>
            <Pressable
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
                marginBottom: 24,
              }}
              onPress={() => Linking.openURL("mailto:support@kno.co")}
            >
              <LinearGradient
                colors={gradients.primary}
                // start={[0, 0.3]}
                // end={[0, 1]}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  textType="LBBold"
                  style={{
                    fontSize: 16,
                    marginHorizontal: 32,
                    color: Colors.velvet,
                  }}
                >
                  Contact Us
                </Text>
              </LinearGradient>
            </Pressable>
          </View> */
}
