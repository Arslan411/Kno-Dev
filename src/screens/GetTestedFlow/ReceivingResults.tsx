import { StyleSheet, View, Platform, ScrollView } from "react-native";
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
import CheckBox from "src/components/CheckBox";
import Input from "src/components/Inputs/CustomInput";
import AuthServices from "src/services/AuthServices";
import { Toast } from "src/components/ToastManager";
import useUserStore from "src/store/userStore";

const ReceivingResults = ({
  navigation,
  route,
}: HomeStackScreenProps<"IntakeForm">) => {
  const user = useUserStore((state) => state.user);
  const [isAgree, setIsAgree] = useState<boolean>();
  const [checked, setChecked] = useState<boolean>();
  const [mobile, setMobile] = useState<string>(
    user?.mobile ? user?.mobile?.slice(-10) : ""
  );
  const [mobileErr, setMobileErr] = useState("");
  const [email, setEmail] = useState(user?.primaryEmail ?? "");
  const [emailErr, setEmailErr] = useState("");

  const { IntakeForm }: any = route?.params;
  const intakeForm = {
    firstName: IntakeForm?.firstName,
    lastName: IntakeForm.lastName,
    email: email.toLocaleLowerCase(),
    mobile: mobile,
  };

  const getTestedOptions = {
    previousSTIs: IntakeForm?.previousSTIs,
    partnerSTIs: IntakeForm?.partnerSTIs,
  };

  const handleNext = async () => {
    const phoneRegExp = /^\d{10}$/;
    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const Phone = mobile.replace(/[-()\s]/g, "");

    if (!checked || !isAgree) {
      Toast.error("Oops! you're missing something");
      return;
    }

    if (!mobile) {
      setMobileErr("Phone number is required");
      return;
    }

    if (!email) {
      setEmailErr("Email is required");
      return;
    }

    if (user) {
      navigation.navigate("IntakeOptions", {
        IntakeForm: intakeForm,
        getTestedOptions: getTestedOptions,
      });
      return;
    }

    if (phoneRegExp.test(mobile)) {
      setMobileErr("");

      if (emailRegExp.test(email)) {
        setEmailErr("");
        try {
          const res = await AuthServices.checkUserValidate({
            email: email,
            mobile: `+1${Phone}`,
          });

          if (res?.data?.success) {
            navigation.navigate("IntakeOptions", {
              IntakeForm: intakeForm,
              getTestedOptions: getTestedOptions,
            });
          }
        } catch (error: any) {
          Toast.error(error.response.data?.message);
          navigation?.navigate("Login");
        }
      } else {
        setEmailErr("Invalid email format");
      }
    } else {
      setMobileErr("Phone number must be 10 digits");
    }
  };

  return (
    <SV style={styles.container}>
      <UserHeader />

      <ScrollView
        style={styles.innerContainer}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(30) + 90
              : RFPercentage(10) + 3,
        }}
      >
        <Cards
          refrenceCard
          backNavigate
          headerTxt={"Receiving results"}
          bottomLabel={"A few intake questions"}
          // disabled={!checked || !isAgree}
          width={RFPercentage(33)}
          onNavClick={handleNext}
        >
          <Text style={styles.receivingDetails}>
            For some positive results, a doctor may attempt to reach you by
            phone up to 3 times. After that, results will be accessible within
            the app.
          </Text>

          <View style={styles.row}>
            <CheckBox
              size={21}
              borderWidth={2}
              checked={checked === true}
              onValueChange={setChecked}
              color={Colors.primary}
              checkedColor={Colors.primary}
              disabledColor={Colors.primary}
            />
            <Text
              textType="medium"
              style={{
                color: Colors.velvet,
                fontSize: 16,
              }}
            >
              I understand
            </Text>
          </View>

          <Text
            textType="medium"
            style={{
              color: Colors.velvet,
              fontSize: RFPercentage(2),
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            What's the best way to contact you?
          </Text>

          <View style={styles.inputRow}>
            <View style={{ width: "49%" }}>
              <Input
                placeholderTxt={"Phone"}
                onChangeText={setMobile}
                value={mobile}
                keyboardType={"numeric"}
                customStyles={{ paddingLeft: 13 }}
              />
              {mobileErr && <Text style={styles.dateError}>{mobileErr}</Text>}
            </View>

            <View style={{ width: "49%" }}>
              <Input
                placeholderTxt={"Email"}
                onChangeText={setEmail}
                keyboardType="email-address"
                value={email.trim()}
                customStyles={{ paddingLeft: 13 }}
              />
              {emailErr && <Text style={styles.dateError}>{emailErr}</Text>}
            </View>
          </View>

          <Text style={styles.receivingDetails}>
            I agree to receive written communication from knō and their medical
            partners.
          </Text>

          <View style={[styles.row, { width: RFPercentage(12) }]}>
            <CheckBox
              size={21}
              borderWidth={2}
              checked={isAgree === true}
              onValueChange={setIsAgree}
              color={Colors.primary}
              checkedColor={Colors.primary}
              disabledColor={Colors.primary}
            />
            <Text
              textType="medium"
              style={{
                color: Colors.velvet,
                fontSize: 16,
              }}
            >
              I agree
            </Text>
          </View>
        </Cards>
      </ScrollView>
    </SV>
  );
};

export default ReceivingResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  innerContainer: {
    padding: 10,
  },
  receivingDetails: {
    textAlign: "center",
    color: Colors.black,
    fontSize: Platform.OS === "ios" ? RFPercentage(1.6) : RFPercentage(1.7),
    lineHeight: 28,
    width: "85%",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 15,
    justifyContent: "space-evenly",
    width: "40%",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  dateError: {
    color: "red",
    fontSize: 14,
    width: RFPercentage(18),
    marginLeft: 5,
    top: 2,
  },
});
