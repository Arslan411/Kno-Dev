import { KeyboardAvoidingView, Platform, View } from "react-native";
import React from "react";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import RegisterForm from "src/components/forms/RegisterForm";
import { Icon, SV, Text } from "src/components/Themed";
import { Colors } from "src/constants/Colors";
import AuthHeader from "src/components/AuthHeader";

const RegisterScreen = ({ navigation }: RootStackScreenProps<"Register">) => {
  return (
    <SV
      style={{
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AuthHeader logoCentered />
        <RegisterForm />
      </KeyboardAvoidingView>
    </SV>
  );
};

export default RegisterScreen;
