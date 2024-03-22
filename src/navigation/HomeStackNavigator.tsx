import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import HomeScreen from "src/screens/BottomTabs/HomeScreen";
import CouponScreen from "src/screens/CouponScreen";
import HomeSampleCollectionScreen from "src/screens/Dashboard/HomeSampleCollectionScreen";
import OrderStatusScreen from "src/screens/Dashboard/OrderStatusScreen";
import SelfReportingScreen from "src/screens/Dashboard/SelfReportingScreen";
import FaqScreen from "src/screens/FaqScreen";
import ChoosePlanScreen from "src/screens/GetTestedFlow/ChoosePlanScreen";
import CurrentSymptomsScreen from "src/screens/GetTestedFlow/CurrentSymptomsScreen";
import GetTestScreen from "src/screens/GetTestedFlow/GetTestScreen";
import IntakeFormScreen from "src/screens/GetTestedFlow/IntakeFormScreen";

import LetsDoScreen from "src/screens/GetTestedFlow/LetsDoScreen";
import PartnerHasSymptomsScreen from "src/screens/GetTestedFlow/PartnerHasSymptomsScreen";

import PartnerSymptomsScreen from "src/screens/GetTestedFlow/PartnerSymptomsScreen";
import PaymentCancelledScreen from "src/screens/GetTestedFlow/PaymentCancelledScreen";
import PaymentSuccessScreen from "src/screens/GetTestedFlow/PaymentSuccessScreen";
import PreviousSTIsScreen from "src/screens/GetTestedFlow/PreviousSTIsScreen";
import TestContentScreen from "src/screens/GetTestedFlow/TestContentScreen";
import PhotoEditorScreen from "src/screens/PhotoEditor";
import EditProfileShare from "src/screens/PhotoEditor/EditProfileShare";
import ImagePickerScreen from "src/screens/PhotoEditor/ImagePickerScreen";
import DoDontScreen from "src/screens/Profile/DoDontScreen";
// import ShareImageScreen from "src/screens/PhotoEditor/ShareImageScreen";
import EditProfileScreen from "src/screens/Profile/EditProfileScreen";
import { HomeStackParamList } from "src/types/NavigationTypes";
import IntakeOptionScreen from "src/screens/GetTestedFlow/IntakeOptionScreen";
import PartnerSTIsScreen from "src/screens/GetTestedFlow/PartnerSTIsScreen";
import SampleCollectionScreen from "src/screens/Dashboard/SampleCollectionScreen";
import IntakeCollection from "src/screens/GetTestedFlow/IntakeCollection";
import ReceivingResults from "src/screens/GetTestedFlow/ReceivingResults";
import DeleteAccount from "src/screens/Profile/DeleteAcc";
import UpdatePassword from "src/screens/Profile/UpdatePassword";
import UpdateAddress from "src/screens/Profile/UpdateAddress";
import NotificationDetailScreen from "src/screens/NotificationsDetails/NotificationsDetailScreen";
import NotificationsScreen from "src/screens/BottomTabs/NotificationsScreen";
import SaveBadgeScreen from "src/screens/PhotoEditor/SaveBadgeScreen";

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="Dashboard" component={HomeScreen} />
      <HomeStack.Screen name="TestContent" component={TestContentScreen} />
      <HomeStack.Screen name="IntakeForm" component={IntakeFormScreen} />
      <HomeStack.Screen name="EditProfile" component={EditProfileScreen} />
      <HomeStack.Screen name="ImagePicker" component={ImagePickerScreen} />
      <HomeStack.Screen name="SaveBadgeScreen" component={SaveBadgeScreen} />
      <HomeStack.Screen name="PhotoEditor" component={PhotoEditorScreen} />
      {/* <HomeStack.Screen name="ShareImage" component={ShareImageScreen} /> */}
      <HomeStack.Screen name="EditProfileShare" component={EditProfileShare} />
      <HomeStack.Screen name="GetTest" component={GetTestScreen} />
      <HomeStack.Screen name="LetsDo" component={LetsDoScreen} />
      <HomeStack.Screen name="DoDont" component={DoDontScreen} />

      <HomeStack.Screen name="PreviousSTIs" component={PreviousSTIsScreen} />
      <HomeStack.Screen name="IntakeOptions" component={IntakeOptionScreen} />
      <HomeStack.Screen name="SelfReporting" component={SelfReportingScreen} />
      <HomeStack.Screen name="IntakeCollection" component={IntakeCollection} />
      <HomeStack.Screen name="ReceivingResults" component={ReceivingResults} />
      <HomeStack.Screen name="DeleteAccount" component={DeleteAccount} />
      <HomeStack.Screen name="UpdatePassword" component={UpdatePassword} />
      <HomeStack.Screen name="UpdateAddress" component={UpdateAddress} />

      <HomeStack.Screen
        name="PartnerPreviousSTIs"
        component={PartnerSTIsScreen}
      />

      <HomeStack.Screen
        name="CurrentSymptoms"
        component={CurrentSymptomsScreen}
      />
      <HomeStack.Screen
        name="PartnerSymptoms"
        component={PartnerSymptomsScreen}
      />
      <HomeStack.Screen name="ChoosePlan" component={ChoosePlanScreen} />
      <HomeStack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
      />
      <HomeStack.Screen
        name="PaymentCancelled"
        component={PaymentCancelledScreen}
      />
      <HomeStack.Screen name="FaqScreen" component={FaqScreen} />
      <HomeStack.Screen name="OrderStatus" component={OrderStatusScreen} />
      <HomeStack.Screen
        name="HomeSampleCollection"
        component={HomeSampleCollectionScreen}
      />
      <HomeStack.Screen name="CouponScreen" component={CouponScreen} />
      <HomeStack.Screen
        name="SampleCollection"
        component={SampleCollectionScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
      <HomeStack.Screen
        name="NotificationDetailScreen"
        component={NotificationDetailScreen}
      />
    </HomeStack.Navigator>
  );
}
