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
import defaultImage from '../image/defaultImage.png'

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
    <header className="home-header">
      <div className="icon-container"
      style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection:"row"}}
      >
        <div
          style={{
            width: "auto",
            height: "100px",
            justifyItems: "center",
            alignItems: "center",
            margin: "5px",
          }}
        >
          <img
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            src={profileImage || defaultImage}
            alt="profile"
            onClick={() => setIsProfileDropdownVisible(!isProfileDropdownVisible)}
          />
          <p>{userNickName || "username"}</p> {/* userNickName 표시 */}
          {isProfileDropdownVisible && (
            <div className="profile_button">
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
              <div style={{ margin: 0, padding: 0 }}>
              {/* PersonalInfo 컴포넌트를 조건부 렌더링 */}
              <Collapse in={isMyInfoVisible}>
                <div>
                  <PersonalInfo /> {/* PersonalInfo 컴포넌트를 보이도록 렌더링 */}
                </div>
              </Collapse>
              </div>
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
        {iconComponents.map((icon) => (
          <div
            key={icon.id}
            className="icon"
            onClick={() => navigate(icon.route)}
          >
            {icon.component}
          </div>
        ))}
      </div>
    </header>
  );
};

export default TopIcon;
