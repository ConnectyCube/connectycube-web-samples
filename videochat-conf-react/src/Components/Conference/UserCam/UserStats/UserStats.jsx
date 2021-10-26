import React from "react";
import "./UserStats.scss";

const UserStats = (props) => {
  return (
    <div id={`user__stats-${props.userId}`} className="user__stats">
      <h4>
        {props.bitrate
          ? `Connection good
		  ${props.bitrate}`
          : "Connection good"}
        <br />
        {props.micLevel ? `Micro level: ${props.micLevel}` : ``}
      </h4>
      
    </div>
  );
};

export default UserStats;
