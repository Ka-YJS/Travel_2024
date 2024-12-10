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
  const { profileImage, userNickName } = useContext(UserContext); // userNickName 가져오기
  const navigate = useNavigate();

  const iconComponents = [
    { id: "home", component: <SlHome />, route: "/main" },
    { id: "map", component: <IoMapOutline />, route: "/map" },
    { id: "post", component: <MdNoteAlt />, route: "/post" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    alert("로그아웃 되었습니다.");
    navigate('/login');
  };

  return (
    <header
      className="home-header"
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}
    >
      {/* 아이콘 영역 */}
      <div
        className="icon-container"
        style={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        {iconComponents.map((icon) => (
          <div
            key={icon.id}
            className="icon"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(icon.route)}
          >
            {icon.component}
          </div>
        ))}
      </div>

      {/* 프로필 영역 */}
      <div className="profile-container" style={{ position: "relative", marginLeft: "20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <img
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              cursor: "pointer",
              marginRight:"30px"
            }}
            src={profileImage || defaultImage}
            alt="profile"
            onClick={() => setIsProfileDropdownVisible(!isProfileDropdownVisible)}
          />
          <p style={{ textAlign: "center", marginRight: "30px" }}>{userNickName || "username"}</p>
        </div>
        {isProfileDropdownVisible && (
          <div
            className="profile_button"
            style={{
              width:isMyInfoVisible?"400px":"200px",
              position: "absolute",
              top: "100px",
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
              onClick={() => setIsMyInfoVisible(!isMyInfoVisible)}
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
