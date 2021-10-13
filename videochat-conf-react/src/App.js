import { Route } from "react-router";
import React from "react";
import "./App.scss";
import Conference from "./Components/Conference/Conference";
import Main from "./Components/Main/Main";
import ReactContext from "./redux/store";
import { useState } from "react";

function App(props) {
  const [participants, setParticipants] = useState(1);
  const value = { participants, setParticipants };
  return (
    <ReactContext.Provider value={value}>
      <div className="wrapper">
        <header className="header" />
        <main className="main">
			  {console.log(value)}
          <div className="page__main">
            <Route exact path="/">
              <Main />
            </Route>
            <Route path={`/join/`}>
              <ReactContext.Consumer>
                {(value) => {
						 console.log(value)
                  return <Conference participants={1} />;
                }}
              </ReactContext.Consumer>
            </Route>
          </div>
        </main>
        <footer />
      </div>
    </ReactContext.Provider>
  );
}

export default App;
