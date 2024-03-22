import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ScrollViewIndicator } from "@fanchenbao/react-native-scroll-indicator";
import { RFPercentage } from "react-native-responsive-fontsize";
import { ResultType } from "src/components/Results/ResultLabel";
import { SV } from "src/components/Themed";
import { Colors } from "src/constants/Colors";
import { Loading } from "src/constants/enums";
import { RootTabScreenProps } from "src/types/NavigationTypes";
import ResultItem from "src/components/Results/ResultItem";
import IconButton from "src/components/IconButton";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";

export type ResultResponse = {
  date: string;
  expired: boolean;
  pdf: string;
  results: ResultType[];
  resultsViewedOn: string | null;
};

const resultsData: ResultType[] = [
  { id: 1, name: "Results from 5.2.24", value: "POSITIVE" },
  { id: 2, name: "Results from 2.1.24", value: "POSITIVE" },
  { id: 3, name: "Results from 12.31.23", value: "POSITIVE" },
  { id: 4, name: "Results from 9.5.23", value: "POSITIVE" },
  { id: 5, name: "Results from 6.1.23", value: "POSITIVE" },
  { id: 6, name: "Results from 6.1.23", value: "POSITIVE" },
];

const PastResultScreen = ({
  navigation,
  route,
}: RootTabScreenProps<"Result">) => {
  const [wholeResult, setWholeResult] = useState<ResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultType[]>([]);

  const renderItem = ({ item }: { item: ResultType }) => (
    <ResultItem isValue={false} result={item} />
  );

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
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS === "ios"
                ? RFPercentage(16) + 64
                : RFPercentage(16) + 64,
          }}
        >
          <Cards
            backNavigate
            headerCard
            textStyle={{ fontweight: "bold" }}
            // textType="bold"
            headerTxt="Your past test results"
          >
            <View>
              {/*  "93%"  */}
              <View style={{ height: 500 }}>
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
                    checked={true}
                    checkedLabel="Share that I've tested"
                    checkedLabelColor={{ color: Colors.black }}
                    width={"70%"}
                  />
                </View>
              </View>
            </View>
          </Cards>
        </ScrollView>
      ) : (
        <>
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
          ></ScrollView>
        </>
      )}
    </SV>
  );
};

export default PastResultScreen;

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
});
