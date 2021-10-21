import React from "react";
import "./Devices.scss";
const Devices = (props) => {
  return (
    <input
      type="button"
      onClick={props.onClick}
      name={props.camInfo.deviceId}
      value={props.camInfo.label}
      className="cam__button"
    />
  );
};

export default Devices;
