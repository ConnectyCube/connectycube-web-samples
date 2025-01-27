import { StrictMode } from "react";
import { ChatProvider } from "@connectycube/use-chat";
import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Home from "./Components/Home/Home";
import ConnectyCube from "connectycube";
import { appConfig, credentials } from "./config";
import { tryRestoreSession, isSessionExists } from "./connectycube";
import "./App.css";

// Init ConnectyCube SDK
ConnectyCube.init(credentials, appConfig);
tryRestoreSession();

function ProtectedRoute({ element }: { element: JSX.Element }) {
  return isSessionExists() ? element : <Navigate to="/login" replace />;
}

function App() {
  const initialPath = isSessionExists() ? "/home" : "/login";

  return (
    <div className="wrapper">
      <StrictMode>
        <ChatProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to={initialPath} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/home"
                element={<ProtectedRoute element={<Home />} />}
              />
              <Route
                path="/home/:id"
                element={<ProtectedRoute element={<Home />} />}
              />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </StrictMode>
    </div>
  );
}

export default App;
