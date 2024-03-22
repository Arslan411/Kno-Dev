import { useEffect, useState } from "react";
import { StyleSheet, Image, View, Platform, ScrollView } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Cards from "src/components/Cards/Cards";
import UserHeader from "src/components/HomeScreen/UserHeader";
import IconButton from "src/components/IconButton";

import { SV, Text } from "src/components/Themed";
import { Colors } from "src/constants/Colors";
import useTokenStore from "src/store/tokenStore";
import useUserStore from "src/store/userStore";
import { Loading } from "src/constants/enums";
import AuthServices from "src/services/AuthServices";
import { Toast } from "src/components/ToastManager";
import Input from "src/components/Inputs/CustomInput";
import { Dropdown } from "react-native-element-dropdown";
import ProfileServices from "src/services/ProfileServices";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

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

const UpdateAddress = ({ navigation, route }: any) => {
  const user = useUserStore((state) => state.user);
  const [isConfirm, setIsConfirm] = useState<boolean | undefined>(undefined);
  const [address1, setAddress1] = useState(user?.address1 ?? "");
  const [address2, setAddress2] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const [zip, setZip] = useState(user?.zipCode ?? "");

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

  useEffect(() => {
    handleDeleteAccount();
  }, [isConfirm]);

  const handleDeleteAccount = () => {
    if (isConfirm) {
      handleUpdateAddress();
    } else if (isConfirm === false) {
      navigation.navigate("Profile");
    } else {
    }
  };

  const handleSelectAddress = async (data: any, details: any) => {
    for (let i = 0; i < details.address_components.length; i++) {
      if (details.address_components[i].types[0] === "postal_code") {
        setZip(details.address_components[i].long_name);
      } else {
        // setZip("");
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

  const handleUpdateAddress = async () => {
    const zipReg = /^\d{5}(?:\d{4})?$/;
    if (!address1) {
      Toast.error("Address is required");
      setLoading(false);
      return;
    }

    if (address1.length <= 5) {
      Toast.error("Address must be more then 5 characters");
      setLoading(false);
      return;
    }

    if (!zip) {
      Toast.error("Zip code is required");
      setLoading(false);
      return;
    }

    if (!zipReg.test(zip)) {
      Toast.error("Zip code is not valid");
      setLoading(false);
      return;
    }

    if (!selectedState?.value) {
      Toast.error("Please select a State.");
      setLoading(false);
      return;
    }

    if (selectedState && selectedState.value !== "" && !selectedCity) {
      Toast.error("Please select a city.");
      setLoading(false);
      return;
    }
    if (selectedState?.value === "" && selectedCity?.value === "") {
      Toast.error("Please select both a state and a city.");
      setLoading(false);
      return;
    }
    if (selectedState?.value === "") {
      Toast.error("Please select a State.");
      setLoading(false);
      return;
    }
    if (user?.state === null && selectedState === null) {
      Toast.error("Please select a State.");
      setLoading(false);
      return;
    }
    if (user?.city === null && selectedCity === null) {
      Toast.error("Please select a City.");
      setLoading(false);
      return;
    }

    setLoading(true);

    const body: any = {
      address1: address1,
      address2: address2,
      zip: zip,
      state: selectedState?.label,
      city: selectedCity?.label,
    };
    try {
      const res = await ProfileServices.editProfile(body);
      if (res.status === 200) {
        Toast.success(res.data.message);
        setLoading(false);
        navigation.navigate("Profile");
      }
      ``;
    } catch (error: any) {
      console.log("error-=-", error);
      Toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <SV
      style={[
        styles.container,
        { opacity: isStateDropdownOpen || isCityDropdownOpen ? 0.5 : 1 },
      ]}
    >
      <UserHeader />

      <ScrollView
        style={[
          styles.innerContainer,
          { opacity: isStateDropdownOpen || isCityDropdownOpen ? 0.5 : 1 },
        ]}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios" ? RFPercentage(40) + 60 : RFPercentage(8) + 3,
        }}
      >
        <Cards
          headerCard
          backNavigate
          headerTxt={"Update address"}
          onPress={() => navigation.navigate("Profile")}
        >
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
              isRowScrollable
              // disableScroll
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
                  // flexGrow: 1,
                  position: "absolute",
                  top: "100%",
                  width: "100%",
                  zIndex: 1,
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

          <View style={styles.inputContainer}>
            <Input placeholderTxt={"Zip"} value={zip} onChangeText={setZip} />
          </View>

          <View style={styles.profileBottom}>
            <IconButton
              checked={isConfirm === false}
              unCheckedLabel="Cancel"
              checkedLabel={!isConfirm ? "Cancel" : ""}
              onPress={() => setIsConfirm(false)}
            />
            <IconButton
              loading={loading}
              checked={isConfirm === true}
              checkedLabel={isConfirm ? "Save" : ""}
              unCheckedLabel="Save"
              onPress={() => {
                setIsConfirm(true);
                handleUpdateAddress();
              }}
            />
          </View>
        </Cards>
      </ScrollView>
    </SV>
  );
};

export default UpdateAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    zIndex: -1,
  },

  profileBottom: {
    flexDirection: "row",
    width: "65%",
    justifyContent: "space-evenly",
    alignSelf: "center",
    marginVertical: 15,
    zIndex: -1,
    // paddingHorizontal: -15,
  },
  inputContainer: {
    margin: 10,
    zIndex: -1,
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
  },

  iconStyle: {
    width: 20,
    height: 20,
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
  addressinputContainer: {
    padding: 10,
    // backgroundColor: "red",
    // height: "32%",
  },
});
