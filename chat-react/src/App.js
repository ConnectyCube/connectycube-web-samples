import { Route } from "react-router";
import "./App.css";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import Home from "./Components/Home/Home";
import ChatContext from "./services/chat-service";

import React, { useContext } from "react";

function App() {
  const chat = useContext(ChatContext);
  debugger;
  return (
    <div className="wrapper">
      <Route exact path="/">
        <Login chat={chat} />
      </Route>
      <Route exact path="/signup">
        <SignUp chat={chat} />
      </Route>
      <Route exact path="/home">
        <Home chat={chat} />
      </Route>
    </div>
  );
}

export default App;
