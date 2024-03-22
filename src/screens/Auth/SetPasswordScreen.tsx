import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Icon, SV, Text } from "src/components/Themed";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import React from "react";
import { Colors } from "src/constants/Colors";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  SetPasswordFormSchema,
  SetPasswordFormType,
} from "src/types/AuthTypes";
import { Toast } from "src/components/ToastManager";
import AuthHeader from "src/components/AuthHeader";
import FormGradient from "src/components/forms/FormGradient";
import BigColoredButton from "src/components/BigColoredButton";
import AuthServices from "src/services/AuthServices";
import { Loading, StatusCode } from "src/constants/enums";

const SetPasswordScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"SetPassword">) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SetPasswordFormType>({
    resolver: yupResolver(SetPasswordFormSchema),
  });

  const [loading, setLoading] = React.useState<Loading>(Loading.idle);

  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    React.useState<boolean>(true);

  const onSubmit = async (data: SetPasswordFormType) => {
    setLoading(Loading.loading);
    try {
      const res = await AuthServices.resetPassword({
        emailToken: route.params.token,
        password: data.password,
      });
      setLoading(Loading.idle);
      Toast.success(res.data.message);
      if (res.status === 200) {
        navigation.navigate("Login");
        reset();
      }
    } catch (error: any) {
      setLoading(Loading.error);
      Toast.error(error.response.data.message);
    }
  };

  return (
    <SV
      style={{
        flex: 1,
        gap: 8,
      }}
    >
      <AuthHeader text="forgot something?" subText="Reset Your Password" />

      <ScrollView
        style={{
          flex: 1,
          gap: 8,
          margin: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Text
            textType="LBBold"
            style={{
              fontSize: 24,
              textAlign: "center",
              color: Colors.velvet,
            }}
          >
            Set Password
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: Colors.velvet,
              fontSize: 16,
              paddingHorizontal: 16,
            }}
          >
            Your new password must be different to previously used passwords.
          </Text>
        </View>

        <View
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Text
            textType="LBRegular"
            style={{
              fontSize: 14,
              color: Colors.velvet,
            }}
          >
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
            marginBottom: 16,
          }}
        >
          <Text
            textType="LBRegular"
            style={{
              fontSize: 14,
              color: Colors.velvet,
            }}
          >
            Confirm Password
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            }}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextInput
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

        <BigColoredButton
          onPress={handleSubmit(onSubmit)}
          text="Reset Password"
          isLoading={loading === "loading"}
          disabled={loading === "loading"}
        />
      </ScrollView>
    </SV>
  );
};

export default SetPasswordScreen;
