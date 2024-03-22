import { LinearGradient } from "expo-linear-gradient";
import { View, Pressable } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Icon, Text } from "../Themed";
import { QuestionType } from "src/screens/FaqScreen";
import React, { useEffect } from "react";

interface FaqListProps {
  item: QuestionType;
  index: number;
  selectedQuestionIndex: number | null;
  onToggle: (index: number) => void;
  setSelectedQuestionIndex: (index: number | null) => void;
}

const FaqList: React.FC<FaqListProps> = ({
  item,
  index,
  selectedQuestionIndex,
  onToggle,
  setSelectedQuestionIndex,
}) => {
  const isOpen = selectedQuestionIndex === index;
  const toggleQuestion = () => {
    onToggle(index);
    if (isOpen) {
      setSelectedQuestionIndex(null);
    }
  };

  return (
    <Pressable
      style={{
        marginTop: 5,
        marginVertical: 5,
        marginHorizontal: 32,
        position: "relative",
      }}
      onPress={toggleQuestion}
    >
      {isOpen ? (
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderBottomWidth: 4,
            justifyContent: "center",
            borderColor: Colors.velvet,
            borderRadius: 18,
            position: "relative",
            overflow: "visible",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -2,
              left: -2,
              height: 36,
              width: 36,
              elevation: 1,
              borderColor: Colors.velvet,
              borderRadius: 18,
              zIndex: 1,
            }}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0]}
              end={[1, 1]}
              style={{
                flex: 1,
                borderWidth: 1,
                borderRadius: 18,
                borderColor: Colors.velvet,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isOpen && (
                <Icon name="chevron-down" size={20} color={Colors.velvet} />
              )}
            </LinearGradient>
          </View>
          <LinearGradient
            colors={gradients.primary}
            start={[0, 0.3]}
            end={[0, 1]}
            style={{
              flex: 1,
              borderRadius: 18,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: 16,
              elevation: 0,
              overflow: "hidden",
            }}
          >
            <Text
              textType="LBBold"
              style={{
                fontSize: 14,
                color: Colors.velvet,
                marginVertical: 8,
                marginHorizontal: 20,
                textAlign: "center",
              }}
            >
              {item.Question}
            </Text>
            <Text
              textType="regular"
              style={{
                fontSize: 14,
                color: Colors.velvet,
              }}
            >
              {item.Answer}
            </Text>
          </LinearGradient>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
              borderColor: Colors.velvet,
              borderRadius: 38,
              opacity: selectedQuestionIndex === null ? 1 : 0.5,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={gradients.primary}
              start={[0, 0.3]}
              end={[0, 1]}
              style={{
                flex: 1,
                height: 38,
                borderRadius: 30,
                flexDirection: "row",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  height: 38,
                  width: 38,
                  // marginTop: 2,
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  // borderEndWidth: 1,
                  borderColor: Colors.velvet,
                  borderRadius: 140,
                }}
              >
                <LinearGradient
                  colors={gradients.primary}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{
                    flex: 1,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!isOpen && (
                    <Icon
                      name="chevron-right"
                      size={20}
                      color={Colors.velvet}
                    />
                  )}
                </LinearGradient>
              </View>
            </LinearGradient>
            <Text
              textType="LBBold"
              style={{
                fontSize: 10.6,
                position: "absolute",
                marginHorizontal: 48,
                alignSelf: "center",
                textAlign: "center",
                color: Colors.velvet,
              }}
            >
              {item.Question}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default FaqList;
