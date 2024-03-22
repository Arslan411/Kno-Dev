import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Controller, useForm } from "react-hook-form";
import { Colors } from "src/constants/Colors";
import FormGradient from "./FormGradient";
import CheckBox from "../CheckBox";
import { useState } from "react";
import BigColoredButton from "../BigColoredButton";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigation } from "src/types/NavigationTypes";
import useUserStore from "src/store/userStore";
import OrderingForSelfModal from "../GetTestedFlow/OrderingForSelfModal";
import { object, string } from "yup";
import DatePicker from "react-native-date-picker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dropdown } from "react-native-element-dropdown";
import React, { useEffect } from "react";
import ProfileServices from "src/services/ProfileServices";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "src/constants/Colors";
import { Toast } from "src/components/ToastManager";
import { Loading } from "src/constants/enums";

type IntakeFormDataType = {
  firstName: string;
  lastName: string;
  mobile: string;
  address1: string;
  address2: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  zip: string;
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
export const phoneRegExp = /^\d{10}$/;

export let IntakeFormSchema = object({
  firstName: string()
    .required("First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: string()
    .required("Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  mobile: string()
    .required("Phone number is required")
    .max(10, "Phone number must be 10 digits")
    .test("mobile", "Phone number is not valid", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return phoneRegExp.test(value);
      }
    }),
  address1: string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be less than 100 characters"),
  address2: string()
    .nullable()
    .test(
      "address2",
      "Address must be within 5 and 100 characters",
      (value) => {
        if (value === null || value === undefined || value === "") {
          return true;
        } else {
          return value.length >= 5 && value.length <= 100;
        }
      }
    ),

  city: string()
    .nullable()
    .test("city", "City must be between 2 and 30 characters", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return /^[A-Za-z\s]{2,30}$/.test(value);
      }
    }),

  state: string()
    .nullable()
    .test("state", "State should be 2 characters", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return /^[A-Z]{2}$/.test(value);
      }
    }),
  zip: string()
    .test("zip", "Zip code is not valid", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return /^\d{5}(?:\d{4})?$/.test(value);
      }
    })
    .required("Zip code is required"),
});

const IntakeForm = () => {
  const navigation = useNavigation<StackNavigation>();
  const user = useUserStore((state) => state.user);
  const [checked, setChecked] = useState<boolean>();
  const [genderAtBirth, setGenderAtBirth] = useState<"Male" | "Female" | "">(
    ""
  );
  const [date, setDate] = useState<Date | null>(null);
  const [isDateErr, setDateError] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [isOrderingForSelf, setIsOrderingForSelf] = useState<boolean>(true);
  const [stateData, setStateData] = React.useState<StateDataItem[] | null>([]);
  const [selectedState, setSelectedState] = React.useState<StateData | null>(
    null
  );

  const [selectedCity, setSelectedCity] =
    React.useState<FormattedCityData | null>(null);
  const [citiesData, setCitiesData] = React.useState<CityData[] | null>([]);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const isUserStateNull =
    selectedState?.label === undefined && user?.state === null;
  const isStateValueNull = selectedState?.value === "";
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const capitalizeName = (text: string) => {
    let newText = text.charAt(0).toUpperCase() + text.slice(1);
    return newText;
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IntakeFormDataType>({
    resolver: yupResolver(IntakeFormSchema),
    defaultValues: {
      firstName: capitalizeName(user?.firstName ? user?.firstName : ""),
      lastName: capitalizeName(user?.lastName ? user?.lastName : ""),
      address1: user?.address1 ? user?.address1 : "",
      address2: user?.address2 ? user?.address2 : null,
      city: user?.city ? user?.city : "",
      state: user?.state ? user?.state : "",
      zip: user?.zipCode ? user.zipCode : "",
      mobile: user?.mobile?.slice(-10),
    },
  });

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
      console.log(error.response.data);
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
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchCities(+selectedState.value);
    }
  }, [selectedState]);

  const fetchProfileFromApi = async () => {
    try {
      const response = await ProfileServices.fetchProfile();
      if (response.status === 200) {
        useUserStore.setState({
          user: {
            firstName: response.data.data[0].firstName,
            lastName: response.data.data[0].lastName,
            primaryEmail: response.data.data[0].primaryEmail,
            referringEmail: response.data.data[0].referringEmail,
            profilePic:
              response.data.data[0].profilePic !== null
                ? `${response.data.data[0].profilePic}?q=${Date.now()}`
                : null,
            address1: response.data.data[0].address1 ?? "",
            address2: response.data.data[0].address2 ?? "",
            city: response.data.data[0].city ?? "",
            state: response.data.data[0].state ?? "",
            zipCode: response.data.data[0].zipCode ?? "",
            mobile: response.data.data[0].mobile,
            gender: response.data.data[0]?.gender ?? "",
            dob: response.data.data[0]?.dob
              ? new Date(response.data.data[0].dob)
              : "",
          },
        });
      }
    } catch (error: any) {
      console.log("fetch profile er---", error.response.data.message);
    }
  };

  const onSubmit = async (data: IntakeFormDataType) => {
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

    const {
      firstName,
      lastName,
      mobile,
      address1,
      address2,
      city,
      state,
      zip,
    } = data;

    setLoading(Loading.loading);
    const phone = mobile.replace(/[-()\s]/g, "");

    try {
      const res = await ProfileServices.editProfile({
        firstName: firstName ? firstName : null,
        lastName: lastName ? lastName : null,
        mobile: mobile ? `+1${phone}` : null,
        referringEmail: null,
        address1: address1 ? address1 : "",
        address2: address2 ? address2 : null,
        state: selectedState?.label ? selectedState?.label : null,
        city: selectedCity?.label ? selectedCity?.label : null,
        zip: zip ? zip : "",
        dob:
          date?.getFullYear() +
          "-" +
          (date?.getMonth()! + 1 < 10
            ? "0" + (date?.getMonth()! + 1)
            : date?.getMonth()! + 1) +
          "-" +
          (date?.getDate()! < 10 ? "0" + date?.getDate()! : date?.getDate()!),
        gender: genderAtBirth ? genderAtBirth : null,
      });
      if (res.status === 200) {
        fetchProfileFromApi();
        setLoading(Loading.idle);
      }
    } catch (error: any) {
      Toast.error(error.response.data.message);
      setLoading(Loading.error);
    }

    const IntakeFormData = {
      firstName,
      lastName,
      mobile,
      address1,
      address2,
      city: selectedCity?.label || city,
      state: selectedState?.label || state,
      zip,
      dob:
        date?.getFullYear() +
        "-" +
        (date?.getMonth()! + 1 < 10
          ? "0" + (date?.getMonth()! + 1)
          : date?.getMonth()! + 1) +
        "-" +
        (date?.getDate()! < 10 ? "0" + date?.getDate()! : date?.getDate()!),
      gender: genderAtBirth,
    };

    navigation.navigate("IntakeOptions", {
      IntakeForm: IntakeFormData,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        setValue(
          "firstName",
          capitalizeName(user?.firstName ? user?.firstName : "")
        );
        setValue(
          "lastName",
          capitalizeName(user?.lastName ? user?.lastName : "")
        );
        setValue("mobile", user?.mobile?.slice(-10) || "");
        setValue("address1", user?.address1 || "");
        setValue("address2", user?.address2 || "");
        setValue("zip", user?.zipCode || "");
        setValue("state", user?.state || "");
        setValue("city", user?.city || "");
      }
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: 0,
        });
      }
    }, [user])
  );
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
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      paddingHorizontal: 16,
    },
    nameRow: {
      flexDirection: "row",
      gap: 8,
    },
    f1g4: {
      flex: 1,
      gap: 4,
      marginTop: 8,
    },
    label: {
      fontSize: 14,
      color: Colors.velvet,
    },
    emailAndPhoneInput: {
      fontFamily: "DMSans_500Medium",
      color: Colors.velvet,
    },
    dropdown: {
      marginLeft: 10,
      fontFamily: "DMSans_500Medium",
      color: Colors.velvet,
      borderColor: Colors.velvet,
    },

    placeholderStyle: {
      fontSize: 14,
      fontFamily: "DMSans_500Medium",
      color: Colors.velvet,
    },
    selectedTextStyle: {
      fontSize: 14,
      fontFamily: "DMSans_500Medium",
      color: Colors.velvet,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      fontSize: 14,
      borderColor: Colors.velvet,
      fontFamily: "DMSans_500Medium",
      borderRadius: 10,
    },
    dropdownItem: {
      borderRadius: 7,
      borderBottomLeftRadius: 7,
      borderBottomRightRadius: 7,
      fontFamily: "DMSans_500Medium",
      fontSize: 14,
      backgroundColor: gradients.primary[0],
      borderWidth: 1,
      borderColor: Colors.velvet,
      borderBottomWidth: 4,
      marginVertical: Platform.OS === "ios" ? 2 : 6,
      marginHorizontal: Platform.OS === "ios" ? -14.5 : -19,
      width: Platform.OS === "ios" ? width - 33 : width - 33,
    },
    dateError: {
      color: "red",
      fontSize: 14,
    },
  });

  const isFocused = useIsFocused();

  useEffect(() => {
    let myDate;
    if (typeof user?.dob === "string") {
      myDate = user?.dob ? new Date(user?.dob) : "";
    } else {
      myDate = user?.dob;
    }

    if (user) {
      setGenderAtBirth(user?.gender);
      setDate(myDate);
    }
  }, [isFocused]);

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
      // User is less than 18 years old
      // alert("You must be at least 18 years old.");
      setDateError("You must be at least 18 years old.");
      setDate(selectedDate);
    } else {
      // User is 18 years or older
      setDate(selectedDate);
      setDateError("");
      // alert("Age verification successful!");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        opacity: isStateDropdownOpen || isCityDropdownOpen ? 0.5 : 1,
      }}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(16) + 72
              : RFPercentage(16) + 72,
        }}
      >
        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            First Name
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical flex={0}>
                <TextInput
                  cursorColor={Colors.velvet}
                  importantForAutofill="yes"
                  keyboardType="default"
                  autoCorrect={false}
                  // autoComplete="name-given"
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text.replace(/[^A-Za-z]/g, ""));
                  }}
                  value={value.trim()}
                  style={styles.emailAndPhoneInput}
                />
              </FormGradient>
            )}
          />
          {errors.firstName && (
            <Text
              style={{
                color: "red",
                fontSize: 14,
              }}
            >
              {errors.firstName.message}
            </Text>
          )}
        </View>
        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            Last Name
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <TextInput
                  cursorColor={Colors.velvet}
                  keyboardType="default"
                  autoCorrect={false}
                  // autoComplete="name-family"
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text.replace(/[^A-Za-z]/g, ""));
                  }}
                  value={value.trim()}
                  style={styles.emailAndPhoneInput}
                />
              </FormGradient>
            )}
          />
          {errors.lastName && (
            <Text
              style={{
                color: "red",
                fontSize: 14,
              }}
            >
              {errors.lastName.message}
            </Text>
          )}
        </View>

        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            Phone Number
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Controller
            control={control}
            name="mobile"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <TextInput
                  cursorColor={Colors.velvet}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  // autoComplete="tel"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.emailAndPhoneInput}
                />
              </FormGradient>
            )}
          />
          {errors.mobile && (
            <Text
              style={{
                color: "red",
                fontSize: 14,
              }}
            >
              {errors.mobile.message}
            </Text>
          )}
        </View>

        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            Address 1
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Controller
            control={control}
            name="address1"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical flex={0}>
                <TextInput
                  cursorColor={Colors.velvet}
                  importantForAutofill="yes"
                  keyboardType="default"
                  autoCorrect={false}
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.emailAndPhoneInput}
                />
              </FormGradient>
            )}
          />
          {errors.address1 && (
            <Text
              style={{
                color: "red",
                fontSize: 14,
              }}
            >
              {errors.address1.message}
            </Text>
          )}
        </View>

        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            Address 2
          </Text>
          <Controller
            control={control}
            name="address2"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical flex={0}>
                <TextInput
                  cursorColor={Colors.velvet}
                  importantForAutofill="yes"
                  keyboardType="default"
                  autoCorrect={false}
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value === null || value === undefined ? "" : value}
                  style={styles.emailAndPhoneInput}
                />
              </FormGradient>
            )}
          />
          {errors.address2 && (
            <Text
              style={{
                color: "red",
                fontSize: 14,
              }}
            >
              {errors.address2.message}
            </Text>
          )}
        </View>

        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            State
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>

          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: Colors.velvet,
              borderBottomWidth: 4,
              borderRadius: 10,
            }}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                flex: 1,
                padding: Platform.OS === "ios" ? 4 : 8,
                borderRadius: 10,
              }}
            >
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownItem}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                onBlur={() => setIsStateDropdownOpen(false)}
                onFocus={() => setIsStateDropdownOpen(true)}
                data={formattedStateDataWithDefault}
                search
                labelField="label"
                valueField="value"
                placeholder={user?.state ? user?.state : "Select a State"}
                searchPlaceholder="Search..."
                value={selectedState}
                onChange={(item) => {
                  setSelectedState(item);
                  setSelectedCity(null);
                  setIsStateDropdownOpen(false);
                }}
                renderItem={(item) => (
                  <LinearGradient
                    colors={gradients.primary}
                    start={[0, 0.3]}
                    end={[0, 1]}
                  >
                    <Text
                      style={{
                        padding: 10,
                      }}
                    >
                      {item.label}
                    </Text>
                  </LinearGradient>
                )}
              />
            </LinearGradient>
          </View>
        </View>
        {!isUserStateNull && (
          <View style={styles.f1g4}>
            <Text textType="LBRegular" style={styles.label}>
              City
              <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
            </Text>

            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
                opacity: isStateValueNull ? 0.5 : 1,
              }}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  flex: 1,
                  padding: Platform.OS === "ios" ? 4 : 9,
                  borderRadius: 10,
                }}
              >
                <Dropdown
                  style={styles.dropdown}
                  containerStyle={styles.dropdownItem}
                  placeholderStyle={styles.placeholderStyle}
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
                    selectedState
                      ? `Select a City`
                      : user?.city
                      ? user.city
                      : "Select a City"
                  }
                  searchPlaceholder="Search..."
                  value={selectedCity}
                  onChange={(item) => {
                    setSelectedCity(item);
                    setIsCityDropdownOpen(false);
                  }}
                  disable={!selectedState?.label || isStateValueNull}
                  renderItem={(item) => (
                    <LinearGradient
                      colors={gradients.primary}
                      start={[0, 0.3]}
                      end={[0, 1]}
                    >
                      <Text style={{ padding: 10 }}>{item.label}</Text>
                    </LinearGradient>
                  )}
                ></Dropdown>
              </LinearGradient>
            </View>
          </View>
        )}

        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            Zip
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Controller
            control={control}
            name="zip"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical flex={0}>
                <TextInput
                  cursorColor={Colors.velvet}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value!.trim()}
                  style={styles.emailAndPhoneInput}
                />
              </FormGradient>
            )}
          />
          {errors.zip && (
            <Text
              style={{
                color: "red",
                fontSize: 14,
              }}
            >
              {errors.zip.message}
            </Text>
          )}
        </View>

        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            Date of Birth
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
        </View>

        {/* {console.log(
          "------>> ",
          new Date(new Date().setFullYear(new Date().getFullYear() - 18))
        )} */}

        <View style={styles.f1g4}>
          <FormGradient vertical>
            <Pressable onPress={() => setOpen(true)}>
              <Text
                style={{
                  color: Colors.velvet,
                  fontSize: 16,
                }}
              >
                {date ? date?.toLocaleDateString("en-US") : "Select Date"}
                {/* {date && moment(date).format("hh:mm")} */}
              </Text>
              <DatePicker
                modal
                theme="light"
                mode="date"
                open={open}
                // maximumDate={
                //   new Date(
                //     new Date().setFullYear(new Date().getFullYear() - 18)
                //   )
                // }
                date={
                  date
                    ? date
                    : new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18)
                      )
                }
                // onConfirm={(date) => {
                //   setOpen(false);
                //   setDate(date);

                // }}
                onConfirm={handleDateChange}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </Pressable>
          </FormGradient>
        </View>
        {isDateErr && <Text style={styles.dateError}>{isDateErr}</Text>}

        {/* {console.log("genderAtBirth", genderAtBirth)} */}

        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            Gender at Birth
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <View
            style={{
              height: 4,
            }}
          />

          <View style={styles.nameRow}>
            <FormGradient vertical>
              <Pressable
                onPress={() => {
                  setGenderAtBirth("Male");
                }}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                  rounded
                  checked={genderAtBirth === "Male"}
                  // checked={
                  //   user?.gender === "Male"
                  //     ? true
                  //     : genderAtBirth === "Male"
                  //     ? true
                  //     : false
                  // }
                  onValueChange={() => {
                    setGenderAtBirth("Male");
                  }}
                  color={Colors.velvet}
                  checkedColor={Colors.primary}
                  disabledColor={Colors.velvet}
                />
                <Text
                  style={{
                    color: Colors.velvet,
                    fontSize: 14,
                    flex: 1,
                    paddingHorizontal: 8,
                  }}
                >
                  Male
                </Text>
              </Pressable>
            </FormGradient>
            <FormGradient vertical>
              <Pressable
                onPress={() => {
                  setGenderAtBirth("Female");
                }}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                  rounded
                  checked={genderAtBirth === "Female"}
                  // checked={
                  //   user?.gender === "Female"
                  //     ? true
                  //     : genderAtBirth === "Female"
                  //     ? true
                  //     : false
                  // }
                  onValueChange={() => {
                    setGenderAtBirth("Female");
                  }}
                  color={Colors.velvet}
                  checkedColor={Colors.primary}
                  disabledColor={Colors.velvet}
                />
                <Text
                  style={{
                    color: Colors.velvet,
                    fontSize: 14,
                    flex: 1,
                    paddingHorizontal: 8,
                  }}
                >
                  Female
                </Text>
              </Pressable>
            </FormGradient>
          </View>
        </View>
        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            I'm ordering for self
          </Text>
          <View
            style={{
              height: 4,
            }}
          />
          <View style={styles.nameRow}>
            <FormGradient vertical>
              <Pressable
                onPress={() => {
                  setIsOrderingForSelf(true);
                }}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                  rounded
                  checked={isOrderingForSelf === true}
                  onValueChange={() => {
                    setIsOrderingForSelf(true);
                  }}
                  color={Colors.velvet}
                  checkedColor={Colors.primary}
                  disabledColor={Colors.velvet}
                />
                <Text
                  style={{
                    color: Colors.velvet,
                    fontSize: 14,
                    flex: 1,
                    paddingHorizontal: 8,
                  }}
                >
                  Yes
                </Text>
              </Pressable>
            </FormGradient>
            <FormGradient vertical>
              <Pressable
                onPress={() => {
                  setIsOrderingForSelf(false);
                }}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                  rounded
                  checked={isOrderingForSelf === false}
                  onValueChange={() => {
                    setIsOrderingForSelf(false);
                  }}
                  color={Colors.velvet}
                  checkedColor={Colors.primary}
                  disabledColor={Colors.velvet}
                />
                <Text
                  style={{
                    color: Colors.velvet,
                    fontSize: 14,
                    flex: 1,
                    paddingHorizontal: 8,
                  }}
                >
                  No
                </Text>
              </Pressable>
            </FormGradient>
          </View>
        </View>

        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            A clinician may contact you by phone for positive results.
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Pressable
            onPress={() => {
              setChecked(!checked);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckBox
              size={20}
              rounded
              checked={checked === true}
              onValueChange={setChecked}
              color={Colors.velvet}
              checkedColor={Colors.primary}
              disabledColor={Colors.velvet}
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
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            marginVertical: 16,
          }}
        >
          <BigColoredButton
            onPress={() => {
              navigation.goBack();
            }}
            text="Previous"
          />
          <BigColoredButton
            disabled={
              !checked ||
              genderAtBirth === null ||
              date === null ||
              isDateErr !== ""
            }
            onPress={handleSubmit(onSubmit)}
            text="Next"
          />
        </View>

        <OrderingForSelfModal
          modalVisible={isOrderingForSelf === false}
          setModalVisible={setIsOrderingForSelf}
        />
      </ScrollView>
    </View>
  );
};

export default IntakeForm;
