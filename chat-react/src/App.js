import React, { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import Home from "./Components/Home/Home";
import { ChatProvider } from "@connectycube/use-chat";
import "./App.css";

function App() {
  const initialPath = localStorage.token ? "/home" : "/login";

  return (
    <div className="wrapper">
      <StrictMode>
        <ChatProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to={initialPath} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<Home />} />
              <Route path="/home/:id" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </StrictMode>
    </div>
  );
}

export default App;
