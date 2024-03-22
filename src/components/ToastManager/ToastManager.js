import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import React, { Component } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import defaultProps from "./ToastProps";
import { Colors } from "./ToastTheme";
import { Colors as AppColors, gradients } from "src/constants/Colors";
import styles from "./styles";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

class ToastManager extends Component {
  constructor(props) {
    super(props);
    ToastManager.__singletonRef = this;
  }

  state = {
    isShow: false,
    text: "",
    opacityValue: new Animated.Value(1),
    barWidth: new Animated.Value(RFPercentage(32)),
    barColor: Colors.default,
    icon: "checkmark-circle",
    position: this.props.position,
    animationStyle: {
      upInUpOut: {
        animationIn: "slideInDown",
        animationOut: "slideOutUp",
      },
      rightInOut: {
        animationIn: "slideInRight",
        animationOut: "slideOutRight",
      },
      zoomInOut: {
        animationIn: "zoomInDown",
        animationOut: "zoomOutUp",
      },
    },
  };

  static info = (text, position) => {
    ToastManager.__singletonRef.show(
      text,
      Colors.info,
      "ios-information-circle",
      position
    );
  };

  static success = (text, position) => {
    ToastManager.__singletonRef.show(
      text,
      Colors.success,
      "checkmark-circle",
      position
    );
  };

  static warn = (text, position) => {
    ToastManager.__singletonRef.show(text, Colors.warn, "warning", position);
  };

  static error = (text, position) => {
    ToastManager.__singletonRef.show(
      text,
      Colors.error,
      "alert-circle",
      position
    );
  };

  show = (text = "", barColor = Colors.default, icon, position) => {
    const { duration } = this.props;
    this.state.barWidth.setValue(this.props.width);
    this.setState({
      isShow: true,
      duration,
      text,
      barColor,
      icon,
    });
    if (position) this.setState({ position });
    this.isShow = true;
    if (duration !== this.props.end) this.close(duration);
  };

  close = (duration) => {
    if (!this.isShow && !this.state.isShow) return;
    this.resetAll();
    this.timer = setTimeout(() => {
      this.setState({ isShow: false });
    }, duration || this.state.duration);
  };

  position = () => {
    const { position } = this.state;
    if (position === "top") return this.props.positionValue;
    if (position === "center") return height / 2 - RFPercentage(9);
    return height - this.props.positionValue - RFPercentage(10);
  };

  handleBar = () => {
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start();
  };

  pause = () => {
    this.setState({ oldDuration: this.state.duration, duration: 10000 });
    Animated.timing(this.state.barWidth).stop();
  };

  resume = () => {
    this.setState({ duration: this.state.oldDuration, oldDuration: 0 });
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start();
  };

  hideToast = () => {
    this.resetAll();
    this.setState({ isShow: false });
    this.isShow = false;
    if (!this.isShow && !this.state.isShow) return;
  };

  resetAll = () => {
    clearTimeout(this.timer);
  };

  render() {
    this.handleBar();
    const {
      animationIn,
      animationStyle,
      animationOut,
      backdropTransitionOutTiming,
      backdropTransitionInTiming,
      animationInTiming,
      animationOutTiming,
      backdropColor,
      backdropOpacity,
      hasBackdrop,
      width,
      height,
      style,
      theme,
    } = this.props;

    const {
      isShow,
      animationStyle: stateAnimationStyle,
      barColor,
      icon,
      text,
      barWidth,
    } = this.state;

    return (
      <Modal
        animationIn={
          animationIn || stateAnimationStyle[animationStyle].animationIn
        }
        animationOut={
          animationOut || stateAnimationStyle[animationStyle].animationOut
        }
        backdropTransitionOutTiming={backdropTransitionOutTiming}
        backdropTransitionInTiming={backdropTransitionInTiming}
        animationInTiming={animationInTiming}
        animationOutTiming={animationOutTiming}
        onTouchEnd={this.resume}
        onTouchStart={this.pause}
        swipeDirection={["up", "down", "left", "right"]}
        onSwipeComplete={this.hideToast}
        onModalHide={this.resetAll}
        isVisible={isShow}
        coverScreen={false}
        backdropColor={backdropColor}
        backdropOpacity={backdropOpacity}
        hasBackdrop={hasBackdrop}
        style={styles.modalContainer}
      >
        <View
          style={[
            styles.mainContainer,
            {
              width: "100%",
              height: 60,
              // backgroundColor: Colors[theme].back,
              top: 32,
              borderColor: AppColors.velvet,
              borderWidth: 1,
              borderRadius: 0,
              // borderBottomWidth: 4,
              ...style,
            },
          ]}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0.3, 0]}
            end={[1, 0.5]}
            style={{
              flex: 1,
              padding: 5,
              paddingRight: 20,
              borderRadius: 0,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={this.hideToast}
              activeOpacity={0.9}
              style={styles.hideButton}
            >
              <Ionicons
                name="ios-close-outline"
                size={32}
                color={Colors[theme].text}
              />
            </TouchableOpacity>
            <View style={styles.content}>
              <Ionicons
                name={icon}
                size={24}
                color={barColor}
                style={styles.iconWrapper}
              />
              <Text style={[styles.textStyle, { color: Colors[theme].text }]}>
                {text}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: barWidth, backgroundColor: barColor },
                ]}
              />
            </View>
          </LinearGradient>
        </View>
      </Modal>
    );
  }
}

ToastManager.defaultProps = defaultProps;

export default ToastManager;
