import { StyleSheet, View, Text, Platform, ScrollView } from "react-native";
import HomeHeader from "src/components/HomeScreen/Header";
import { SV } from "src/components/Themed";
import IntakeForm from "src/components/forms/IntakeForm";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
import IconButton from "src/components/IconButton";
import { useState } from "react";
import { orderDetails } from "src/data/constantJson";
import { Colors } from "src/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import Input from "src/components/Inputs/CustomInput";
import OrderingForSelfModal from "src/components/GetTestedFlow/OrderingForSelfModal";
import { Toast } from "src/components/ToastManager";
import useUserStore from "src/store/userStore";
import { useEffect } from "react";
import useOrderStore from "src/store/orderStore";
import { OrderStatus } from "src/constants/enums";
import { useModal } from "src/components/GlobalModal/GlobalModal";

const IntakeFormScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"IntakeForm">) => {
  const user = useUserStore((state) => state.user);
  const order = useOrderStore((state) => state.order);

  const [isOrderingForSelf, setIsOrderingForSelf] = useState<
    boolean | undefined
  >(undefined);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [firstNameErr, setFirstNameErr] = useState("");
  const [lastNameErr, setLastNameErr] = useState("");
  const { showModal, closeModal } = useModal();

  type OrderDetail = {
    id: number;
    des: string;
  };

  useEffect(() => {
    setTimeout(() => {
      if (isOrderingForSelf !== undefined) {
        if (!isOrderingForSelf) {
          setIsOrderingForSelf(true);
        }
      }
    }, 500);
  }, [isOrderingForSelf]);

  const handleValidation = () => {
    if (!isOrderingForSelf) {
      Toast.error("Oops! you're missing something");
      return;
    }
    if (firstName && lastName) {
      setFirstNameErr("");
      setLastNameErr("");
      navigation.navigate("IntakeCollection", {
        firstName,
        lastName,
      });
    } else {
      if (!firstName) {
        setFirstNameErr("First name is required!");
      }
      if (!lastName) {
        setLastNameErr("Last name is required!");
      }
      if (firstName) {
        setFirstNameErr("");
      }
      if (lastName) {
        setLastNameErr("");
      }
    }
  };

  // useEffect(() => {
  //   if (order && order?.status !== OrderStatus.Released) {
  //     showModal({
  //       isVisible: true,
  //       heading: "Test in Progress",
  //       body: "It looks like you already have a test in progress with knō.",
  //       anotherBody:
  //         "Please keep an eye on your notifications screen to track your test status.",
  //       buttonText: "Okay",
  //       onClose: () => {
  //         closeModal();
  //         navigation.goBack();
  //       },
  //     });
  //   }
  // }, []);

  return (
    <SV style={styles.container}>
      <UserHeader />
      {/* <IntakeForm /> */}
      <ScrollView
        style={styles.innerContainer}
        showsVerticalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(30) + 100
              : RFPercentage(10) + 3,
        }}
      >
        <Cards
          refrenceCard
          headerTxt={"Here's what to expect"}
          bottomLabel={"See what we test for"}
          onNavClick={() => handleValidation()}
        >
          {orderDetails?.map((item: OrderDetail) => {
            return (
              <View style={styles.mapRow}>
                <View style={styles.pointersView}>
                  <Text style={styles.pointerTxt}>{item?.id}</Text>
                </View>
                <Text style={styles.description}>{item?.des}</Text>
              </View>
            );
          })}

          <View style={styles.orderingContainer}>
            <Text style={styles.orderingTitle}>Who are you ordering for?</Text>
            <View style={styles.row}>
              <IconButton
                checked={isOrderingForSelf === false}
                checkedIcon
                mark
                unCheckedLabel="A Friend"
                checkedLabel={isOrderingForSelf === false ? "A Friend" : ""}
                onPress={() => {
                  navigation.navigate("CouponScreen", {
                    referFriend: true,
                  });

                  setIsOrderingForSelf(false);
                  // setIsOrderingForSelf(true);
                }}
              />

              <IconButton
                checkedIcon
                checked={isOrderingForSelf === true}
                checkedLabel={isOrderingForSelf === true ? "Myself" : ""}
                unCheckedLabel="Myself"
                mark
                onPress={() => setIsOrderingForSelf(true)}
              />
            </View>
          </View>

          <View
            style={{
              paddingTop: 15,
              paddingBottom: 19,
              // backgroundColor: "red",
              width: "100%",
            }}
          >
            <Text style={styles.orderingTitle}>Let's start with your name</Text>

            <View style={styles.inputRow}>
              <View style={{ width: "49%" }}>
                <Input
                  onChangeText={(val) =>
                    setFirstName(val.replace(/[^A-Za-z]/g, ""))
                  }
                  value={firstName}
                  placeholderTxt={"First name"}
                  // width={Platform.OS === "ios" ? "50%" : RFPercentage(21.5)}
                  customStyles={{ paddingLeft: 13 }}
                />
                {firstNameErr && (
                  <Text style={styles.dateError}>{firstNameErr}</Text>
                )}
              </View>

              <View style={{ width: "49%" }}>
                <Input
                  onChangeText={(val) =>
                    setLastName(val.replace(/[^A-Za-z]/g, ""))
                  }
                  value={lastName}
                  placeholderTxt={"Last name"}
                  customStyles={{ paddingLeft: 13 }}
                  // width={Platform.OS === "ios" ? "50%" : RFPercentage(21.5)}
                />
                {lastNameErr && (
                  <Text style={styles.dateError}>{lastNameErr}</Text>
                )}
              </View>
            </View>
          </View>
        </Cards>
        {/* <OrderingForSelfModal
          modalVisible={isOrderingForSelf === false}
          setModalVisible={setIsOrderingForSelf}
        /> */}
      </ScrollView>
    </SV>
  );
};

export default IntakeFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "70%",
    alignSelf: "center",
  },
  pointersView: {
    height: 40,
    width: 40,
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  pointerTxt: {
    color: Colors.primaryDark,
    fontSize: RFPercentage(2),
    fontWeight: "500",
  },
  mapRow: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  description: {
    fontSize: RFPercentage(1.9),
    marginLeft: "5%",
    maxWidth: "80%",
  },
  orderingTitle: {
    textAlign: "center",
    fontSize: RFPercentage(2.2),
    color: Colors.black,
    fontWeight: "600",
    marginBottom: 10,
  },
  orderingContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 20,
    borderColor: Colors.primary,
    marginTop: 10,
  },
  inputRow: {
    justifyContent: "space-between",
    padding: 10,
    flexDirection: "row",
  },
  innerContainer: {
    padding: 10,
  },
  dateError: {
    color: "red",
    fontSize: 14,
    width: RFPercentage(16),
  },
});
