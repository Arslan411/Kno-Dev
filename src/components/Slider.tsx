import React, { useState, useRef, useCallback } from "react";
import {
  PanResponder,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
  View,
} from "react-native";
import { Text } from "./Themed";
import { Colors } from "src/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";

interface SliderProps {
  childrenContainer?: ViewStyle;
  containerStyle?: ViewStyle;
  sliderElement?: React.ReactNode;
  text?: string;
  onEndReached?: () => void;
  disableSliding?: boolean;
  children?: React.ReactNode;
}

export const Slider: React.FC<SliderProps> = ({
  childrenContainer = {},
  containerStyle = {},
  sliderElement = (
    <View style={{ width: 50, height: 50, backgroundColor: "green" }} />
  ),
  text,
  onEndReached = () => {},
  disableSliding = false,
  children,
}) => {
  const [offsetX] = useState(new Animated.Value(-12));
  const [squareWidth, setSquareWidth] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const totalWidthRef = useRef(0);
  const canReachEndRef = useRef(true);

  const moveAnimationValue = useRef(new Animated.Value(0)).current;

  const resetBar = () => {
    Animated.timing(offsetX, {
      toValue: -12,
      useNativeDriver: true,
    }).start();
  };

  const onEndReachedCallback = useCallback(() => {
    if (canReachEndRef.current) {
      onEndReached();
      canReachEndRef.current = false;
      resetBar();
    }
  }, [onEndReached, resetBar]);

  useFocusEffect(
    React.useCallback(() => {
      resetBar();
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnimationValue, {
            toValue: 12,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnimationValue, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      if (!isInteracting) {
        animation.start();
      } else {
        animation.stop();
      }

      return () => {
        animation.stop();
      };
    }, [moveAnimationValue, isInteracting])
  );
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => !canReachEndRef.current,
    onMoveShouldSetPanResponderCapture: () => true,

    onPanResponderGrant: () => {
      canReachEndRef.current = true;
      setIsInteracting(true);
    },

    onPanResponderRelease: () => {
      resetBar();
      canReachEndRef.current = true;
      setIsInteracting(false);
    },
    onPanResponderMove: (_, gestureState) => {
      if (!disableSliding) {
        const margin = totalWidthRef.current - squareWidth * 1.025;
        if (gestureState.dx > 0 && gestureState.dx <= margin) {
          offsetX.setValue(gestureState.dx);
        } else if (gestureState.dx > margin) {
          onEndReachedCallback();
        }
      }
    },
    onPanResponderTerminationRequest: () => true,

    onShouldBlockNativeResponder: () => true,
  });

  const onAnimatedViewLayout = (event: LayoutChangeEvent) => {
    setSquareWidth(event.nativeEvent.layout.width);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    totalWidthRef.current = event.nativeEvent.layout.width;
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        containerStyle,
        {
          alignItems: "flex-start",
          justifyContent: "center",
          height: 48,
          marginLeft: "3%",
          width: "97%",
        },
      ]}
    >
      <Text
        textType="LBBold"
        style={{
          color: Colors.velvet,
          fontSize: RFPercentage(2),
          alignSelf: "center",
          position: "absolute",
          paddingLeft: 24,
        }}
      >
        {text}
      </Text>
      <Animated.View
        onLayout={onAnimatedViewLayout}
        style={{
          transform: [
            { translateX: Animated.add(moveAnimationValue, offsetX) },
          ],
        }}
        {...panResponder.panHandlers}
      >
        {sliderElement}
      </Animated.View>

      <View
        style={[
          {
            alignSelf: "center",
            position: "absolute",
            zIndex: -1,
            justifyContent: "center",
            alignItems: "center",
          },
          childrenContainer,
        ]}
      >
        {children}
      </View>
    </View>
  );
};
