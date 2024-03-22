import { KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import { SV } from "src/components/Themed";
import EditProfileForm from "src/components/forms/EditProfileForm";
import HomeHeader from "src/components/HomeScreen/Header";

const EditProfileScreen = ({
  navigation,
}: HomeStackScreenProps<"EditProfile">) => {
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
        <HomeHeader />
        <EditProfileForm />
      </KeyboardAvoidingView>
    </SV>
  );
};

export default EditProfileScreen;
