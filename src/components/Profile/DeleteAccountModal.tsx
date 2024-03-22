import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Modal, Pressable, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { useState } from "react";
import AuthServices from "src/services/AuthServices";
import { Toast } from "../ToastManager";
import useUserStore from "src/store/userStore";
import useTokenStore from "src/store/tokenStore";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Loading, StatusCode } from "src/constants/enums";
import StrokeText from "../StrokeText";

type DeleteAccountModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const DeleteAccountModal = ({
  modalVisible,
  setModalVisible,
}: DeleteAccountModalProps) => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);

  const clearUser = useUserStore((state) => state.clear);
  const clear = useTokenStore((state) => state.clear);

  const logOut = async () => {
    clear();
    clearUser();
  };

  const onSubmit = async () => {
    setLoading(Loading.loading);
    try {
      const res = await AuthServices.deleteAccount();
      if (res.status === 200) {
        setLoading(Loading.idle);
        setModalVisible(false);
        logOut();
      }
    } catch (e: any) {
      setLoading(Loading.error);
      Toast.error(e.response.data.message);
    }
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <Pressable
        onPress={() => {
          setModalVisible(false);
        }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <Pressable
          style={{
            height: RFPercentage(50),
            marginTop: RFPercentage(8),
            marginHorizontal: 8,
            borderColor: Colors.velvet,
            borderWidth: 1,
            borderRadius: 10,
            borderBottomWidth: 4,
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0, 0]}
            end={[1, 1]}
            style={{
              flex: 1,
              padding: 12,
              paddingHorizontal: 24,
              borderRadius: 10,
              gap: 8,
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {/* <BackButtonWithGradient
              mv={2}
              onPress={() => {
                setModalVisible(false);
              }}
            /> */}
            <View
              style={{
                gap: 20,
              }}
            >
              <StrokeText fontSize={24} myText="Sure about that?" />
              {/* <Text
                textType="LBBold"
                style={{
                  textAlign: "center",
                  fontSize: RFPercentage(2.5),
                  color: Colors.velvet,
                }}
              >
                Sure about that?
              </Text> */}
              <Text
                textType="regular"
                style={{
                  textAlign: "center",
                  fontSize: RFPercentage(2),
                  color: Colors.velvet,
                }}
              >
                Deleted accounts can not be recovered & you will lose access to
                your test results.
              </Text>
              <Text
                textType="regular"
                style={{
                  textAlign: "center",
                  fontSize: RFPercentage(2),
                  color: Colors.velvet,
                }}
              >
                In the event of positive results, a doctor may still reach out
                as required to the phone number associated with your profile.
              </Text>
            </View>

            <Pressable
              onPress={() => {
                onSubmit();
              }}
              style={{
                height: RFPercentage(7.5),
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
              }}
            >
              <LinearGradient
                colors={[
                  "rgba(213, 187, 234, 0.5)",
                  "rgba(222, 244, 159, 0.5)",
                ]}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading === Loading.loading ? (
                  <ActivityIndicator size="small" color={Colors.velvet} />
                ) : (
                  <Text
                    textType="LBBold"
                    style={{
                      fontSize: RFPercentage(2),
                      color: Colors.velvet,
                    }}
                  >
                    Yes, Delete my Account
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DeleteAccountModal;
