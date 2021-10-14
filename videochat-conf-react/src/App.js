import { Route } from "react-router";
import React from "react";
import "./App.scss";
import Conference from "./Components/Conference/Conference";
import Main from "./Components/Main/Main";
import { useState } from "react";
import Call from "./services/call-service";
import Auth from "./services/auth-service";

function App(props) {
  const users = useState(Call.arr);

  debugger;
  return (
    <div className="wrapper">
      <header className="header" />
      <main className="main">
        <div className="page__main">
          <Route exact path="/">
            <Main />
          </Route>
          <Route path={`/join/`}>
            <Conference participants={users[0].length} />;
          </Route>
        </div>
      </main>
      <footer />
    </div>
  );
}

export default App;
