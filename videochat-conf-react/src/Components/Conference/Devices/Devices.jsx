import React from "react";
import "./Devices.scss";
const Devices = (props) => {
  console.log(props, "PROPS");
  debugger;

  const newDevice = (e) => {
    let deviceId = e.target.name;
    props.call.newCamera(deviceId);
  };

  return (
    <input
      type="button"
      onClick={newDevice}
      name={props.camInfo.deviceId}
      value={props.camInfo.label}
      className="cam__button"
    />
  );
};

export default Devices;
