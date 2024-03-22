import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import CheckBox from "src/components/CheckBox";
import HomeHeader from "src/components/HomeScreen/Header";
import { SV, Text } from "src/components/Themed";
import FormGradient from "src/components/forms/FormGradient";
import { Colors } from "src/constants/Colors";
import { Loading } from "src/constants/enums";
import PaymentServices from "src/services/PaymentServices";
import SplashScreen from "../SplashScreen";
import BigColoredButton from "src/components/BigColoredButton";
import { Toast } from "src/components/ToastManager";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import { Image } from "react-native";
import StrokeText from "src/components/StrokeText";
import ResultServices from "src/services/ResultServices";
import useUserStore from "src/store/userStore";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
import Input from "src/components/Inputs/CustomInput";
// import analytics from "@react-native-firebase/analytics";
import { images } from "src/utils/Images";
import DatePicker from "react-native-date-picker";
import { useIsFocused } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import ProfileServices from "src/services/ProfileServices";
import AuthServices from "src/services/AuthServices";
import useTokenStore from "src/store/tokenStore";
import messaging from "@react-native-firebase/messaging";
import NotificationServices from "src/services/NotificationServices";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

type Plan = {
  Id: number;
  Name: string;
  Description: string;
  Amount: number;
  ProductType: {
    Type: string;
  };
};

interface StateDataItem {
  Code: string;
  Id: number;
  State: string;
}
interface StateData {
  label: string;
  value: string;
}
interface CityData {
  Id: number;
  City: string;
}
interface FormattedCityData {
  label: string;
  value: string;
}

const ChoosePlanScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"ChoosePlan">) => {
  const IntakeFormData = route.params.IntakeForm;
  const { getTestedOptions } = route.params;
  const setIsFirstTime = useUserStore((state) => state.setIsFirstTime);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan>();
  const [planLoading, setPlanLoading] = useState<Loading>(Loading.idle);
  const user = useUserStore((state) => state.user);
  const [address1, setAddress1] = useState(user?.address1 ?? "");
  const [address2, setAddress2] = useState(user?.address2 ?? "");
  const [zip, setZip] = useState(user?.zipCode ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");

  const [date, setDate] = useState<Date | null>(null);
  const [isDateErr, setDateError] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [stateData, setStateData] = useState<StateDataItem[] | null>([]);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const isUserStateNull =
    selectedState?.label === undefined && user?.state === null;
  const isStateValueNull = selectedState?.value === "";

  const [selectedCity, setSelectedCity] = useState<FormattedCityData | null>(
    null
  );

  const [citiesData, setCitiesData] = useState<CityData[] | null>([]);

  const fetchState = async () => {
    try {
      const response = await ProfileServices.fetchState();
      if (response.status === 200) {
        const formattedStateData =
          response.data.data?.map((state: any) => ({
            value: state.Id.toString(),
            label: state.Code,
          })) || [];

        setStateData(formattedStateData);
        if (user?.state) {
          const userState = formattedStateData?.filter(
            (i: any) => i?.label === user?.state
          );
          setSelectedState(userState[0]);
        }
      }
    } catch (error: any) {
      console.log("state error--", error.response.data);
    }
  };

  const fetchCities = async (stateId: any) => {
    try {
      const response = await ProfileServices.fetchCities(stateId);
      if (response.status === 200) {
        const formatCityData =
          response.data.data?.map((city: any) => ({
            label: city.City,
            value: city.Id.toString(),
          })) || [];

        setCitiesData(formatCityData);

        if (user?.city) {
          const userCity = formatCityData?.filter(
            (i: any) => i?.label === user?.city
          );
          setSelectedCity(userCity[0]);
        }
        return formatCityData;
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  useEffect(() => {
    if (selectedState && !selectedCity) {
      fetchCities(+selectedState.value);
    }
  }, [selectedState]);

  const defaultStateOption = {
    label: "Select a State",
    value: "",
    disabled: true,
  };
  const defaultCityOption = {
    label: "Select a City",
    value: "",
  };

  const formattedStateDataWithDefault = [defaultStateOption, ...stateData];
  const formatCityDataWithDefault = [defaultCityOption, ...citiesData];

  const handleSendFcm = async () => {
    setLoading(Loading.loading);
    try {
      const token = await messaging().getToken();
      if (token) {
        const res = await NotificationServices.addDeviceToken(token);

        fetchPlans();
      }
    } catch (error: any) {
      setLoading(Loading.idle);
      console.log("error--", error);
    }
  };

  const fetchPlans = async () => {
    setLoading(Loading.loading);
    try {
      const { data } = await PaymentServices.getPlans();
      setLoading(Loading.loading);
      setPlans(data.data[0]);
      setCurrentPlan(data.data[0][0]);
      createCheckoutSession(data.data[0][0]?.Id ? data.data[0][0].Id : 0);
    } catch (error: any) {
      console.log(error);
      setLoading(Loading.error);
    }
  };

  const alreadyDefinedUsers = async () => {
    setPlanLoading(Loading.loading);

    const body = {
      message: {
        data: {
          paymentId: 5,
          email: user?.primaryEmail,
        },
      },
    };
    try {
      const { data } = await ResultServices.createOrder(body);
      if (data?.status == 200) {
        Toast.success("Order created successfully");
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });

        setPlanLoading(Loading.idle);
      }
      setPlanLoading(Loading.idle);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  const createCheckoutSession = async (productId: number) => {
    setPlanLoading(Loading.loading);
    try {
      const { data } = await PaymentServices.createCheckoutSession(productId);
      setPlanLoading(Loading.loading);
      if (data.data[0].sessionUrl) {
        navigation.navigate("PaymentWebView", {
          url: data.data[0].sessionUrl,
          IntakeForm: IntakeFormData,
        });
      }
      setPlanLoading(Loading.idle);
    } catch (error: any) {
      console.log(error.response);
      // Toast.error(error.response.data.message);
      setPlanLoading(Loading.error);
    }
  };

  const handleDateChange = (selectedDate: any) => {
    setOpen(false);
    const today = new Date();
    const ageDifference = today.getFullYear() - selectedDate.getFullYear();

    if (
      ageDifference < 18 ||
      (ageDifference === 18 && today.getMonth() < selectedDate.getMonth()) ||
      (ageDifference === 18 &&
        today.getMonth() === selectedDate.getMonth() &&
        today.getDate() < selectedDate.getDate())
    ) {
      setDateError("You must be at least 18 years old.");
      Toast.error("You must be at least 18 years old.");
      setDate(selectedDate);
    } else {
      setDate(selectedDate);
      setDateError("");
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    let myDate;
    if (typeof user?.dob === "string") {
      myDate = user?.dob ? new Date(user?.dob) : "";
    } else {
      myDate = user?.dob;
    }

    if (user) {
      setDate(myDate);
    }
  }, [isFocused]);

  const handleCheckoutFun = async () => {
    const zipReg = /^\d{5}(?:\d{4})?$/;
    const Phone = IntakeFormData?.mobile.replace(/[-()\s]/g, "");
    const passwordRegex = /^(?=.*[!@#$%^&*]).{8,}$/;

    if (!address1) {
      Toast.error("Address is required");
      setLoading(Loading.idle);
      return;
    }

    if (address1.length <= 5) {
      Toast.error("Address must be more then 5 characters");
      setLoading(Loading.idle);
      return;
    }

    if (!zip) {
      Toast.error("Zip code is required");
      setLoading(Loading.idle);
      return;
    }

    if (!zipReg.test(zip)) {
      Toast.error("Zip code is not valid");
      setLoading(Loading.idle);
      return;
    }

    if (!selectedState?.value) {
      Toast.error("Please select a State.");
      setLoading(Loading.idle);
      return;
    }

    if (selectedState && selectedState.value !== "" && !selectedCity) {
      Toast.error("Please select a city.");
      setLoading(Loading.idle);
      return;
    }
    if (selectedState?.value === "" && selectedCity?.value === "") {
      Toast.error("Please select both a state and a city.");
      setLoading(Loading.idle);
      return;
    }
    if (selectedState?.value === "") {
      Toast.error("Please select a State.");
      setLoading(Loading.idle);
      return;
    }
    if (user?.state === null && selectedState === null) {
      Toast.error("Please select a State.");
      setLoading(Loading.idle);
      return;
    }
    if (user?.city === null && selectedCity === null) {
      Toast.error("Please select a City.");
      setLoading(Loading.idle);
      return;
    }

    if (!date) {
      Toast.error("Date of birth required");
      setLoading(Loading.idle);
      return;
    }

    if (isDateErr) {
      Toast.error("You must be at least 18 years old.");
      return;
    }

    if (!password) {
      Toast.error("Password is required");
      setLoading(Loading.idle);
      return;
    }

    if (!confirmPassword) {
      Toast.error("Please confirm your password");
      setLoading(Loading.idle);
      return;
    }

    if (!passwordRegex.test(password)) {
      if (password.length < 8) {
        Toast.error("Password must be 8 characters long");
        return;
      } else {
        Toast.error("Password must contain at least one special character");
        return;
      }
    }

    // if (password.length < 8) {
    //   Toast.error("Password must be 8 characters long");
    //   setLoading(Loading.idle);
    // }
    if (password !== confirmPassword) {
      Toast.error("Passwords do not match");
      setLoading(Loading.idle);
      return;
    }

    setLoading(Loading.loading);
    try {
      const res = await AuthServices.intakeWithSignup({
        email: IntakeFormData?.email,
        mobile: `+1${Phone}`,
        password: password,
        firstName: IntakeFormData?.firstName,
        lastName: IntakeFormData?.lastName,
        referringEmail: "",
        address1: address1,
        address2: address2,
        state: selectedState?.label ? selectedState?.label : null,
        city: selectedCity?.label ? selectedCity?.label : null,
        zip: zip,
        allowCommunication: true,
        dob:
          date?.getFullYear() +
          "-" +
          (date?.getMonth()! + 1 < 10
            ? "0" + (date?.getMonth()! + 1)
            : date?.getMonth()! + 1) +
          "-" +
          (date?.getDate()! < 10 ? "0" + date?.getDate()! : date?.getDate()!),
        gender: IntakeFormData?.gender,
      });
      setIsFirstTime(res.data?.data[0].isFirstLogin);
      setAccessToken(res.data?.data[0].accessToken);
      setRefreshToken(res.data?.data[0].refreshToken);
      useUserStore.setState({
        user: {
          firstName: IntakeFormData?.firstName,
          lastName: IntakeFormData?.lastName,
          primaryEmail: IntakeFormData?.email,
          referringEmail: "",
          profilePic: null,
          mobile: Phone,
          address1: address1,
          address2: address2,
          state: selectedState?.label ? selectedState?.label : null,
          city: selectedCity?.label ? selectedCity?.label : null,
          zipCode: zip,
          dob:
            date?.getFullYear() +
            "-" +
            (date?.getMonth()! + 1 < 10
              ? "0" + (date?.getMonth()! + 1)
              : date?.getMonth()! + 1) +
            "-" +
            (date?.getDate()! < 10 ? "0" + date?.getDate()! : date?.getDate()!),
          gender: IntakeFormData?.gender,
          PartnerSymptoms: getTestedOptions?.PartnerSymptoms,
          currentSymptoms: getTestedOptions?.currentSymptoms,
          partnerSTIs: getTestedOptions?.partnerSTIs,
          previousSTIs: getTestedOptions?.previousSTIs,
        },
      });

      handleSendFcm();
      // setLoading(Loading.idle);
    } catch (error: any) {
      setLoading(Loading.idle);
      Toast.error(error.response.data?.message);
      console.log(error.response.data);
      setLoading(Loading.idle);
    }
  };

  const handleCheckoutDirect = () => {
    // fetchPlans();
    const zipReg = /^\d{5}(?:\d{4})?$/;
    const Phone = IntakeFormData?.mobile.replace(/[-()\s]/g, "");
    if (!address1) {
      Toast.error("Address is required");
      setLoading(Loading.idle);
      return;
    }

    if (address1.length <= 5) {
      Toast.error("Address must be more then 5 characters");
      setLoading(Loading.idle);
      return;
    }

    if (!zip) {
      Toast.error("Zip code is required");
      setLoading(Loading.idle);
      return;
    }

    if (!zipReg.test(zip)) {
      Toast.error("Zip code is not valid");
      setLoading(Loading.idle);
      return;
    }

    if (!selectedState?.value) {
      Toast.error("Please select a State.");
      setLoading(Loading.idle);
      return;
    }

    if (selectedState && selectedState.value !== "" && !selectedCity) {
      Toast.error("Please select a city.");
      setLoading(Loading.idle);
      return;
    }
    if (selectedState?.value === "" && selectedCity?.value === "") {
      Toast.error("Please select both a state and a city.");
      setLoading(Loading.idle);
      return;
    }
    if (selectedState?.value === "") {
      Toast.error("Please select a State.");
      setLoading(Loading.idle);
      return;
    }
    if (user?.state === null && selectedState === null) {
      Toast.error("Please select a State.");
      setLoading(Loading.idle);
      return;
    }
    if (user?.city === null && selectedCity === null) {
      Toast.error("Please select a City.");
      setLoading(Loading.idle);
      return;
    }

    if (!date) {
      Toast.error("Date of birth required");
      setLoading(Loading.idle);
      return;
    }
    if (isDateErr) {
      Toast.error("You must be at least 18 years old.");
      return;
    }
    useUserStore.setState({
      user: {
        firstName: IntakeFormData?.firstName,
        lastName: IntakeFormData?.lastName,
        primaryEmail: IntakeFormData?.email,
        referringEmail: "",
        profilePic: null,
        mobile: Phone,
        address1: address1,
        address2: address2,
        state: selectedState?.label ? selectedState?.label : null,
        city: selectedCity?.label ? selectedCity?.label : null,
        zipCode: zip,
        dob:
          date?.getFullYear() +
          "-" +
          (date?.getMonth()! + 1 < 10
            ? "0" + (date?.getMonth()! + 1)
            : date?.getMonth()! + 1) +
          "-" +
          (date?.getDate()! < 10 ? "0" + date?.getDate()! : date?.getDate()!),
        gender: IntakeFormData?.gender,
        PartnerSymptoms: getTestedOptions?.PartnerSymptoms,
        currentSymptoms: getTestedOptions?.currentSymptoms,
        partnerSTIs: getTestedOptions?.partnerSTIs,
        previousSTIs: getTestedOptions?.previousSTIs,
      },
    });
    handleSendFcm();
  };

  const handleSelectAddress = async (data: any, details: any) => {
    for (let i = 0; i < details.address_components.length; i++) {
      if (details.address_components[i].types[0] === "postal_code") {
        setZip(details.address_components[i].long_name);
      }
    }

    const addressComponents = details.address_components;
    let city: string | undefined, state: string | undefined, street: any;

    addressComponents.forEach((component: any) => {
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.short_name;
      }
      if (component.types.includes("route")) {
        street = component.long_name;
      }
    });

    var address = data?.description,
      address = address.split(",");

    setAddress1(address[0]);

    if (!state) {
      setSelectedState(null);
      setSelectedCity(null);
      setZip("");
      return;
    }

    if (state) {
      const findState: any = stateData?.find(
        (item: any) => item?.label == state
      );
      setSelectedState(findState);
      //City here
      if (city) {
        let citiesDataRes = await fetchCities(+findState.value);
        // console.log("citiesDataRes", citiesDataRes);

        const findCity: any = citiesDataRes?.find(
          (item: any) => item?.label == city
        );

        setSelectedCity(findCity);
      } else {
        // setSelectedCity(null);
      }

      //
    } else {
      setSelectedState(null);
    }
  };

  return (
    <SV>
      <UserHeader />
      {loading === Loading.loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.velvet}
          style={{ paddingTop: RFPercentage(20) }}
        />
      ) : (
        <ScrollView
          style={[
            styles.scrollView,
            { opacity: isStateDropdownOpen || isCityDropdownOpen ? 0.5 : 1 },
          ]}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS === "ios"
                ? RFPercentage(40) + 60
                : RFPercentage(8) + 3,
          }}
        >
          <Cards
            refrenceCard
            backNavigate
            width={RFPercentage(16)}
            headerTxt={"Last step"}
            onBack={() =>
              navigation.navigate("IntakeOptions", {
                IntakeForm: { IntakeFormData },
              })
            }
            bottomButton
            onPress={() => {
              if (!user) {
                handleCheckoutFun();
              } else {
                handleCheckoutDirect();
              }
            }}
          >
            <Text textType="medium" style={styles.title}>
              Where are we sending this kit?
            </Text>

            <View style={styles.addressinputContainer}>
              <GooglePlacesAutocomplete
                enablePoweredByContainer={false}
                fetchDetails={true}
                textInputProps={{
                  borderWidth: 1.2,
                  borderColor: Colors.primary,
                  height: RFPercentage(5.5),
                  borderRadius: 10,
                  paddingLeft: 20,
                  paddingRight: 10,
                  top: 5,
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  placeholderTextColor: Colors.primary,
                  value: address1,
                  onChange(e: any) {
                    setAddress1(e);
                  },
                }}
                disableScroll
                placeholder={"Address line 1"}
                styles={{
                  container: {
                    position: "relative",
                  },
                  textInputContainer: {
                    position: "relative",
                    zIndex: 1,
                  },
                  listView: {
                    position: "absolute",
                    top: "100%",
                    width: "100%",
                    zIndex: 9999,
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderRadius: 7,
                  },
                  row: {
                    backgroundColor: "transparent",
                  },
                }}
                onPress={(data, details = null) => {
                  handleSelectAddress(data, details);
                }}
                query={{
                  key: "AIzaSyBcmW93J_FYkCzLn1xHPwm_IwuNnYRRxHc",
                  language: "en",
                  components: "country:us",
                  types: "address",
                  // types: "geocode",
                  // types: "region",
                  // types: "(regions)",
                }}
              />
              <Input
                placeholderTxt="Address line 2"
                value={address2}
                onChangeText={setAddress2}
                customStyles={{ marginTop: 18, zIndex: -1 }}
              />
            </View>

            <View style={styles.inputRow}>
              <Dropdown
                // disable={!selectedState?.label || isStateValueNull}
                disable
                style={styles.dropdown}
                containerStyle={styles.dropdownItem}
                placeholderStyle={[
                  styles.placeholderStyle,
                  { color: user?.city ? Colors.velvet : Colors.primary },
                ]}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                onBlur={() => setIsCityDropdownOpen(false)}
                onFocus={() => setIsCityDropdownOpen(true)}
                data={formatCityDataWithDefault}
                search
                labelField="label"
                valueField="value"
                placeholder={
                  selectedState ? `City` : user?.city ? user.city : "City"
                }
                searchPlaceholder="Search..."
                value={selectedCity}
                onChange={(item) => {
                  setSelectedCity(item);
                  setIsCityDropdownOpen(false);
                }}
                renderItem={(item) => (
                  <Text
                    style={{
                      padding: 10,
                    }}
                  >
                    {item.label}
                  </Text>
                )}
              />
              <Dropdown
                disable
                style={styles.dropdown}
                containerStyle={styles.dropdownItem}
                placeholderStyle={[
                  styles.placeholderStyle,
                  { color: user?.state ? Colors.velvet : Colors.primary },
                ]}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                onBlur={() => setIsStateDropdownOpen(false)}
                onFocus={() => setIsStateDropdownOpen(true)}
                data={formattedStateDataWithDefault}
                search
                labelField="label"
                valueField="value"
                placeholder={user?.state ? user?.state : "State"}
                searchPlaceholder="Search..."
                value={selectedState}
                onChange={(item) => {
                  setSelectedState(item);
                  setSelectedCity(null);
                  setIsStateDropdownOpen(false);
                }}
                renderItem={(item) => (
                  <Text
                    style={{
                      padding: 10,
                    }}
                  >
                    {item.label}
                  </Text>
                )}
              />
            </View>

            <View style={styles.inputRow}>
              <Input
                placeholderTxt={"Zip"}
                value={zip}
                onChangeText={setZip}
                width={"49%"}
              />

              <Pressable
                style={styles.dobContainer}
                onPress={() => setOpen(true)}
              >
                <Text
                  style={{
                    fontSize: RFPercentage(1.8),
                    color: date ? Colors.black : Colors.primary,
                  }}
                >
                  {date ? date?.toLocaleDateString("en-US") : "Date of birth"}
                </Text>
                <Pressable onPress={() => setOpen(true)}>
                  <Image
                    style={{ height: 22, width: 22 }}
                    source={images.calenderIcon}
                  />
                </Pressable>
              </Pressable>
            </View>
            {!user ? (
              <View style={{ zIndex: -1 }}>
                <Text
                  textType="medium"
                  style={{
                    color: Colors.velvet,
                    fontSize: RFPercentage(2),
                    textAlign: "center",
                    marginVertical: 10,
                  }}
                >
                  Create your account password{" "}
                </Text>

                <View style={styles.inputRow}>
                  <Input
                    placeholderTxt={"Password"}
                    onChangeText={(text: any) => setPassword(text)}
                    width={"49%"}
                    value={password}
                    secureTextEntry
                  />
                  <Input
                    placeholderTxt={"Confirm password"}
                    onChangeText={(text: any) => setConfirmpassword(text)}
                    width={"49%"}
                    value={confirmPassword}
                    secureTextEntry
                  />
                </View>
              </View>
            ) : null}
          </Cards>

          <DatePicker
            modal
            theme="light"
            mode="date"
            open={open}
            date={
              date
                ? date
                : new Date(
                  new Date().setFullYear(new Date().getFullYear() - 18)
                )
            }
            onConfirm={handleDateChange}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </ScrollView>
      )}

      {/* <HomeHeader />
      {loading === Loading.loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.velvet}
          style={{ paddingTop: RFPercentage(20) }}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS === "ios"
                ? RFPercentage(16) + 64
                : RFPercentage(16) + 64,
          }}
        >
          <FormGradient
            vertical
            style={{
              marginVertical: 12,
            }}
          >
            <StrokeText myText="Success!" />
          </FormGradient>

          <Image
            source={require("src/assets/checkout.png")}
            style={{
              height: RFPercentage(45),
              resizeMode: "contain",
              width: "100%",
              marginBottom: 12,
            }}
          />

          <View
            style={{
              marginBottom: 12,
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <BigColoredButton
              text="Take me to Checkout"
              isLoading={planLoading === Loading.loading}
              disabled={!currentPlan}
              // disabled={
              //   user?.primaryEmail === "dejantu@gmail.com" ||
              //   user?.primaryEmail === "eduardo.d.solomon@gmail.com" ||
              //   user?.primaryEmail === "mustafa@gmail.com" ||
              //   user?.primaryEmail === "mustafa1@gmail.com"
              //     ? false
              //     : !currentPlan
              // }
              // onPress={() => {
              //   if (
              //     user?.primaryEmail === "dejantu@gmail.com" ||
              //     user?.primaryEmail === "eduardo.d.solomon@gmail.com" ||
              //     user?.primaryEmail === "mustafa@gmail.com" ||
              //     user?.primaryEmail === "mustafa1@gmail.com"
              //   ) {
              //     alreadyDefinedUsers();
              //   } else
              //     createCheckoutSession(currentPlan?.Id ? currentPlan.Id : 0);
              // }}
              onPress={() =>
                createCheckoutSession(currentPlan?.Id ? currentPlan.Id : 0)
              }
            />
          </View>
        </ScrollView>
      )} */}
    </SV>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: RFPercentage(2),
    textAlign: "center",
  },
  comment: {
    fontSize: 14,
    color: Colors.velvet,
    paddingVertical: 16,
  },

  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    zIndex: -1,
  },
  addressinputContainer: {
    padding: 10,
  },
  customIcons: {
    height: 30,
    width: 30,
    right: 5,
  },
  dateError: {
    color: "red",
    fontSize: 14,
    width: RFPercentage(16),
  },

  dropdown: {
    fontFamily: "DMSans_500Medium",
    color: Colors.velvet,
    borderColor: Colors.primary,
    width: "49%",
    padding: 10,
    borderWidth: 1.2,
    height: RFPercentage(5.5),
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 10,
  },

  dropdownItem: {
    borderRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.velvet,
    borderBottomWidth: 4,
    width: "44%",
  },

  placeholderStyle: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    // color: Colors.velvet,
  },

  selectedTextStyle: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: Colors.velvet,
  },

  inputSearchStyle: {
    fontSize: 14,
    borderColor: Colors.velvet,
    fontFamily: "DMSans_500Medium",
    borderRadius: 10,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },
  dobContainer: {
    borderWidth: 1.2,
    borderColor: Colors.primary,
    height: RFPercentage(5.5),
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "49%",
  },
});

export default ChoosePlanScreen;
