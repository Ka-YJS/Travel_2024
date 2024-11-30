import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screen/HomeScreen";
import MainScreen from "./screen/MainScreen";
import Login from "./Strat/Login";
import Signup from "./Strat/SignUp";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/main" element={<MainScreen />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </Router>
    
  );
}

export default App;