import { StyleSheet, View, Platform } from "react-native";
import HomeHeader from "src/components/HomeScreen/Header";
import { SV, Text } from "src/components/Themed";
import IntakeForm from "src/components/forms/IntakeForm";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
import IconButton from "src/components/IconButton";
import { useState } from "react";
import { Colors } from "src/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import useUserStore from "src/store/userStore";
import { Toast } from "src/components/ToastManager";

export type GetTestedNavOptions = {
  name: string;
  value: boolean;
};

const IntakeCollection = ({
  navigation,
  route,
}: HomeStackScreenProps<"IntakeForm">) => {
  const name = (route?.params as any) || "default";
  const user = useUserStore((state) => state.user);

  const [previousSTIs, setPreviousSTIs] = useState(
    user?.previousSTIs ?? undefined
  );

  const [partnerSTIs, setPartnerSTIs] = useState<boolean | undefined>(
    user?.partnerSTIs ?? undefined
  );

  const orderDetails = {
    ...name,
    // previousSTIs,
    // partnerSTIs,
  };

  const handleNext = () => {
    if (previousSTIs === undefined || partnerSTIs === undefined) {
      Toast.error("Oops! you're missing something");
      return;
    }

    const updatedOptions: GetTestedNavOptions[] = [
      {
        name: "PreviousSTIs",
        value: previousSTIs === true ? true : false,
      },
      {
        name: "CurrentSymptoms",
        value: false,
      },
      {
        name: "PartnerPreviousSTIs",
        value: partnerSTIs === true ? true : false,
      },
      {
        name: "PartnerSymptoms",
        value: false,
      },
    ];

    const trueOptions = updatedOptions.filter(
      (option) => option.value === true
    );

    if (trueOptions.length === 0) {
      navigation.navigate("ReceivingResults", {
        IntakeForm: orderDetails,
      });
    } else {
      navigation.navigate(trueOptions[0].name, {
        IntakeForm: orderDetails,
        NavOptions: trueOptions,
      });
    }
  };

  return (
    <SV style={styles.container}>
      <UserHeader />
      <View style={styles.innerContainer}>
        <Cards
          refrenceCard
          backNavigate
          headerTxt={`Alright ${name?.firstName + " " + name?.lastName}`}
          bottomLabel={"Learn about receiving results"}
          width={"88%"}
          // disabled={previousSTIs === undefined || partnerSTIs === undefined}
          onNavClick={() => handleNext()}
        >
          <View style={styles.disasesContainer}>
            <Text style={styles.disasesTitle}>
              We’re going to test for the following:
            </Text>

            <Text textType="medium" style={styles.disasesTxt}>
              {
                " Herpes 1 & 2    HIV    Mpox    Trich\nSyphilis   Chlamydia   Gonorrhea\nMycoplasma Genitalium"
              }
            </Text>
          </View>

          <View style={styles.orderingContainer}>
            <Text textType="medium" style={styles.orderingTitle}>
              Have you previously been diagnosed with any STI’s?
            </Text>
            <View style={styles.row}>
              <IconButton
                checked={previousSTIs === true}
                checkedLabel={previousSTIs ? "Yes" : ""}
                unCheckedLabel="Yes"
                mark
                checkedIcon
                onPress={() => setPreviousSTIs(true)}
              />
              <IconButton
                checked={previousSTIs === false}
                mark
                checkedIcon
                unCheckedLabel="No"
                checkedLabel={!previousSTIs ? "No" : ""}
                onPress={() => setPreviousSTIs(false)}
              />
            </View>
          </View>

          <View style={styles.stiContainer}>
            <Text textType="medium" style={styles.orderingTitle}>
              Are any current or former partners living with an STI?
            </Text>
            <View style={styles.row}>
              <IconButton
                checked={partnerSTIs === true}
                checkedLabel={partnerSTIs ? "Yes" : ""}
                unCheckedLabel="Yes"
                mark
                checkedIcon
                onPress={() => setPartnerSTIs(true)}
              />
              <IconButton
                checked={partnerSTIs === false}
                checkedIcon
                mark
                unCheckedLabel="No"
                checkedLabel={!partnerSTIs ? "No" : ""}
                onPress={() => setPartnerSTIs(false)}
              />
            </View>
          </View>
        </Cards>
      </View>
    </SV>
  );
};

export default IntakeCollection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  disasesTxt: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: RFPercentage(1.8),
    textAlign: "center",
    lineHeight: 35,
  },

  disasesTitle: {
    color: Colors.black,
    fontSize: RFPercentage(2),
    marginVertical: 10,
  },

  innerContainer: {
    padding: 10,
  },
  disasesContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "70%",
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
  stiContainer: {
    padding: 20,
    borderColor: Colors.primary,
    marginTop: 6,
  },
});
