import React from "react";
import "./Devices.scss";
const Devices = (props) => {
  const { onClick, camInfo } = props;
  return (
    <input
      type="button"
      onClick={onClick}
      name={camInfo.deviceId}
      value={camInfo.label}
      className="cam__button"
    />
  );
};

export default Devices;
