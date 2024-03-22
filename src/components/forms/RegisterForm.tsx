import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { Colors } from "src/constants/Colors";
import { Icon, Text } from "src/components/Themed";
import { Controller, useForm } from "react-hook-form";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { RegisterFormDataType, RegisterFormSchema } from "src/types/AuthTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthServices from "src/services/AuthServices";
import { Toast } from "../ToastManager";
import FormGradient from "./FormGradient";
import BigColoredButton from "../BigColoredButton";
import CheckBox from "../CheckBox";
import { Loading, StatusCode } from "src/constants/enums";
import useUserStore from "src/store/userStore";
import useTokenStore from "src/store/tokenStore";
import analytics from "@react-native-firebase/analytics";

const RegisterForm = () => {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    React.useState<boolean>(true);
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState<Loading>(Loading.idle);

  const setIsFirstTime = useUserStore((state) => state.setIsFirstTime);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);

  const navigateSuccess = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "RegistrationSuccess" }],
      })
    );
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormDataType>({
    resolver: yupResolver(RegisterFormSchema),
    defaultValues: {
      // firstName: "",
      // lastName: "",
      email: "",
      referringEmail: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormDataType) => {
    setLoading(Loading.loading);
    const mobile = data.mobile.replace(/[-()\s]/g, "");

    try {
      const res = await AuthServices.register({
        firstName: "",
        lastName: "",
        email: data.email,
        mobile: `+1${mobile}`,
        referringEmail: data.referringEmail ? data.referringEmail : null,
        password: data.password,
        allowCommunication: checked,
      });

      if (res.status === StatusCode.created) {
        setLoading(Loading.idle);
        setIsFirstTime(res.data?.data[0].isFirstLogin);
        setAccessToken(res.data?.data[0].accessToken);
        setRefreshToken(res.data?.data[0].refreshToken);
        // navigateSuccess();
        analytics().logEvent("Register_User", { parameters: null }),
          setChecked(false);
      }
    } catch (error: any) {
      Toast.error(error.response.data.message);
      setLoading(Loading.error);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 16,
        }}
      >
        {/* ------ first & last name hide -----*/}

        {/* <View style={styles.nameRow}>
          <View style={styles.f1g4}>
            <Text textType="LBRegular" style={styles.label}>
              First Name
              <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormGradient vertical flex={0}>
                  <TextInput
                    cursorColor={Colors.velvet}
                    importantForAutofill="yes"
                    keyboardType="default"
                    autoCorrect={false}
                    // autoComplete="name-given"
                    autoCapitalize="words"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text.replace(/[^A-Za-z]/g, ""));
                    }}
                    value={value.trim()}
                    style={styles.emailAndPhoneInput}
                  />
                </FormGradient>
              )}
            />
            {errors.firstName ? (
              <Text
                style={{
                  color: "red",
                  fontSize: 12,
                }}
              >
                {errors.firstName.message}
              </Text>
            ) : (
              <View style={{ height: errors.lastName ? 16 : 0 }} />
            )}
          </View>
          <View style={styles.f1g4}>
            <Text textType="LBRegular" style={styles.label}>
              Last Name
              <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormGradient vertical>
                  <TextInput
                    cursorColor={Colors.velvet}
                    keyboardType="default"
                    autoCorrect={false}
                    // autoComplete="name-family"
                    autoCapitalize="words"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text.replace(/[^A-Za-z]/g, ""));
                    }}
                    value={value.trim()}
                    style={styles.emailAndPhoneInput}
                  />
                </FormGradient>
              )}
            />
            {errors.lastName ? (
              <Text
                style={{
                  color: "red",
                  fontSize: 12,
                }}
              >
                {errors.lastName.message}
              </Text>
            ) : (
              <View style={{ height: errors.firstName ? 16 : 0 }} />
            )}
          </View>
        </View> */}

        <View
          style={{
            gap: 4,
            marginBottom: 8,
            marginTop: 25,
          }}
        >
          <Text textType="LBRegular" style={styles.label}>
            Primary Email
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <TextInput
                  cursorColor={Colors.velvet}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoComplete="email"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value.trim()}
                  style={styles.emailAndPhoneInput}
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
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* <View
          style={{
            gap: 4,
            marginBottom: 8,
          }}
        >
          <Text textType="LBRegular" style={styles.label}>
            Referring Email
          </Text>
          <Controller
            control={control}
            name="referringEmail"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <TextInput
                  cursorColor={Colors.velvet}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoComplete="email"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={
                    value === null || value === undefined
                      ? ""
                      : value.toString().trim()
                  }
                  style={styles.emailAndPhoneInput}
                />
              </FormGradient>
            )}
          />
          {errors.referringEmail && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
              }}
            >
              {errors.referringEmail.message}
            </Text>
          )}
        </View> */}

        <View
          style={{
            gap: 4,
            marginBottom: 8,
          }}
        >
          <Text textType="LBRegular" style={styles.label}>
            Phone Number
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Controller
            control={control}
            name="mobile"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <TextInput
                  cursorColor={Colors.velvet}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  // autoComplete="tel"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  maxLength={13}
                  onChangeText={(text) => {
                    const digits = text.replace(/[^0-9]/g, "").length;
                    if (digits <= 3) {
                      text = text.replace(/[^0-9]/g, "");
                    } else if (digits <= 6) {
                      text = text.replace(/[^0-9]/g, "");
                      text = text.replace(/(\d{3})(\d{1,3})/, "($1)$2");
                    } else {
                      text = text.replace(/[^0-9]/g, "");
                      text = text.replace(
                        /(\d{3})(\d{1,3})(\d{1,4})/,
                        "($1)$2-$3"
                      );
                    }
                    text = text.substring(0, 13);
                    onChange(text);
                  }}
                  value={value}
                  style={styles.emailAndPhoneInput}
                />
              </FormGradient>
            )}
          />
          {errors.mobile && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
              }}
            >
              {errors.mobile.message}
            </Text>
          )}
        </View>

        <View
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Text textType="LBRegular" style={styles.label}>
            Password
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <View
                  style={{
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    cursorColor={Colors.velvet}
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
                      <Icon
                        name="eye-off-outline"
                        size={24}
                        color={Colors.velvet}
                      />
                    ) : (
                      <Icon
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
                paddingBottom: 8,
              }}
            >
              {errors.password.message}
            </Text>
          )}
        </View>

        <View
          style={{
            gap: 4,
            marginBottom: 8,
          }}
        >
          <Text textType="LBRegular" style={styles.label}>
            Confirm Password
            <Text style={{ color: "red", justifyContent: "center" }}>*</Text>
          </Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <View
                  style={{
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    cursorColor={Colors.velvet}
                    secureTextEntry={confirmPasswordVisible}
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
                      setConfirmPasswordVisible(!confirmPasswordVisible);
                    }}
                  >
                    {confirmPasswordVisible ? (
                      <Icon
                        name="eye-off-outline"
                        size={24}
                        color={Colors.velvet}
                      />
                    ) : (
                      <Icon
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
          {errors.confirmPassword && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                paddingBottom: 8,
              }}
            >
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        <FormGradient vertical style={{ marginVertical: 12, top: 10 }}>
          <Pressable
            onPress={() => {
              setChecked(!checked);
            }}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <CheckBox
              rounded
              checked={checked}
              onValueChange={setChecked}
              color={Colors.velvet}
              checkedColor={Colors.primary}
              disabledColor={Colors.velvet}
            />
            <Text
              style={{
                color: Colors.velvet,
                fontSize: Platform.OS === "ios" ? 15 : 14,
                flex: 1,
                paddingHorizontal: 8,
              }}
            >
              I agree to receiving written communications from knō and their
              medical partners
            </Text>
          </Pressable>
        </FormGradient>

        <View
          style={{
            paddingTop: 16,
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
          }}
        >
          {/* <BigColoredButton
            onPress={() => {
              navigation.goBack();
            }}
            text="Previous"
          /> */}
          <BigColoredButton
            onPress={handleSubmit(onSubmit)}
            isLoading={loading === "loading"}
            disabled={loading === "loading" || !checked}
            text="Login"
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
  },
  nameRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  f1g4: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: Colors.velvet,
    marginTop: 5,
  },
  emailAndPhoneInput: {
    fontFamily: "DMSans_500Medium",
    color: Colors.velvet,
  },
});

export default RegisterForm;
