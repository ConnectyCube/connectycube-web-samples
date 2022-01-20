import React from "react";
import "./UserInGroup.scss";

const UserInGroup = (props) => {
  const { user } = props;
  return (
    <div className="user__in-group group-list">
		 {user.avatar?<img className="group-list__avatar" src={`${user.avatar}`} alt="User Avatar" />:<img className="group-list__avatar" src="https://mpng.subpng.com/20180511/uoq/kisspng-avatar-youtube-lasse-kongo-5af531598fe705.6777672315260183935894.jpg" alt="no avatar"/>}
      
      <p className="group-list__username">{user.full_name}</p>
    </div>
  );
};

export default UserInGroup;
