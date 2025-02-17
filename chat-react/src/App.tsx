import { StrictMode, useLayoutEffect, useRef } from "react";
import { ChatProvider } from "@connectycube/use-chat";
import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Home from "./Components/Home/Home";
import ConnectyCube from "connectycube";
import { appConfig, credentials } from "./config";
import { isSessionExpired, tryReuseSession } from "./connectycube";

function ProtectedRoute({ element }: { element: JSX.Element }) {
  return isSessionExpired() ? <Navigate to="/login" replace /> : element;
}

function App() {
  const initialPath = isSessionExpired() ? "/login" : "/home";
  const isInited = useRef<boolean>(false);

  useLayoutEffect(() => {
    // use ref check to make it properly work with StrictMode
    if (!isInited.current) {
      ConnectyCube.init(credentials, appConfig);
      tryReuseSession();
      isInited.current = true;
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center bg-gray-800 text-black overflow-hidden absolute">
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
