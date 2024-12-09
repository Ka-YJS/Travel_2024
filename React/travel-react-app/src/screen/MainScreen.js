import React, { useContext,useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import "../App.css";
import TopIcon from "../TopIcon/TopIcon";
import { UserContext } from "../context/UserContext";

function MainScreen() {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용
  const {user} = useContext(UserContext)
  console.log(user)
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setNickname(`여행${randomNumber}`);
  }, []);

  // 기록 시작하기 버튼 클릭 시 실행되는 함수
  const handleStartRecord = () => {
    navigate("/map"); // "/record" 경로로 이동
  };

  // 내 게시물 보기 버튼 클릭 시 실행되는 함수
  const handleViewPosts = () => {
    navigate("/Mypage/myPost"); // "/posts" 경로로 이동
  };

  return (
    <div className="main-screen">
      <TopIcon />
      <div className="content">
        <h1>{user.userNickName}님 환영합니다.</h1>
        <div className="button-row">
          <button className="main-button" onClick={handleStartRecord}>
            기록 시작하기
          </button>
          <button className="main-button" onClick={handleViewPosts}>
            내 게시물 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainScreen;