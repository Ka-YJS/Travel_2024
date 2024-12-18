import React, { useState, useContext } from "react";
import { SlHome } from "react-icons/sl";
import { IoMapOutline } from "react-icons/io5";
import { MdNoteAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // UserContext import
import { Collapse } from "react-bootstrap";
import PersonalInfo from "../pages/PersonalInfo"; // PersonalInfo 컴포넌트 import
import "../css/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultImage from '../image/defaultImage.png';

const TopIcon = () => {
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] = useState(false);
  const [isMyInfoVisible, setIsMyInfoVisible] = useState(false); // Collapse 상태 관리
  const { user } = useContext(UserContext); // userNickName 가져오기
  const navigate = useNavigate();

  const iconComponents = [
    { id: "home", component: <SlHome size={30} />, route: "/main", label: "Home"},
    { id: "map", component: <IoMapOutline size={30} />, route: "/map",label: "Map" },
    { id: "post", component: <MdNoteAlt size={35} />, route: "/post",label: "Post" },
  ];

  //로그아웃 버튼
  const handleLogout = () => {
    localStorage.clear();
    console.log("로그아웃:"+user)
    console.log("로그아웃:"+user.userid)
    alert("로그아웃 되었습니다.");
    navigate('/login');
  };

  return (
    <header
      className="home-header"
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}
    >
      {/* 아이콘 영역 */}
      <div
        className="icon-container"
        style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}
      >
        {iconComponents.map((icon) => (
          <div
            key={icon.id}
            className="icon"
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative"
            }}
            onClick={() => navigate(icon.route)}
          >
            {icon.component}
            {/* 텍스트 부분 */}
            <span className="tooltip" style={{fontSize:"16px"}} >
              {icon.label}
            </span>
          </div>
        ))}
      </div>

      {/* 프로필 영역 */}
      <div className="profile-container" style={{ position: "relative"}}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
            marginRight:"20px",
            width: "100px", // 고정 너비 설정
          }}
        >
          <img
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              cursor: "pointer"
            }}
            src={user.userProfileImage?`http://localhost:9090${user.userProfileImage}`: defaultImage}
            alt="profile"
            onClick={() => {
              if(isProfileDropdownVisible){
                setIsMyInfoVisible(false)
              }
              setIsProfileDropdownVisible(!isProfileDropdownVisible)
            
            }}
          />
          <div
            style={{
              width: "100px", // 컨테이너 너비 고정
              overflow: "hidden", // 넘치는 텍스트 숨기기
              whiteSpace: "nowrap", // 텍스트를 한 줄로 유지
              position: "relative", // 내부 요소에 대한 위치 기준
            }}
          >
            <p
              style={{
                display: "inline-block", // 텍스트가 슬라이드될 수 있도록 인라인 블록 설정
                animation: "slide 15s linear infinite", // 슬라이드 애니메이션
                fontSize:"20px",
                color:"#42a5f5"
              }}
              className="sliding-text"
            >
              시골쥐 {user.userNickName || "시골쥐"}님
            </p>
          </div>
        </div>
        {isProfileDropdownVisible && (
          <div
            className="profile_button"
            style={{
              width:isMyInfoVisible?"400px":"200px",
              position: "absolute",
              top: "120px",
              right: "0",
              backgroundColor: "#fff",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              zIndex: 10,
            }}
          >
            <button
              style={{
                margin: "5px",
                padding: "10px",
                backgroundColor: "#008cba",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() =>setIsMyInfoVisible(!isMyInfoVisible)}
            >
              My Info
            </button>
            <Collapse in={isMyInfoVisible}>
              <div style={{ height: 'auto' }}>
                <PersonalInfo /> {/* PersonalInfo 컴포넌트를 보이도록 렌더링 */}
              </div>
            </Collapse>
            <button
              style={{
                margin: "5px",
                padding: "10px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/mypage/mypost")}
            >
              My post
            </button>
            <button
              style={{
                margin: "5px",
                padding: "10px",
                backgroundColor: "rgb(212, 35, 35)",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopIcon;
