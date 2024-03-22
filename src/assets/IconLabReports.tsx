import { Path, Svg } from "react-native-svg";

const IconLabReports = ({ fill }: { fill: string }) => {
  return (
    <Svg height="24" viewBox="0 96 960 960" width="24" fill={fill}>
      <Path d="M320 576v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110V256H240v400Zm0 240h442L573 753q-6-8-14.5-12.5T540 736H240v160Zm480 80H240q-33 0-56.5-23.5T160 896V256q0-33 23.5-56.5T240 176h480q33 0 56.5 23.5T800 256v640q0 33-23.5 56.5T720 976Zm-480-80V256v640Zm0-160v-80 80Z" />
    </Svg>
  );
};

export default IconLabReports;
