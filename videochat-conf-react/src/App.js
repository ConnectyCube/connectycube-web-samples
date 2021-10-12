import { Route } from "react-router";
import React from "react";
import "./App.scss";
import Conference from "./Components/Conference/Conference";
import Main from "./Components/Main/Main";
import ReactContext from "./redux/state";

function App(props) {
  return (
    <div className="wrapper">
      <header className="header" />
      <main className="main">
        <div className="page__main">
          <Route exact path="/">
            <Main />
          </Route>
          <Route path={`/join/`}>
            <ReactContext.Consumer>
              {(value) => {
                return <Conference participants={value} />;
              }}
            </ReactContext.Consumer>
          </Route>
        </div>
      </main>
      <footer />
    </div>
  );
}

export default App;
