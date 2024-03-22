import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import { RegisterFormDataType } from "./AuthTypes";
import { GetTestedNavOptions } from "src/screens/GetTestedFlow/IntakeOptionScreen";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      Root: NavigatorScreenParams<RootStackParamList>;
    }
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  WelcomeVideoScreen: undefined;
  TenetOne: undefined;
  TenetTwo: undefined;
  TenetThree: undefined;
  TenetFour: undefined;
  Consent: any;
  Register: undefined;
  Login: undefined;
  LoginVerifyOTP: {
    email: string;
    password: string;
    mobile: string;
  };
  RegisterVerifyOTP: {
    form: RegisterFormDataType;
  };
  Temp: {
    text: string;
  };
  RegistrationSuccess: undefined;
  OpenEmail: {
    email: string;
  };
  SetPassword: {
    token: string;
  };
  ForgotPassword: undefined;
  FetchProfile: undefined;
  EditProfile: undefined;
  NotFound: undefined;
  PaymentWebView: {
    IntakeForm: any;
    url: string;
  };
  SampleCollection: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<
    RootStackParamList &
      RootTabParamList &
      ProfileStackParamList &
      HomeStackParamList,
    Screen
  >;

export type RootTabParamList = {
  Home: undefined;
  Notifications: undefined;
  Result: undefined;
  Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<
      RootStackParamList &
        RootTabParamList &
        ProfileStackParamList &
        HomeStackParamList,
      Screen
    >
  >;

export type HomeStackParamList = {
  ReceivingResults: any;
  IntakeCollection: any;
  Dashboard: undefined;
  SelfReporting: undefined;
  EditProfile: undefined;
  Dos: undefined;
  Donts: undefined;
  DosAndDonts: undefined;
  ChoosePhoto: undefined;
  ImagePicker: undefined;
  PhotoEditor: {
    uri: string;
  };
  ShareImage: {
    uri: string;
  };
  TestContent: undefined;
  IntakeForm: undefined;
  IntakeOptions: {
    IntakeForm: any;
  };
  PreviousSTIs: {
    IntakeForm: any;
    NavOptions: GetTestedNavOptions[];
  };
  PartnerPreviousSTIs: {
    IntakeForm: any;
    NavOptions: GetTestedNavOptions[];
  };
  CurrentSymptoms: {
    IntakeForm: any;
    NavOptions: GetTestedNavOptions[];
  };
  PartnerHasSymptoms: undefined;
  PartnerSymptoms: {
    IntakeForm: any;
    NavOptions: GetTestedNavOptions[];
  };
  ChoosePlan: {
    IntakeForm: any;
  };
  PaymentSuccess: undefined;
  PaymentCancelled: {
    IntakeForm: any;
  };
  FaqScreen: undefined;
  OrderStatus: undefined;
  HomeSampleCollection: undefined;
  CouponScreen: undefined;
  // Result: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  EditName: undefined;
  EditReferringEmail: undefined;
  EditPhoneNumber: undefined;
  ProfileVerifyOTP: {
    mobile: string;
    password?: string;
  };
  ChangePassword: undefined;
};

export type ProfileStackScreenProps<
  Screen extends keyof ProfileStackParamList
> = NativeStackScreenProps<ProfileStackParamList, Screen>;

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
  NativeStackScreenProps<
    RootStackParamList &
      RootTabParamList &
      ProfileStackParamList &
      HomeStackParamList,
    Screen
  >;

export type StackNavigation = StackNavigationProp<
  RootStackParamList &
    ProfileStackParamList &
    HomeStackParamList &
    RootTabParamList
>;
