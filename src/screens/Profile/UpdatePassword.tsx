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
import Input from "src/components/Inputs/CustomInput";
import ProfileServices from "src/services/ProfileServices";

const UpdatePassword = ({ navigation, route }: any) => {
  const [isConfirm, setIsConfirm] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  useEffect(() => {
    handlePasswordChange();
  }, [isConfirm]);

  const handlePasswordChange = () => {
    if (isConfirm) {
      changePassApi();
    } else if (isConfirm === false) {
      navigation.navigate("Profile");
    } else {
    }
  };

  const changePassApi = async () => {
    if (!form.password) {
      Toast.error("Password is required");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      Toast.error("Password must be 8 characters long");
      setLoading(false);
      return;
    }

    if (!form?.confirmPassword) {
      Toast.error("Please confirm your password");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      Toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await ProfileServices.editProfile({
        password: form.password ? form.password : null,
      });
      if (res.status === 200) {
        Toast.success("Password changed successfully");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        setLoading(false);
      }
    } catch (error: any) {
      console.log("error-=-", error);
      Toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <SV style={styles.container}>
      <UserHeader />
      <View style={styles.innerContainer}>
        <Cards
          headerCard
          backNavigate
          headerTxt={"Update password"}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.inputContainer}>
            <Input
              placeholderTxt="New password"
              onChangeText={(val) => handleInputChange("password", val)}
              value={form.password}
              secureTextEntry
            />
            <Input
              placeholderTxt="Confirm password"
              onChangeText={(val) => handleInputChange("confirmPassword", val)}
              value={form.confirmPassword}
              secureTextEntry
            />
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
                changePassApi();
              }}
            />
          </View>
        </Cards>
      </View>
    </SV>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 10,
  },

  profileBottom: {
    flexDirection: "row",
    width: "65%",
    justifyContent: "space-evenly",
    alignSelf: "center",
    marginVertical: 15,
    // paddingHorizontal: -15,
  },
  inputContainer: {
    margin: 10,
    gap: 20,
  },
});
