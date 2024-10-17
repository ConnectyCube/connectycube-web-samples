import React from "react";
import { useEffect } from "react";
import { getTime } from "../../../../services/helpers";
import { TiGroup } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router";
import "./Chats.scss";

const Chats = (props) => {
  const chatRef = React.createRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, setDialog, chosenDialog, dialogs } = props;

  useEffect(() => {
    try {
      if (userInfo._id === chosenDialog._id) {
        chatRef.current.classList.add("chosen");
      } else {
        chatRef.current.classList.remove("chosen");
      }
    } catch {}
  }, [chosenDialog, dialogs]);

  useEffect(() => {
    if (location.state === userInfo._id && !chosenDialog) {
      setDialog(userInfo);
    }
  }, []);

  const retrieveChat = () => {
    navigate(`/home/${userInfo._id}`);
    localStorage.setItem("chosenDialogId", userInfo._id);
    setDialog(userInfo);
  };

  return (
    <div className="chat__block" onClick={retrieveChat} ref={chatRef}>
      <div className="user__info-chats">
        <div className="user__img-container">
          {userInfo.photo && (
            <img alt="" className="user__img" src={userInfo.photo} />
          )}
          {!userInfo.photo && (
            <div id="background" className="user__no-img">
              <span className="name">{userInfo.name.slice(0, 2)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="user__info-main">
        <div className="group__name-container">
          {userInfo.type === 2 && (
            <TiGroup className="group__img" size={26} color="grey" />
          )}
          <p className="chat__username">{userInfo.name}</p>
        </div>

        <small className="last__message">
          {userInfo.last_message
            ? userInfo.last_message_user_id === parseInt(localStorage.userId)
              ? "me: " + userInfo.last_message
              : userInfo.name + " : " + userInfo.last_message
            : "No messages yet"}
        </small>
        <small>
          {userInfo.last_message
            ? getTime(userInfo.last_message_date_sent)
            : getTime(userInfo.created_at)}
        </small>
      </div>
      {userInfo.unread_messages_count > 0 && (
        <span className="not__read">{userInfo.unread_messages_count}</span>
      )}
    </div>
  );
};

export default Chats;
