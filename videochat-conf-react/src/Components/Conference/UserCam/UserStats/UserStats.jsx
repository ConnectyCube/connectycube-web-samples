import React from "react";
import "./UserStats.scss";

const UserStats = (props) => {
  const { userId, micLevel, bitrate } = props;
  return (
    <div id={`user__stats-${userId}`} className="user__stats">
      <h4>
        {bitrate
          ? `Connection good 
		  ${bitrate}`
          : "Connection good"}
        <br />
        {micLevel ? `Micro level: ${micLevel}` : ``}
      </h4>
    </div>
  );
};

export default UserStats;
