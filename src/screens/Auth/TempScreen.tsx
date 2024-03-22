import React, { useState } from "react";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import { SV } from "src/components/Themed";
import AuthHeader from "src/components/AuthHeader";
import BigColoredButton from "src/components/BigColoredButton";
import { ScrollView, View } from "react-native";
import AuthServices from "src/services/AuthServices";
import useUserStore from "src/store/userStore";
import useTokenStore from "src/store/tokenStore";
import { Toast } from "src/components/ToastManager";
import HomeHeader from "src/components/HomeScreen/Header";

const TempScreen = ({ navigation }: RootStackScreenProps<"Temp">) => {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clear);
  const clear = useTokenStore((state) => state.clear);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const logOut = async () => {
    setLoading("loading");
    try {
      const res = await AuthServices.logout();
      if (res.status === 200) {
        clear();
        clearUser();
        Toast.success(res.data.message);
        setLoading("idle");
      }
    } catch (error: any) {
      setLoading("error");
      Toast.error(error.response.data.message);
    }
  };

  return (
    <SV
      style={{
        flex: 1,
      }}
    >
      <HomeHeader />
      <ScrollView
        style={{
          flex: 1,
          margin: 16,
          marginTop: 48,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <BigColoredButton
          text="LogOut"
          onPress={logOut}
          isLoading={loading === "loading"}
        />
      </ScrollView>
    </SV>
  );
};

export default TempScreen;
