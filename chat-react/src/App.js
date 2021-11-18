import { Route } from "react-router";
import "./App.css";
import Login from "./Components/Login/Login";

function App() {
  return (
    <div className="wrapper">
      <Route path="">
        <Login />
      </Route>
    </div>
  );
}

export default App;
