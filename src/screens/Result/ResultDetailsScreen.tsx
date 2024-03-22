import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ScrollViewIndicator } from "@fanchenbao/react-native-scroll-indicator";
import HTML from "react-native-render-html";
import { RFPercentage } from "react-native-responsive-fontsize";
import BigColoredButton from "src/components/BigColoredButton";
import ResultLabel, { ResultType } from "src/components/Results/ResultLabel";
import ResultModal from "src/components/Results/ResultModal";
import { SV, Text } from "src/components/Themed";
import FormGradient from "src/components/forms/FormGradient";
import { Colors, gradients } from "src/constants/Colors";
import { Loading } from "src/constants/enums";
import ResultServices from "src/services/ResultServices";
import useDiseaseStore from "src/store/diseaseStore";
import useOrderStore from "src/store/orderStore";
import useUserStore from "src/store/userStore";
import { RootTabScreenProps } from "src/types/NavigationTypes";
import usepreviousStiStore from "src/store/previousStiStore";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import MultipleResultModal from "src/components/Results/MultipleResultModal";
import ButtonWithIcon from "src/components/ButtonWIthIcon";
import StrokeText from "src/components/StrokeText";
import IconButton from "src/components/IconButton";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
import { diseasesHTML } from "src/data/diseases";

export type ResultResponse = {
  date: string;
  expired: boolean;
  pdf: string;
  results: ResultType[];
  resultsViewedOn: string | null;
};

const ResultDetailsScreen = ({
  navigation,
  route,
}: RootTabScreenProps<"Result">) => {
  const [wholeResult, setWholeResult] = useState<ResultResponse | null>(null);
  const [loading, setLoading] = useState<Loading>(Loading.loading);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore((state) => state.user);
  const order = useOrderStore((state) => state.order);
  const [results, setResults] = useState<ResultType[]>([]);
  const [filteredResults, setFilteredResults] = useState<ResultType[]>([]);
  const stis = useDiseaseStore((state) => state.stis);
  const [currentDisease, setCurrentDisease] = useState<ResultType | null>(null);
  const previousStis = usepreviousStiStore((state) => state.previousStis);
  const email = user?.primaryEmail;
  const userPreviousStis = previousStis.find((item) => item.email === email);
  const { showModal, closeModal } = useModal();
  const [showDiseasesModal, setShowDiseasesModal] = useState<boolean>(false);
  const [positiveResults, setPositiveResults] = useState<ResultType[]>([]);
  const { item } = route.params;
  const { name: diseaseName } = item;

  const fetchResults = async () => {
    if (order?.orderId) {
      setLoading(Loading.loading);
      try {
        const res = await ResultServices.fetchResult(order?.orderId);
        setWholeResult(res.data.data[0]);

        const mapping: Record<number, string> = {};
        stis.forEach((item) => {
          mapping[item.Id] = item.UiName;
        });

        const resultArray: ResultType[] = res.data.data[0].results.map(
          (item: ResultType) => ({
            id: item.id,
            name: mapping[item.id],
            value: item.value,
          })
        );

        const filteredResults = resultArray.filter(
          (result) => result.id !== undefined
        );

        if (userPreviousStis && userPreviousStis.stis.length > 0) {
          const userPreviousStisIds = new Set(userPreviousStis.stis);
          const updatedResults: ResultType[] = filteredResults.map(
            (result: ResultType) => ({
              id: result.id,
              name: result.name,
              value:
                result.value === "POSITIVE"
                  ? "POSITIVE"
                  : userPreviousStisIds.has(result.id)
                  ? "SELF_REPORTED"
                  : result.value,
            })
          );
          setResults(updatedResults);
          setLoading(Loading.idle);
          const positiveResults = updatedResults.filter(
            (item: ResultType) =>
              item.value === "POSITIVE" || item.value === "SELF_REPORTED"
          );
          setPositiveResults(positiveResults);
          if (
            wholeResult?.resultsViewedOn === null &&
            positiveResults.length >= 1
          ) {
            setShowDiseasesModal(true);
          }
        } else {
          setResults(filteredResults);
          const positiveResults: ResultType[] = filteredResults.filter(
            (item: ResultType) => item.value === "POSITIVE"
          );
          setPositiveResults(positiveResults);
          setLoading(Loading.idle);
          if (
            wholeResult?.resultsViewedOn === null &&
            positiveResults.length >= 1
          ) {
            setShowDiseasesModal(true);
          }
        }
      } catch (error: any) {
        showModal({
          isVisible: true,
          heading: "Not Yet!",
          body: "If you want to add the knō badge to your dating profile pics you have to actually knō first (that’s kind of the whole point).",
          anotherBody:
            "Don’t worry though, just click the button below to order a test and you’ll be on your way to swiping with confidence.",
          buttonText: "Get Tested",
          onClose: () => {
            closeModal();
            navigation.navigate("TestContent");
          },
        });
        setLoading(Loading.error);
      }
    } else {
      setLoading(Loading.error);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchResults();
    setRefreshing(false);
  };

  let diseaseData;
  switch (diseaseName) {
    case "Gonorrhea":
      diseaseData = diseasesHTML.find(
        (disease) => disease.name === "Gonorrhea"
      );
      break;
    case "Chlamydia":
      diseaseData = diseasesHTML.find(
        (disease) => disease.name === "Chlamydia"
      );
      break;
    case "Trich":
      diseaseData = diseasesHTML.find((disease) => disease.name === "Trich");
      break;
    case "Mycoplasm Genitalium":
      diseaseData = diseasesHTML.find(
        (disease) => disease.name === "Mycoplasm Genitalium"
      );
      break;
    case "Hepatitis C":
      diseaseData = diseasesHTML.find(
        (disease) => disease.name === "Hepatitis C"
      );
      break;
    case "Hepatitis B":
      diseaseData = diseasesHTML.find(
        (disease) => disease.name === "Hepatitis B"
      );
      break;
    case "Herpes I":
      diseaseData = diseasesHTML.find((disease) => disease.name === "Herpes I");
      break;
    case "Herpes II":
      diseaseData = diseasesHTML.find(
        (disease) => disease.name === "Herpes II"
      );
      break;
    case "MPox":
      diseaseData = diseasesHTML.find((disease) => disease.name === "MPox");
      break;
    case "HIV":
      diseaseData = diseasesHTML.find((disease) => disease.name === "HIV");
      break;
    case "Syphilis":
      diseaseData = diseasesHTML.find((disease) => disease.name === "Syphilis");
      break;
    default:
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No data available for {diseaseName}</Text>
        </View>
      );
  }

  console.log("disease", diseaseData);

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const newResults = results.filter(
      (item) => item?.name !== "Hepatitus B" && item?.name !== "Hepatitus C"
    );
    setFilteredResults(newResults);
  }, [results]);

  return (
    <SV style={styles.container}>
      <UserHeader />

      {loading === Loading.loading ? (
        <ActivityIndicator
          color={Colors.velvet}
          size="large"
          style={{ paddingTop: RFPercentage(20) }}
        />
      ) : results.length === 0 ? (
        // <View style={{ backgroundColor: "black", height: "75%" }}>
        <ScrollView
          scrollEnabled={false}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={onRefresh}
          //     colors={[Colors.velvet]}
          //   />
          // }
          style={[styles.scrollView]}
          keyboardShouldPersistTaps="handled"
          // contentContainerStyle={{
          //   paddingBottom:
          //     Platform.OS === "ios"
          //       ? RFPercentage(16) + 64
          //       : RFPercentage(16) + 64,
          // }}
        >
          <Cards
            backNavigate
            headerCard
            headerTxt="What now?"
            headerCardContainer={{ height: 600 }}
          >
            <View
              style={{
                alignItems: "center",
                marginBottom: 10,
                justifyContent: "center",
              }}
            >
              <Text textType="light" style={styles.header}>
                {`We've detected`} <Text textType="medium">{diseaseName}</Text>
              </Text>
              <View style={styles.separator} />
            </View>
            <View style={{ height: Platform.OS === "ios" ? 490 : 500 }}>
              <ScrollViewIndicator
                indStyle={{
                  backgroundColor: Colors.primary,
                  width: 7,
                }}
              >
                <View>
                  <HTML
                    source={{ html: diseaseData?.firstPoint }}
                    baseStyle={{
                      fontSize: 15,
                      textAlign: "center",
                      marginBottom: 10,
                      paddingHorizontal: 10,
                    }}
                  />
                  {/* <Text
                    // style={{
                    //   fontSize: 15,
                    //   // fontWeight: "bold",
                    //   textAlign: "center",
                    //   marginBottom: 10,
                    //   paddingHorizontal: 10,
                    // }}
                  >
                    {diseaseData?.firstPoint}
                  </Text> */}
                  <View style={{ paddingHorizontal: 10 }}>
                    <HTML
                      source={{ html: diseaseData?.html }}
                      baseStyle={{
                        fontSize: 15,
                        lineHeight: 30,
                        fontWeight: "bold",
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        // fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 10,
                        paddingHorizontal: 10,
                      }}
                    >
                      {diseaseData?.secondPoint}
                    </Text>
                  </View>
                  <View>
                    <HTML
                      source={{ html: diseaseData?.description }}
                      baseStyle={
                        {
                          // fontSize: 18,
                          // lineHeight: 36,
                          // fontWeight: "bold",
                        }
                      }
                    />
                  </View>
                </View>
              </ScrollViewIndicator>
              <View style={{ height: "20%" }}>
                <View style={styles.buttonContainer}>
                  <IconButton
                    width={"65%"}
                    checked={true}
                    checkedLabel="Back to results"
                    checkedLabelColor={{ color: Colors.black }}
                    // onPress={() => showModal(true)}
                    onPress={() => navigation.navigate("ResultScreen")}
                  />
                </View>
              </View>
            </View>
          </Cards>
        </ScrollView>
      ) : (
        // </View>
        // <ScrollView
        //   scrollEnabled={false}
        //   refreshControl={
        //     <RefreshControl
        //       refreshing={refreshing}
        //       onRefresh={onRefresh}
        //       colors={[Colors.velvet]}
        //     />
        //   }
        //   style={[styles.scrollView]}
        //   keyboardShouldPersistTaps="handled"
        //   contentContainerStyle={{
        //     paddingBottom:
        //       Platform.OS === "ios"
        //         ? RFPercentage(16) + 64
        //         : RFPercentage(16) + 64,
        //   }}
        // >
        //   <Cards
        //     backNavigate
        //     headerCard
        //     headerTxt="What now?"
        //     // headerCardContainer={{ height: "40%" }}
        //   >
        //     <View
        //       style={{
        //         alignItems: "center",
        //         marginBottom: 10,
        //         justifyContent: "center",
        //       }}
        //     >
        //       <Text textType="light" style={styles.header}>
        //         {`We've detected`} <Text textType="medium">{diseaseName}</Text>
        //       </Text>
        //       <View style={styles.separator} />
        //     </View>
        //     <View
        //       style={{
        //         height: "80%",
        //         backgroundColor: "yellow",
        //       }}
        //     >
        //       <ScrollViewIndicator
        //         indStyle={{
        //           backgroundColor: Colors.primary,
        //           width: 7,
        //         }}
        //       >
        //         <View>
        //           <Text
        //             style={{
        //               fontSize: 15,
        //               fontWeight: "bold",
        //               textAlign: "center",
        //               marginBottom: 10,
        //               paddingHorizontal: 10,
        //             }}
        //           >
        //             {diseaseData.firstPoint}
        //           </Text>
        //           <View style={{ paddingHorizontal: 10 }}>
        //             <HTML
        //               source={{ html: diseaseData.html }}
        //               baseStyle={{
        //                 fontSize: 15,
        //                 lineHeight: 30,
        //                 fontWeight: "bold",
        //               }}
        //             />
        //           </View>
        //           <View>
        //             <Text
        //               style={{
        //                 fontSize: 15,
        //                 fontWeight: "bold",
        //                 textAlign: "center",
        //                 marginBottom: 10,
        //                 paddingHorizontal: 10,
        //               }}
        //             >
        //               {diseaseData?.secondPoint}
        //             </Text>
        //           </View>
        //           <View>
        //             <HTML
        //               source={{ html: diseaseData?.description }}
        //               baseStyle={
        //                 {
        //                   // fontSize: 18,
        //                   // lineHeight: 36,
        //                   // fontWeight: "bold",
        //                 }
        //               }
        //             />
        //           </View>
        //         </View>
        //       </ScrollViewIndicator>
        //       <View style={{ backgroundColor: "lightblue", height: "20%" }}>
        //         <View style={styles.buttonContainer}>
        //           <IconButton
        //             width={"65%"}
        //             checked={true}
        //             checkedLabel="Back to results"
        //             checkedLabelColor={{ color: Colors.black }}
        //             // onPress={() => showModal(true)}
        //             onPress={() => navigation.navigate("ResultScreen")}
        //           />
        //         </View>
        //       </View>
        //       {/* <Text>'jljdlaljfldajsladjsljfasl</Text> */}
        //     </View>
        //   </Cards>
        // </ScrollView>
        <>
          {wholeResult?.expired === true && (
            <>
              <Image
                source={require("src/assets/retest.png")}
                style={{
                  flex: 1,
                  position: "absolute",
                  top: RFPercentage(20),
                  left: -RFPercentage(4),
                  zIndex: 1,
                }}
              />
              <View
                style={{
                  gap: 8,
                  marginBottom: 8,
                  position: "absolute",
                  width: "100%",
                  paddingHorizontal: 8,
                  flexDirection: "column",
                  bottom: RFPercentage(25),
                  zIndex: 4,
                }}
              >
                <BigColoredButton
                  text="Order a New knō kit"
                  onPress={() => {
                    navigation.navigate("TestContent");
                  }}
                />
                <BigColoredButton
                  text="See Complete Results"
                  onPress={() => {
                    Linking.openURL(wholeResult.pdf);
                  }}
                />
              </View>
            </>
          )}
          <ScrollView
            scrollEnabled={wholeResult?.expired === true ? false : true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.velvet]}
              />
            }
            style={styles.scrollView}
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
                borderWidth: 1,
                borderBottomWidth: 4,
                borderColor: Colors.velvet,
                marginVertical: 16,
                borderRadius: 12,
              }}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0]}
                end={[1, 1]}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  paddingBottom: 12,
                }}
              >
                <FormGradient
                  style={{
                    borderTopWidth: 0,
                    borderStartWidth: 0.25,
                    borderEndWidth: 0.25,
                  }}
                >
                  <StrokeText
                    myText={`Today is ${new Date().toLocaleDateString()}`}
                    fontSize={20}
                  />
                </FormGradient>

                {filteredResults &&
                  filteredResults.map((disease, index) => (
                    <ResultLabel
                      key={index}
                      result={disease}
                      onPress={() => {
                        setCurrentDisease(disease);
                        setModalVisible(true);
                      }}
                    />
                  ))}
              </LinearGradient>
            </View>

            {results && results.length !== 0 && (
              <View
                style={{
                  gap: 8,
                  marginBottom: 22,
                  width: "100%",
                  flexDirection: "column",
                }}
              >
                <ButtonWithIcon
                  onPress={() => {
                    navigation.navigate("ImagePicker");
                  }}
                  icon={
                    <Image
                      source={require("src/assets/home/kiss-mark.png")}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                      }}
                    />
                  }
                  text="Share That I Have Tested"
                />
                <ButtonWithIcon
                  onPress={() => {
                    {
                      wholeResult?.pdf && Linking.openURL(wholeResult?.pdf);
                    }
                  }}
                  icon={
                    <Image
                      source={require("src/assets/folder.png")}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                      }}
                    />
                  }
                  text="See Complete Results"
                />
              </View>
            )}
          </ScrollView>
        </>
      )}

      {currentDisease && (
        <ResultModal
          currentResult={currentDisease}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          heading="Your Results"
          buttonText="Show My Results"
          onPress={() => {
            setModalVisible(false);
          }}
        />
      )}

      {showDiseasesModal && (
        <MultipleResultModal
          modalVisible={showDiseasesModal}
          setModalVisible={setShowDiseasesModal}
          buttonText="Show My Results"
          currentResult={positiveResults}
          onPress={() => {
            // setShowDiseasesModal(false);
          }}
        />
      )}
    </SV>
  );
};

export default ResultDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: Colors.velvet,
    paddingVertical: 16,
  },
  boxTitle: {
    fontSize: 16,
    color: Colors.velvet,
  },
  boxText: {
    fontSize: 14,
    color: Colors.velvet,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopColor: Colors.primary,
    borderTopWidth: 1.5,
    marginTop: 10,
  },
  header: {
    fontSize: 18,
    color: Colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
});
