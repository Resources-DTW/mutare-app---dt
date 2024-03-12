import "./App.css";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import { Route, Routes } from "react-router-dom";
import Forget from "./screens/Forget";
import Protected from "./components/Protected";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Protected Component={Login} />} />
      <Route path="/signup" element={<Protected Component={SignUp} />} />
      <Route path="/forget" element={<Protected Component={Forget} />} />
      <Route path="/home" element={<Protected Component={Home} />} />
    </Routes>
  );
}

export default App;
