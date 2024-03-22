import { useEffect, useState } from "react";
import { StyleSheet, Image, View } from "react-native";
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

const DeleteAccount = ({ navigation, route }: any) => {
  const [isConfirm, setIsConfirm] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const clearUser = useUserStore((state) => state.clear);
  const clear = useTokenStore((state) => state.clear);

  const logOut = async () => {
    clear();
    clearUser();
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await AuthServices.deleteAccount();
      if (res.status === 200) {
        setLoading(false);
        Toast.error("Account deleted successfully!");
        logOut();
        navigation.navigate("Dashboard");
      }
    } catch (e: any) {
      setLoading(false);
      Toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    handleDeleteAccount();
  }, [isConfirm]);

  const handleDeleteAccount = () => {
    if (isConfirm) {
      onSubmit();
    } else if (isConfirm === false) {
      navigation.navigate("Profile");
    } else {
    }
  };
  return (
    <SV style={styles.container}>
      <UserHeader />
      <View style={styles.innerContainer}>
        <Cards
          headerCard
          backNavigate
          headerTxt={"Are you sure?"}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.flexBox}>
            <Text style={styles.icon}>🧐</Text>
            <Text style={styles.txt}>
              Are you sure you want to delete your account?
            </Text>
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
              checkedLabel={isConfirm ? "Confirm" : ""}
              unCheckedLabel="Confirm"
              onPress={() => setIsConfirm(true)}
            />
          </View>
        </Cards>
      </View>
    </SV>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 10,
  },
  flexBox: {
    padding: 30,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#BDC99C",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 4,
  },
  icon: {
    fontSize: RFPercentage(5),
    marginBottom: 20,
  },
  txt: {
    fontSize: RFPercentage(2),
    color: Colors.black,
    width: "90%",
    textAlign: "center",
    top: 6,
  },
  profileBottom: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-evenly",
    alignSelf: "center",
    marginVertical: 15,
  },
});
