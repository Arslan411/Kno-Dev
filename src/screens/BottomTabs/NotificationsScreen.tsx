import HomeHeader from "src/components/HomeScreen/Header";
import { Icon, SV, Text } from "src/components/Themed";
import { RootTabScreenProps } from "src/types/NavigationTypes";
import React, { useEffect, useState } from "react";
import { Colors, gradients } from "src/constants/Colors";
import { Loading } from "src/constants/enums";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Image,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import NotificationServices from "src/services/NotificationServices";
import FormGradient from "src/components/forms/FormGradient";
import { LinearGradient } from "expo-linear-gradient";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import NotificationPlaceHolder from "src/components/Notifications/NotificationPlaceHolder";
import StrokeText from "src/components/StrokeText";
import UserHeader from "src/components/HomeScreen/UserHeader";
import { images } from "src/utils/Images";
import Cards from "src/components/Cards/Cards";

export type NotificationType = {
  CreatedOn: string;
  Id: number;
  Message: string;
  Title: string;
};

const NotificationsScreen = ({
  navigation,
}: RootTabScreenProps<"Notifications">) => {
  const [loading, setLoading] = useState<Loading>(Loading.loading);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { showModal, closeModal } = useModal();
  const isFocused = useIsFocused();

  const convertDateTime = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchNotifications = async () => {
    setLoading(Loading.loading);
    try {
      const res = await NotificationServices.fetch(10, 1);
      setNotifications(res.data.data.rows);
      setLoading(Loading.idle);
    } catch (error: any) {
      console.log(error.response.data);
      setLoading(Loading.error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [isFocused])
  );

  const onPress = (notification: NotificationType) => {
    showModal({
      isVisible: true,
      heading: notification.Title,
      body: notification.Message,
      // anotherBody: convertDateTime(notification.CreatedOn),
      onClose: () => {
        closeModal();
      },
      buttonText: "Close",
    });
  };

  return (
    <SV style={{ flex: 1 }}>
      <UserHeader />

      {loading === Loading.loading ? (
        <ActivityIndicator
          color={Colors.velvet}
          size="large"
          style={{ paddingTop: RFPercentage(20) }}
        />
      ) : notifications.length === 0 ? (
        <NotificationPlaceHolder />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.velvet]}
            />
          }
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS === "ios"
                ? RFPercentage(16) + 64
                : RFPercentage(16) + 64,
          }}
        >
          <Cards
            headerCard
            backNavigate
            headerTxt="Notifications"
            onPress={() => navigation.navigate("Dashboard")}
          >
            <View>
              {notifications.map((notification: any) => (
                <Pressable
                  style={styles.button}
                  key={notification.id}
                  onPress={() =>
                    navigation.navigate("NotificationDetailScreen", {
                      CreatedOn: notification.CreatedOn,
                      Id: notification.id,
                      Message: notification.Message,
                      Title: notification.Title,
                    })
                  }
                >
                  <View style={styles.notifiContainer}>
                    <View>
                      <Image
                        source={require("../../assets/ellipseCircle.png")}
                        style={styles.circelImage}
                      />
                    </View>

                    <View
                      style={{
                        marginHorizontal: 16,
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <Text style={styles.messagetxt}>
                        {notification.Message}
                      </Text>

                      <Text style={styles.timetxt}>
                        {convertDateTime(notification.CreatedOn)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </Cards>
        </ScrollView>
      )}
    </SV>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: Colors.velvet,
    paddingVertical: 16,
  },
  boxTitle: {
    fontSize: 16,
    color: Colors.velvet,
  },
  boxText: {
    fontSize: 14,
    color: Colors.velvet,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  SplashCard: {
    borderWidth: 1,
    borderBottomWidth: 5,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    marginVertical: 8,
    borderRadius: 10,
  },
  headingText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 16,
    // marginHorizontal: 70,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#BDC99C",
    margin: 8,
  },
  notifiContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
    flexDirection: "row",
  },
  circelImage: {
    width: 11,
    height: 11,
    marginVertical: RFPercentage(0.52),
  },
  messagetxt: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  timetxt: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
});
