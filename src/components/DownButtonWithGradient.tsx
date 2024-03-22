import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { StackNavigation } from "src/types/NavigationTypes";
import { Icon } from "./Themed";

const DownButtonWithGradient = ({
  onPress,
  mv,
  name,
}: {
  onPress?: () => void;
  mv?: number;
  name?: any;
}) => {
  const navigation = useNavigation<StackNavigation>();
  return (
    <Pressable
      style={{
        marginVertical: mv ? mv : 16,
        height: 35,
        width: 35,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.velvet,
        borderBottomWidth: 1,
      }}
      onPress={onPress ? onPress : () => navigation.goBack()}
    >
      <LinearGradient
        colors={gradients.primary}
        start={[0, 0.3]}
        end={[0, 1]}
        style={{
          flex: 1,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} name={name} color={Colors.velvet} />
      </LinearGradient>
    </Pressable>
  );
};

export default DownButtonWithGradient;
