/* eslint-disable no-undef */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import  { CallProvider } from "./services/call-service";

export const rerenderTree = () => {
  ReactDOM.render(
    <BrowserRouter>
      <CallProvider>
        <App />
      </CallProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );
};
rerenderTree()
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
