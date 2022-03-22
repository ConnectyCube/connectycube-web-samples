import React from "react";
import "./UserStats.scss";
import { isiOS, detectBrowser } from "../../../../services/heplers";

const UserStats = (props) => {
  const { userId, micLevel, bitrate, connectionStatus } = props;
  return (
    <div id={`user__stats-${userId}`} className="user__stats">
      <h4>
        {bitrate
          ? `Connection ${connectionStatus} 
		  ${bitrate}`
          : "Connection good"}
        <br />
        {micLevel && (detectBrowser() !== "Safari" || !isiOS())
          ? `Micro level: ${micLevel}`
          : ``}
      </h4>
    </div>
  );
};

export default UserStats;
