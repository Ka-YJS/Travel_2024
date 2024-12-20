import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../image/back.png"
import Logo from "./Logo";

function HomeScreen() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleStart = () => {
    navigate("/Login"); // 
  };

  return (
    <div    
      style={{
        position: "relative",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <Logo/>
      <div>
        <button 
          onClick={handleStart}
          style={{
            position: "absolute",
            top: "50%", // 수직 중앙
            left: "50%", // 수평 중앙
            transform: "translate(-50%, -50%)", // 버튼 크기 기준으로 정확히 중앙 정렬
            padding: "20px 40px", // 버튼 크기 증가 (패딩)
            fontSize: "24px", // 글씨 크기
            backgroundColor: "#4CAF50", // 버튼 배경색 (초록색)
            color: "white", // 글자 색
            border: "none", // 테두리 없앰
            borderRadius: "8px", // 둥근 모서리
            cursor: "pointer", // 커서 모양을 손 모양으로
            fontWeight: "bold", // 글씨를 두껍게
            transition: "all 0.3s ease", // 호버 효과 부드럽게
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f39c12"; // 호버 시 색 변화
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ff6f61"; // 원래 색으로 돌아오기
          }}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;