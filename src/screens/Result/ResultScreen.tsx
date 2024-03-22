import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TurboModuleRegistry,
  View,
} from "react-native";
import { ScrollViewIndicator } from "@fanchenbao/react-native-scroll-indicator";
import { RFPercentage } from "react-native-responsive-fontsize";
import BigColoredButton from "src/components/BigColoredButton";
import ResultLabel, { ResultType } from "src/components/Results/ResultLabel";
import ResultModal from "src/components/Results/ResultModal";
import { SV, Text } from "src/components/Themed";
import FormGradient from "src/components/forms/FormGradient";
import { Colors, gradients } from "src/constants/Colors";
import { Loading, OrderStatus } from "src/constants/enums";
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
import ResultItem from "src/components/Results/ResultItem";
import IconButton from "src/components/IconButton";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
import PreviousSTIModal from "src/components/GetTestedFlow/PreviousSTIModal";
import GenericModal from "src/components/GetTestedFlow/GenericModal";
import GenericSymptomsModal from "src/components/GetTestedFlow/GenericSymptomsModal";
import RetestModal from "src/components/GetTestedFlow/RetestModal";

export type ResultResponse = {
  date: string;
  expired: boolean;
  pdf: string;
  results: ResultType[];
  resultsViewedOn: string | null;
};

const ResultScreen = ({ navigation, route }: RootTabScreenProps<"Result">) => {
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
  const [showRetestModal, setShowRetestModal] = useState<boolean>(false);
  const [isOlderThan6Months, setIsOlderThan6Months] = useState(false);

  useEffect(() => {
    if (order && order.status === OrderStatus.Released) {
      const currentDate = new Date();
      const createAtDate = new Date(order?.CreatedOn * 1000); // Convert timestamp to milliseconds

      // Calculate the difference in months
      const diffInMonths =
        (currentDate.getFullYear() - createAtDate.getFullYear()) * 12 +
        (currentDate.getMonth() - createAtDate.getMonth());

      // Check if difference is 6 months or more
      if (diffInMonths >= 6) {
        setIsOlderThan6Months(true);
      } else {
        setIsOlderThan6Months(false);
      }
    }
  }, []);
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

  useEffect(() => {
    fetchResults();
  }, []);

  console.log("show modal", showRetestModal);

  const pastFunc = () => {
    setShowRetestModal(false);
    navigation.navigate("PastResultScreen");
  };
  useEffect(() => {
    const newResults = results.filter(
      (item) => item?.name !== "Hepatitus B" && item?.name !== "Hepatitus C"
    );
    setFilteredResults(newResults);
  }, [results]);

  const resultsData: ResultType[] = [
    { id: 1, name: "Herpes I", value: "POSITIVE" },
    { id: 2, name: "HIV", value: "SELF_REPORTED" },
    { id: 3, name: "MPox", value: "SELF_REPORTED" },
    { id: 4, name: "Trich", value: "SELF_REPORTED" },
    { id: 5, name: "Mycoplasm Genitalium", value: "SELF_REPORTED" },
    { id: 6, name: "Herpes II", value: "SELF_REPORTED" },
    { id: 7, name: "Hepatitis C", value: "SELF_REPORTED" },
    { id: 8, name: "Hepatitis B", value: "SELF_REPORTED" },
    { id: 9, name: "Chlamydia", value: "SELF_REPORTED" },
    { id: 10, name: "Gonorrhea", value: "SELF_REPORTED" },
    { id: 11, name: "Syphilis", value: "SELF_REPORTED" },
  ];
  // const order = useOrderStore((state) => state.order);

  const handleTimeStamp = () => {
    const createdAtDate = new Date(order?.CreatedOn);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
    console.log("Today's date:", formattedDate);
    const endTimeDate = new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000);
    console.log("Order :", createdAtDate);

    // const endTimeDate = new Date(createdAtDate?.getTime() + 5 * 60 * 1000); // 5 minutes in milliseconds
    // const currentDate = new Date().toISOString();
    // console.log("currentTime--", currentTime);
    // return new Date(currentTime) > endTimeDate;
    // console.log("handleTimeStamp ", currentDate);
  };

  useEffect(() => {
    handleTimeStamp();
  }, []);

  const renderItem = ({ item }: { item: ResultType }) => (
    <ResultItem
      isValue={true}
      result={item}
      onPress={() =>
        navigation.navigate("ResultDetailsScreen", {
          item,
        })
      }
    />
  );

  const handleResultPress = (result: ResultType) => {
    console.log("Result pressed:", result);
  };

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
        <ScrollView
          scrollEnabled={false}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={onRefresh}
          //     colors={[Colors.velvet]}
          //   />
          // }
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS === "ios"
                ? RFPercentage(16) + 64
                : RFPercentage(16) + 64,
          }}
        >
          <Cards backNavigate headerCard headerTxt="Results from 5.18.24">
            <View style={{ alignSelf: "center", marginBottom: 5 }}>
              <Text textType="medium" style={styles.header}>
                {`Today is ${new Date()
                  .toLocaleDateString()
                  .replace(/\//g, ".")}`}
              </Text>
            </View>
            <View style={{ height: Platform.OS === "ios" ? "70%" : "71%" }}>
              <View>
                <ScrollViewIndicator
                  indStyle={{ backgroundColor: Colors.primary, width: 7 }}
                >
                  <FlatList
                    data={resultsData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={true}
                    scrollIndicatorInsets={{ right: 5 }}
                  />
                </ScrollViewIndicator>
                <View style={styles.buttonContainer}>
                  <IconButton
                    // width={"30%"}
                    checked={false}
                    unCheckedLabel="Past tests"
                    onPress={() => navigation.navigate("PastResultScreen")}
                  />
                  <IconButton
                    // width={"25%"}
                    checked={true}
                    checkedLabel="Share"
                    checkedLabelColor={{ color: Colors.white }}
                    // onPress={() => setShowDiseasesModal(true)}
                  />

                  <IconButton
                    // width={"35%"}
                    unCheckedLabel="Full results"
                    onPress={() => setShowRetestModal(true)}
                  />
                </View>
              </View>
            </View>
          </Cards>
        </ScrollView>
      ) : (
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

      {showRetestModal && (
        <RetestModal
          modalVisible={showRetestModal}
          onPress={pastFunc}
          height={430}
          onClosePress={() => setShowRetestModal(false)}
          heading="Time for a new test"
          buttonText="close"
          onRequestClose={() => setShowDiseasesModal(false)}
          body={`It’s been 6+ months since your last knō kit, meaning your previous results may no longer be accurate. \n\n\n To continue managing your sexual wellness, you’ll need to test again to access & share your status.`}
        />
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
            setShowDiseasesModal(false);
          }}
        />
      )}
    </SV>
  );
};

export default ResultScreen;

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
    // flex: 1,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Platform.OS === "ios" ? 15 : 20,
    paddingVertical: 10,
    borderTopColor: Colors.primary,
    borderTopWidth: 1.5,
    marginTop: 10,
    // width: "97%",
  },
  header: {
    fontSize: 18,
    color: Colors.primary,
  },
});
