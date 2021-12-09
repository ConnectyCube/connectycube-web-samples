import { Route } from "react-router";
import "./App.css";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";

function App() {
  return (
    <div className="wrapper">
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Register />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
    </div>
  );
}

export default App;
