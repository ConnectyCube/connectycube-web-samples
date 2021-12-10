import React from "react";
import "./Chats.scss";
const Chats = () => {
  return (
    <div className="chat__block">
      <div className="user__info">
        <div className="user__img-container">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGTDrhiyiBfgngT17g1Fr0hSgSSnp3UD8cWfDN9ejIN9s3d3I-QaDpe6w8Yb_O2lqMgfE&usqp=CAU"
            alt=""
            className="user__img"
          />
        </div>
        <span>NAME</span>
      </div>
      <span className="last__mesage-time">14:30</span>
    </div>
  );
};

export default Chats;
