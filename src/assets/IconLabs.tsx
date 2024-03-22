import { Path, Svg } from "react-native-svg";

const IconLabs = ({
  type,
  fill,
}: {
  type: "filled" | "outlined";
  fill: string;
}) => {
  if (type === "filled") {
    return (
      <Svg height="24" viewBox="0 96 960 960" width="24" fill={fill}>
        <Path d="M480 976q-83 0-141.5-58.5T280 776V416q-33 0-56.5-23.5T200 336v-80q0-33 23.5-56.5T280 176h400q33 0 56.5 23.5T760 256v80q0 33-23.5 56.5T680 416v360q0 83-58.5 141.5T480 976Zm0-80q39 0 70-22.5t43-57.5H480v-80h120v-40H480v-80h120v-40H480v-80h120v-80H360v360q0 50 35 85t85 35Z" />
      </Svg>
    );
  } else {
    return (
      <Svg height="24" viewBox="0 96 960 960" width="24" fill={fill}>
        <Path d="M480 976q-83 0-141.5-58.5T280 776V416q-33 0-56.5-23.5T200 336v-80q0-33 23.5-56.5T280 176h400q33 0 56.5 23.5T760 256v80q0 33-23.5 56.5T680 416v360q0 83-58.5 141.5T480 976ZM280 336h400v-80H280v80Zm200 560q39 0 70-22.5t43-57.5H480v-80h120v-40H480v-80h120v-40H480v-80h120v-80H360v360q0 50 35 85t85 35ZM280 336v-80 80Z" />
      </Svg>
    );
  }
};

export default IconLabs;
