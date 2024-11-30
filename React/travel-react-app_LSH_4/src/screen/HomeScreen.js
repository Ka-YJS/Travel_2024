import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../image/back.jpg"
import TopIcon from "../TopIcon/TopIcon";

function HomeScreen() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleStart = () => {
    navigate("/Login"); // 
  };

  return (
    <div
      className="home-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <TopIcon />   
      <button className="start-button" onClick={handleStart}>
        시작하기
      </button>
    </div>

  );
}

export default HomeScreen;