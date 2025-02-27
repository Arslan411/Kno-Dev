import { Path, Svg } from "react-native-svg";

const IconShare = ({ fill }: { fill: string }) => {
  return (
    <Svg height="24" viewBox="0 96 960 960" width="24" fill={fill}>
      <Path d="M240 1016q-33 0-56.5-23.5T160 936V496q0-33 23.5-56.5T240 416h120v80H240v440h480V496H600v-80h120q33 0 56.5 23.5T800 496v440q0 33-23.5 56.5T720 1016H240Zm200-280V289l-64 64-56-57 160-160 160 160-56 57-64-64v447h-80Z" />
    </Svg>
  );
};

export default IconShare;
