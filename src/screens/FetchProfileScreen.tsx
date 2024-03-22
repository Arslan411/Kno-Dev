import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native";
import BigColoredButton from "src/components/BigColoredButton";
import { SV } from "src/components/Themed";
import { Colors } from "src/constants/Colors";
import { Loading, OrderStatus } from "src/constants/enums";
import ProfileServices from "src/services/ProfileServices";
import useTokenStore from "src/store/tokenStore";
import useUserStore from "src/store/userStore";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import * as SecureStore from "expo-secure-store";
import TestServices from "src/services/TestServices";
import useOrderStore from "src/store/orderStore";
import useDiseaseStore from "src/store/diseaseStore";
import ResultServices from "src/services/ResultServices";
import useResultStore from "src/store/resultStore";
import usesampleCollectionStore from "src/store/sampleCollectionStore";

const FetchProfileScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"FetchProfile">) => {
  const clear = useTokenStore((state) => state.clear);
  const setUser = useUserStore((state) => state.setUser);
  const order = useOrderStore((state) => state.order);
  const setOrder = useOrderStore((state) => state.setOrder);
  const setStis = useDiseaseStore((state) => state.setStis);
  const [loading, setLoading] = useState<Loading>(Loading.loading);
  const setResult = useResultStore((state) => state.setResult);

  const fetchProfile = async () => {
    setLoading(Loading.loading);
    try {
      const promises = [
        TestServices.fetchOrderStatus(),
        TestServices.getSTIList(),
        ProfileServices.fetchProfile(),
      ];

      const [res, res1, res2] = await Promise.allSettled(promises);
      console.log("res2.value.data.data[0]--", res2?.value.data.data[0]);

      if (res.status === "fulfilled" && res?.value?.data?.data?.[0]) {
        setOrder(res.value.data.data[0]);
      }

      if (res1.status === "fulfilled") {
        setStis(res1.value.data.data);
      }

      if (res2.status === "fulfilled") {
        useUserStore.setState({
          user: {
            firstName: res2.value.data.data[0].firstName,
            lastName: res2.value.data.data[0].lastName,
            primaryEmail: res2.value.data.data[0].primaryEmail,
            referringEmail: res2.value.data.data[0].referringEmail,
            profilePic:
              res2.value.data.data[0].profilePic !== null
                ? `${res2.value.data.data[0].profilePic}?q=${Date.now()}`
                : null,
            mobile: res2.value.data.data[0].mobile,
            address1: res2.value.data.data[0].address1,
            address2: res2.value.data.data[0].address2,
            city: res2.value.data.data[0].city,
            state: res2.value.data.data[0].state,
            zipCode: res2.value.data.data[0].zipCode,
            gender: res2?.value.data.data[0]?.gender,
            dob: res2?.value.data.data[0]?.dob,
          },
        });
        navigation.navigate("Root");
      } else {
        // removeLocalTokens();
        console.log("working");
      }
    } catch (error: any) {
      setLoading(Loading.error);
      // Toast.error(error.response.data.message);
    }
  };

  const removeLocalTokens = async () => {
    useTokenStore.getState().clear();
    useUserStore.getState().clear();
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <SV style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={Colors.velvet} size="large" />
      </View>
    </SV>
  );
};

export default FetchProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
