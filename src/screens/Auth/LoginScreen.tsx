import React from "react";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import LoginForm from "src/components/forms/LoginForm";
import { SV } from "src/components/Themed";
import AuthHeader from "src/components/AuthHeader";

const LoginScreen = ({ navigation }: RootStackScreenProps<"Login">) => {
  return (
    <SV
      style={{
        flex: 1,
      }}
    >
      <AuthHeader logoCentered />
      <LoginForm />
    </SV>
  );
};

export default LoginScreen;
