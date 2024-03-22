import HomeHeader from "src/components/HomeScreen/Header";
import { SV } from "src/components/Themed";
import EditProfileForm from "src/components/forms/EditProfileForm";
import { RootTabScreenProps } from "src/types/NavigationTypes";
import React from "react";
import UserHeader from "src/components/HomeScreen/UserHeader";

const ProfileScreen = ({ navigation }: RootTabScreenProps<"Profile">) => {
  return (
    <SV>
      {/* <HomeHeader /> */}
      <UserHeader />
      <EditProfileForm />
    </SV>
  );
};

export default ProfileScreen;
