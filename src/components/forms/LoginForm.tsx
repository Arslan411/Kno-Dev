import {
  Pressable,
  ScrollView,
  TextInput,
  View,
  Text,
  Linking,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "src/constants/Colors";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { LoginFormDataType, LoginFormSchema } from "src/types/AuthTypes";
import { StackNavigation } from "src/types/NavigationTypes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FormGradient from "./FormGradient";
import BigColoredButton from "../BigColoredButton";
import AuthServices from "src/services/AuthServices";
import { Toast } from "../ToastManager";
import { Loading, StatusCode } from "src/constants/enums";
import StrokeText from "../StrokeText";
import { WebViewModal } from "../WebviewModel";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import useUserStore from "src/store/userStore";
import useTokenStore from "src/store/tokenStore";

const LoginForm = () => {
  const [loading, setLoading] = React.useState<Loading>(Loading.idle);
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigation = useNavigation<StackNavigation>();
  const [modelVisible, setModelVisible] = useState(false);

  const setIsFirstTime = useUserStore((state) => state.setIsFirstTime);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormDataType>({
    resolver: yupResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    reset();
  }, []);

  const onSubmit = async (data: LoginFormDataType) => {
    setErrorMessage("");
    setLoading(Loading.loading);
    try {
      const res = await AuthServices.getOtpLogin(data);

      if (res.status === StatusCode.ok) {
        setLoading(Loading.idle);
        navigation.navigate("LoginVerifyOTP", {
          email: data.email,
          password: data.password,
          mobile: res.data.data[0].mobile,
        });
      }
    } catch (error: any) {
      if (error.response.data.message.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
        Toast.error("TOO_MANY_ATTEMPTS_TRY_LATER");
        setErrorMessage(error.response.data.message);
        setLoading(Loading.error);
      } else {
        Toast.error(error.response.data.message);
        setErrorMessage(error.response.data.message);
        setLoading(Loading.error);
      }
    }
  };

  GoogleSignin.configure({
    webClientId:
      "842658485079-o9sqssn49jklqpscereimqmnot0tcnhh.apps.googleusercontent.com",
  });

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const data = await GoogleSignin.signIn();
    console.log("user--", data);
    const googleCredential = auth.GoogleAuthProvider.credential(data?.idToken);
    try {
      const res = await AuthServices.socialAuthLogin(data);
      setIsFirstTime(res.data?.data[0].isFirstLogin);
      setAccessToken(res.data?.data[0].accessToken);
      setRefreshToken(res.data?.data[0].refreshToken);
    } catch (error: any) {
      console.log("errror--", error);
    }
    return auth().signInWithCredential(googleCredential);
  }

  async function onAppleButtonPress() {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error("Apple Sign-In failed - no identify token returned");
      }
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );

      const authResult = await auth().signInWithCredential(appleCredential);
      // const { displayName, email, uid, photoURL } = authResult.user;
      console.log("authResult-----", authResult);
      var data = authResult.user;
      const appleIdentityToken = identityToken;
      // console.log("dataa--", data);
      // console.log("appleIdentityToken--", appleIdentityToken);

      // console.log("appleuser---data", userData);
      data.appleIdentityToken = appleIdentityToken;
      const requ = { data, appleIdentityToken: appleIdentityToken };
      const userData = { ...data, appleIdentityToken };

      try {
        const res = await AuthServices.socialAppleAuth(requ);
        setIsFirstTime(res.data?.data[0].isFirstLogin);
        setAccessToken(res.data?.data[0].accessToken);
        setRefreshToken(res.data?.data[0].refreshToken);
        console.log("res of apple auth", res?.data);
      } catch (error: any) {
        console.log("errror of apple auth--", error);
      }

      // console.log("Apple Identity Token:", appleIdentityToken);
      return authResult.user;
    } catch (error) {
      console.error("Apple Sign-In Error:", error);
      throw error;
    }
  }

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          flex: 1,
          gap: 8,
          margin: 16,
        }}
      >
        <View style={{ top: 15 }}>
          <StrokeText
            myText={`Welcome
              `}
          />
        </View>

        {errorMessage && (
          <Text
            style={{
              color: Colors.primary,
              fontWeight: "bold",
              textAlign: "center",
              width: "75%",
              alignSelf: "center",
              bottom: 10,
              lineHeight: 21,
            }}
          >
            {
              "Heck! We don’t recognize that username or password. Please re-enter your information and try again."
            }
          </Text>
        )}

        <View
          style={{
            gap: 8,
          }}
        >
          <Text
            textType="medium"
            style={{
              fontSize: 14,
              color: Colors.velvet,
            }}
          >
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <TextInput
                  // autoFocus
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoComplete="email"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value.trim()}
                  style={{
                    fontFamily: "DMSans_500Medium",
                    color: Colors.velvet,
                  }}
                />
              </FormGradient>
            )}
          />
          {errors.email && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
              }}
            >
              {errors.email?.message}
            </Text>
          )}
        </View>
        <View
          style={{
            gap: 8,
          }}
        >
          <Text
            textType="medium"
            style={{
              fontSize: 14,
              color: Colors.velvet,
            }}
          >
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    secureTextEntry={passwordVisible}
                    keyboardType="default"
                    autoCorrect={false}
                    autoComplete="password"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      flex: 1,
                      fontFamily: "DMSans_500Medium",
                      color: Colors.velvet,
                    }}
                  />

                  <Pressable
                    onPress={() => {
                      setPasswordVisible(!passwordVisible);
                    }}
                  >
                    {passwordVisible ? (
                      <MaterialCommunityIcons
                        name="eye-off-outline"
                        size={24}
                        color={Colors.velvet}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="eye-outline"
                        size={24}
                        color={Colors.velvet}
                      />
                    )}
                  </Pressable>
                </View>
              </FormGradient>
            )}
          />
          {errors.password && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
              }}
            >
              {errors.password.message}
            </Text>
          )}
        </View>

        <Pressable
          style={{
            width: "40%",
            alignSelf: "flex-end",
          }}
          onPress={() => {
            navigation.navigate("ForgotPassword");
          }}
        >
          <Text
            style={{
              textDecorationLine: "underline",
              fontSize: 14,
              color: Colors.primary,
              textAlign: "right",
              paddingBottom: 16,
            }}
          >
            Forgot Password?
          </Text>
        </Pressable>
        <View
          style={{
            gap: 12,
            marginTop: 50,
          }}
        >
          <BigColoredButton
            onPress={handleSubmit(onSubmit)}
            text="Login"
            isLoading={loading === "loading"}
          />

          <Pressable onPress={() => navigation.navigate("Root")}>
            <Text
              style={{
                textDecorationLine: "underline",
                fontSize: 18,
                color: Colors.primary,
                textAlign: "center",
                paddingBottom: 16,
              }}
            >
              Create Account
            </Text>
          </Pressable>
          {/* <BigColoredButton
            onPress={() => {
              reset();
              // navigation.navigate("TenetOne");
              navigation.navigate("Consent");
            }}
            text="Register"
          /> */}
          {/* <BigColoredButton
            onPress={() => setModelVisible(true)}
            // onPress={() => {
            //   reset();
            //   // Linking.openURL("https://kno.co/pages/policies");
            //   navigation.navigate("LearnMoreWebView", {
            //     isLogin: true,
            //   });
            // }}
            text="Learn more"
          /> */}
          {/* <BigColoredButton
            onPress={() => onGoogleButtonPress()}
            text="Continue with google"
          /> */}

          {/* {Platform.OS === "ios" && (
            <BigColoredButton
              onPress={() => onAppleButtonPress()}
              text="Continue with apple"
            />
          )} */}
        </View>

        {modelVisible && (
          <WebViewModal
            onClose={() => setModelVisible(false)}
            link={"https://kno.co/"}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default LoginForm;
