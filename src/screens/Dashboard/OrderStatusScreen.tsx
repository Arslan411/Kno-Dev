import HomeHeader from "src/components/HomeScreen/Header";
import { Icon, SV, Text } from "src/components/Themed";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import React, { useEffect, useState } from "react";
import { Colors, gradients } from "src/constants/Colors";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import SliderAccordion from "src/components/Notifications/SliderAccordion";
import { Loading, OrderStatus } from "src/constants/enums";
import TestServices from "src/services/TestServices";
import BigColoredButton from "src/components/BigColoredButton";
import GenericModal from "src/components/GetTestedFlow/GenericModal";
import useOrderStore from "src/store/orderStore";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import UserHeader from "src/components/HomeScreen/UserHeader";
import NotifiDetails from "src/components/Notifications/NotifiDetail";
import Cards from "src/components/Cards/Cards";

export type NotificationType = {
  id: number;
  title: string;
  subText: React.ReactNode;
};

const OrderStatusScreen = ({
  navigation,
}: HomeStackScreenProps<"OrderStatus">) => {
  const routes = navigation.getState()?.routes;

  // const prevRoute = routes[routes.length - 2].name;
  // const prevRoute = "PaymentSuccess";
  const prevRoute = routes[0]?.name;

  const navigate = () => {
    closeModal();
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

  const click = () => {
    const timer = setTimeout(() => navigate(), 350);
    return () => clearTimeout(timer);
  };

  const { showModal, closeModal } = useModal();
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const setOrder = useOrderStore((state) => state.setOrder);
  const [current, setCurrent] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [DerNotificationRequiredModal, setDerNotificationRequiredModal] =
    useState<boolean>(false);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDetails();
    setRefreshing(false);
  }, []);
  const fetchDetails = async () => {
    if (prevRoute === "PaymentSuccess") {
      setCurrent(1);

      setOrder({
        status: OrderStatus.NotCreated,
        trackingUrl: "",
        clinicalOrderId: "",
        inBoundTrackingNumber: "",
        inBoundTrackingUrl: "",
        kitOrderId: "",
        orderId: 0,
        sampleCollectedOn: "",
        shippedOn: "",
        trackingNumber: "",
        resultsReleasedOn: "",
      });

      const res = await TestServices.fetchOrderStatus();
      if (res?.data && res?.data?.data?.[0]) {
        setOrder(res.data.data[0]);
        setTrackingUrl(res.data.data[0].trackingUrl);
      }
      return;
    }

    setLoading(Loading.loading);
    try {
      const res = await TestServices.fetchOrderStatus();
      if (!res.data) {
        // setLoading(Loading.idle);
        setCurrent(0);
        return;
      }

      if (res?.data && res?.data?.data?.[0]) {
        setOrder(res.data.data[0]);
        setTrackingUrl(res.data.data[0].trackingUrl);
      }

      const status = res.data.data[0].status;

      switch (status) {
        case OrderStatus.Created:
        case OrderStatus.NotCreated:
          setCurrent(1);
          break;
        case OrderStatus.PendingReceipt:
        case OrderStatus.Shipped:
        case OrderStatus.CustomerInTransit:
        case OrderStatus.CustomerOutForDelivery:
          setCurrent(2);
          break;
        case OrderStatus.CustomerDelivered:
          setCurrent(3);
          break;
        case OrderStatus.LabInTransit:
        case OrderStatus.LabOutForDelivery:
        case OrderStatus.LabDelivered:
          setCurrent(4);
          break;
        case OrderStatus.InLab:
        case OrderStatus.InMroReview:
        case OrderStatus.PendingMroCcf:
        case OrderStatus.PendingAffidavit:
        case OrderStatus.Retest:
        case OrderStatus.LabReview:
        case OrderStatus.ResultsReady:
          setCurrent(5);
          break;
        case OrderStatus.Released:
          setCurrent(6);
          break;
        case OrderStatus.NotApproved:
        case OrderStatus.Failed:
        case OrderStatus.Exhausted:
        case OrderStatus.CancelledDamaged:
        case OrderStatus.CancelledUnuseable:
        case OrderStatus.CancelledVoided:
        case OrderStatus.CynergyApiError:
        case OrderStatus.PhysicianDetailsNotFound:
          setCurrent(0);
          showModal({
            isVisible: true,
            heading: "Cancelled",
            body: "You order was cancelled. If you have any questions, please reach out to support@kno.co",
            buttonText: "Exit",
            onClose: click,
          });
        case OrderStatus.DerNotificationRequired:
          setCurrent(0);
          setDerNotificationRequiredModal(true);
        default:
          setCurrent(1);
          break;
      }
      // setLoading(Loading.idle);
    } catch (error: any) {
      console.log(error.response.data.message);
      setCurrent(0);
      setModalVisible(true);
      setLoading(Loading.error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    setLoading(Loading.loading);
    setTimeout(() => {
      setLoading(Loading.idle);
    }, 1000);
  }, []);

  const data: NotificationType[] = [
    {
      id: 1,
      title: "Ordered",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          Heck yeah, you just took the first step towards better knowing your
          sexual wellness. Your kno kit has been ordered and should ship within
          24 hours. Keep an eye out for a notification to let you know when it’s
          en route.
        </Text>
      ),
    },
    {
      id: 2,
      title: "knō kit is En Route",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          This is kind of a big deal, your kno kit is headed your way.
          {trackingUrl && (
            <Text
              textType="regular"
              style={{
                fontSize: 14,
                color: Colors.velvet,
              }}
            >
              {" "}
              If you want to monitor the progress of your shipment, just
              <Pressable
                style={{ flexDirection: "row" }}
                onPress={() => {
                  Linking.openURL(trackingUrl!);
                }}
              >
                <Text
                  textType="medium"
                  style={{
                    fontSize: 14,
                    color: Colors.primary,
                    alignSelf: "flex-end",
                    marginBottom: -3,
                  }}
                >
                  {" "}
                  click here{" "}
                </Text>
              </Pressable>
              and see when you can expect it to arrive.
            </Text>
          )}
        </Text>
      ),
    },
    {
      id: 3,
      title: "knō kit was Delivered",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          Pssst....the mail’s here. Your kno kit has been delivered to wherever
          it is that you get mail - mailbox, PO box, your office (no judgement),
          or whatever. Important thing being that it’s arrived.
        </Text>
      ),
    },
    {
      id: 4,
      title: "knō kit En Route to Lab",
      subText: (
        <Text
          textType="medium"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          We’re impressed. You completed your knō kit all by yourself (or maybe
          your partner helped? Who knows?) What matters is you did it, and it’s
          on its way to the lab. You did remember to complete your
          <Pressable
            style={{ flexDirection: "row" }}
            onPress={() => {
              navigation.navigate("HomeSampleCollection");
            }}
          >
            <Text
              textType="regular"
              style={{
                fontSize: 14,
                color: Colors.primary,
                alignSelf: "flex-end",
                marginBottom: -2.5,
              }}
            >
              {" "}
              sample date form{" "}
            </Text>
          </Pressable>
          right????
        </Text>
      ),
    },
    {
      id: 5,
      title: "Lab is Processing knō kit",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          Good news everyone, your knō kit has reached our lab partners and is
          being processed as we speak - or text...whatever. We’ll let you know
          as soon as your results are ready for you.
        </Text>
      ),
    },
    {
      id: 6,
      title: "knō kit Results are Ready",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          The results are in. We know that this can be a stressful step, but we
          want you to remember that - no matter what the results say - knowing
          is the best thing you can do for your sexual wellness.
        </Text>
      ),
    },
  ];

  return (
    <SV style={{ flex: 1 }}>
      <UserHeader />
      {loading === Loading.loading ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.velvet]}
            />
          }
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS === "ios"
                ? RFPercentage(16) + 64
                : RFPercentage(16) + 64,
          }}
        >
          <ActivityIndicator
            style={{ paddingTop: RFPercentage(20) }}
            color={Colors.velvet}
            size="large"
          />
          <Text
            textType="LBBold"
            style={{
              fontSize: 18,
              paddingTop: RFPercentage(4),
              textAlign: "center",
              color: Colors.velvet,
            }}
          >
            Fetching current status...
          </Text>
        </ScrollView>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.velvet]}
            />
          }
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS === "ios"
                ? RFPercentage(16) + 64
                : RFPercentage(16) + 64,
          }}
        >
          <View style={{ padding: 10 }}>
            <Cards headerCard headerTxt="Testing Process Updates">
              {data.map((item) => (
                <NotifiDetails key={item.id} item={item} current={current} />
              ))}
            </Cards>
          </View>
          {/* <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderBottomWidth: 4,
              borderColor: Colors.velvet,
              margin: 8,
              borderRadius: 12,
            }}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0]}
              end={[1, 1]}
              style={{
                flex: 1,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {data.map((item) => (
                // <SliderAccordion key={item.id} item={item} current={current} />
                <NotifiDetails key={item.id} item={item} current={current} />
              ))}

              {current === 6 && (
                <BigColoredButton
                  style={{
                    marginBottom: 12,
                    marginHorizontal: 30,
                  }}
                  text="Show Result"
                  onPress={() => {
                    navigation.navigate("Result");
                  }}
                />
              )}
            </LinearGradient>
          </View> */}
          {current === 6 && (
            <BigColoredButton
              style={{
                marginBottom: 12,
                marginHorizontal: 30,
              }}
              text="Show Result"
              onPress={() => {
                navigation.navigate("Result");
              }}
            />
          )}
        </ScrollView>
      )}

      <GenericModal
        heading="Something went wrong"
        body="It seems like something went wrong, no worries though - click below to head back home and try again!"
        anotherBody="In the meantime, please send an email to info@kno.co to let us know what went wrong. Well, that’s not right. Got It!"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        buttonText="Take me home"
        onPress={click}
      />
    </SV>
  );
};

export default OrderStatusScreen;
