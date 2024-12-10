import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../image/back.jpg"

function HomeScreen() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleStart = () => {
    navigate("/Login"); // 
  };

  return (
    <div
      className="home-screen"
      style={{
        position: "relative",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <button className="start-button" onClick={handleStart}
      style={{position: "absolute",
        transform: "translate(-50%, -50%)",
      }}>
        시작하기
      </button>
    </div>

  );
}

export default HomeScreen;