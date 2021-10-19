import { Route } from "react-router";
import React, { useContext } from "react";
import "./App.scss";
import Conference from "./Components/Conference/Conference";
import Main from "./Components/Main/Main";
import CallContext from "./services/call-service";

function App(props) {
  const call = useContext(CallContext);
  return (
    <div className="wrapper">
      <header className="header" />
      <main className="main">
        <div className="page__main">
          <Route exact path="/">
            <Main call={call} />
          </Route>
          <Route path={`/join/`}>
            <Conference call={call} />
          </Route>
        </div>
      </main>
      <footer />
    </div>
  );
}

export default App;
