import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, gradients } from "src/constants/Colors";
import { Icon, Text } from "src/components/Themed";
import { Controller, useForm } from "react-hook-form";
import {
  EditProfileFormDataType,
  EditProfileFormSchema,
} from "src/types/AuthTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthServices from "src/services/AuthServices";
import { Toast } from "../ToastManager";
import FormGradient from "./FormGradient";
import BigColoredButton from "../BigColoredButton";
import { LinearGradient } from "expo-linear-gradient";
import useUserStore from "src/store/userStore";
import useTokenStore from "src/store/tokenStore";
import ProfileServices from "src/services/ProfileServices";
import DeleteAccountModal from "../Profile/DeleteAccountModal";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { Loading, StatusCode } from "src/constants/enums";
import { Dropdown } from "react-native-element-dropdown";
import useResultStore from "src/store/resultStore";
import useOrderStore from "src/store/orderStore";
import useDiseaseStore from "src/store/diseaseStore";
import useSampleCollectionStore from "src/store/sampleCollectionStore";
import { useModal } from "../GlobalModal/GlobalModal";
import StrokeText from "../StrokeText";
import DownButtonWithGradient from "../DownButtonWithGradient";
import { height } from "src/constants/Layout";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { date } from "yup";
import Cards from "../Cards/Cards";
import Input from "../Inputs/CustomInput";
import { images } from "src/utils/Images";
import IconButton from "../IconButton";

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

const EditProfileForm = () => {
  const navigation = useNavigation();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const setUser = useUserStore((state) => state.setUser);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(true);
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [logOutLoading, setLogoutLoading] = useState<Loading>(Loading.idle);
  const [stateData, setStateData] = useState<StateDataItem[] | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedCity, setSelectedCity] = useState<FormattedCityData | null>(
    null
  );

  const [genderDropdown, setGenderDropdown] = useState(false);
  const genderArr = [
    { id: 1, gender: "Male" },
    { id: 2, gender: "Female" },
  ];
  const isFocused = useIsFocused();
  const [genderValue, setGenderValue] = useState("");
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clear);
  const clearToken = useTokenStore((state) => state.clear);
  const clearStatus = useOrderStore((state) => state.clear);
  const clearResult = useResultStore((state) => state.clear);
  const clearStiList = useDiseaseStore((state) => state.clear);
  const clearSampleCollection = useSampleCollectionStore(
    (state) => state.clear
  );

  const { showModal, closeModal } = useModal();

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
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchProfileFromApi();
    if (user) {
      setGenderValue(user?.gender);
    }
  }, [isFocused]);

  const logOut = async () => {
    setLogoutLoading(Loading.loading);
    try {
      const res = await AuthServices.logout();
      if (res.status === StatusCode.ok) {
        await clearToken();
        await clearUser();
        await clearResult();
        await clearStiList();
        await clearStatus();
        await clearSampleCollection();
        closeModal();
        Toast.success(res.data.message);
        navigation.navigate("Dashboard");
        setLogoutLoading(Loading.idle);
      }
    } catch (error: any) {
      setLogoutLoading(Loading.error);

      Toast.error(error.response.data.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        setValue("firstName", user?.firstName);
        setValue("lastName", user?.lastName);
        setValue("email", user?.primaryEmail);
        setValue("referringEmail", user?.referringEmail);
        setValue("mobile", user?.mobile?.slice(-10) || "");
        setValue("address1", user?.address1 || "");
        setValue("address2", user?.address2 || "");
        setValue("zip", user?.zipCode || "");
        setValue("gender", user?.gender);
      }

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: 0,
        });
      }
    }, [user, user?.address1])
  );

  const capitalizeName = (text: string) => {
    let newText = text.charAt(0).toUpperCase() + text.slice(1);
    return newText;
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<EditProfileFormDataType>({
    resolver: yupResolver(EditProfileFormSchema),
    defaultValues: {
      firstName: capitalizeName(user?.firstName ? user?.firstName : ""),
      lastName: capitalizeName(user?.lastName ? user?.lastName : ""),
      email: user?.primaryEmail,
      referringEmail: user?.referringEmail,
      mobile: user?.mobile?.slice(-10),
      // password: "",
      // confirmPassword: "",
      // address1: user?.address1 ? user.address1 : "",
      // address2: user?.address2 ? user?.address2 : "",
      // city: user?.state,
      // state: user?.state,
      // zip: user?.zipCode ? user?.zipCode : "",
      gender: user?.gender ? user?.gender : "",
      // dob: user?.dob ? user.dob : "",
    },
  });

  const onSubmit = async (data: EditProfileFormDataType) => {
    setLoading(Loading.loading);

    const mobile = data.mobile.replace(/[-()\s]/g, "");

    try {
      const res = await ProfileServices.editProfile({
        firstName: data.firstName ? data.firstName : null,
        lastName: data.lastName ? data.lastName : null,
        email: data.email ? data.email : null,
        mobile: data.mobile ? `+1${mobile}` : null,
        referringEmail: data.referringEmail ? data.referringEmail : null,
        gender: genderValue ? genderValue : null,
      });

      if (res.status === 200) {
        fetchProfileFromApi();
        navigation?.navigate("Dashboard");
        Toast.success(res.data.message);
        setLoading(Loading.idle);
      }
    } catch (error: any) {
      console.log("error-=-", error);
      Toast.error(error.response.data.message);
      setLoading(Loading.error);
    }
  };
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      opacity: modalVisible ? 0.5 : 1,
      flexDirection: "column",
      padding: 10,
    },
    nameRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 16,
      marginBottom: 8,
    },
    f1g4: {
      flex: 1,
      gap: 4,
      marginHorizontal: 6,
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
      borderRadius: Platform.OS === "ios" ? 5 : 5,
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
      width: Platform.OS === "ios" ? width - 50 : width - 52,
    },

    inputRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    },
  });

  return (
    <>
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS === "ios" ? RFPercentage(16) : RFPercentage(16),
          }}
        >
          <Cards
            onDelete={() => navigation.navigate("DeleteAccount")}
            backNavigate
            headerTxt="My knō profile"
            refrenceCard
            buttonsRow
            onSave={handleSubmit(onSubmit)}
            onPress={() => navigation.navigate("Dashboard")}
            onUpdatePassword={() => navigation.navigate("UpdatePassword")}
          >
            <View style={styles.inputRow}>
              <View style={{ width: "49%" }}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={
                        value === null || value === undefined
                          ? ""
                          : value.toString().trim()
                      }
                      placeholderTxt={"First name"}
                      // width={"49%"}
                      keyboardType="default"
                      onChangeText={(text) => {
                        onChange(text.replace(/[^A-Za-z]/g, ""));
                      }}
                    />
                  )}
                />

                {errors.firstName ? (
                  <Text
                    style={{
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    {errors.firstName.message}
                  </Text>
                ) : (
                  <View style={{ height: errors.lastName ? 16 : 0 }} />
                )}
              </View>

              <View style={{ width: "49%" }}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onChangeText={(text) => {
                        onChange(text.replace(/[^A-Za-z]/g, ""));
                      }}
                      value={
                        value === null || value === undefined
                          ? ""
                          : value.toString().trim()
                      }
                      placeholderTxt={"Last name"}
                      // width={"49%"}
                    />
                  )}
                />
                {errors.lastName ? (
                  <Text
                    style={{
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    {errors.lastName.message}
                  </Text>
                ) : (
                  <View style={{ height: errors.firstName ? 16 : 0 }} />
                )}
              </View>
            </View>

            <View
              style={{
                gap: 4,
                marginBottom: 8,
                marginTop: 15,
                marginHorizontal: 10,
              }}
            >
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChangeText={onChange}
                    value={
                      value === null || value === undefined
                        ? ""
                        : value.toString().trim()
                    }
                    placeholderTxt={"Primary email"}
                  />
                )}
              />

              {errors.email && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 12,
                  }}
                >
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View
              style={{
                gap: 4,
                marginBottom: 8,
                marginHorizontal: 10,
                marginTop: 15,
              }}
            >
              <Controller
                control={control}
                name="mobile"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    keyboardType="number-pad"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.mobile && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 12,
                  }}
                >
                  {errors.mobile.message}
                </Text>
              )}
            </View>

            <View
              style={{
                gap: 4,
                marginBottom: 8,
                marginHorizontal: 10,
                marginTop: 15,
              }}
            >
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Input
                      inputIcon
                      onIconPress={() => setGenderDropdown(!genderDropdown)}
                      source={images.arrowDown}
                      keyboardType="default"
                      onChangeText={onChange}
                      value={genderValue == "true" ? "" : genderValue}
                      placeholderTxt={"Affirmed gender"}
                      customIconStyle={{ height: 29, width: 29 }}
                      customStyles={{ paddingRight: "10%" }}
                    />
                  </View>
                )}
              />
              {genderDropdown && (
                <View
                  style={{
                    flex: 1,
                    borderRadius: 5,
                    bottom: 5,
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                  }}
                >
                  {genderArr?.map((item) => (
                    <Pressable
                      key={item?.id}
                      onPress={() => {
                        setGenderValue(item?.gender);
                        setGenderDropdown(false);
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 14,
                          marginTop: 2,
                          marginLeft: 10,
                        }}
                      >
                        {item?.gender}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: 10,
                marginTop: 2,
              }}
            >
              <Text style={{ fontSize: RFPercentage(1.9) }} textType="bold">
                Shipping address
              </Text>
              <IconButton
                onPress={() => navigation.navigate("UpdateAddress")}
                source={images.updateIcon}
                width={RFPercentage(12)}
                height={RFPercentage(5.4)}
                checked
                checkedLabel="Update"
                checkedIcon
              />
            </View>
            <Text
              style={{
                marginLeft: "5%",

                marginVertical: 10,
                marginBottom: 13,
                fontSize: RFPercentage(1.7),
              }}
            >
              {user?.address1 +
                ", " +
                user?.city +
                ", " +
                user?.state +
                ", " +
                "USA"}
            </Text>
          </Cards>

          <View
            style={{
              gap: 22,
              paddingBottom: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BigColoredButton
              onPress={logOut}
              isLoading={logOutLoading === "loading"}
              disabled={logOutLoading === "loading"}
              style={{ width: "95%", marginTop: 50 }}
              text="Log Out"
            />
          </View>

          {/* <DeleteAccountModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          /> */}
        </ScrollView>
      </View>
    </>
  );
};

export default EditProfileForm;
