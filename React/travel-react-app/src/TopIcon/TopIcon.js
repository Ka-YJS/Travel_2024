import React, {useState, useContext } from "react";
import { SlHome } from "react-icons/sl";
import { IoMapOutline } from "react-icons/io5";
import { BsFillPostageHeartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import styled from "styled-components";
import "../App.css";
import defaultImage from '../image/defaultImage.png'

const TopIcon = () => {

  const [logo, setLogo] = useState(null);
  const [isbutton,setIsbutton] = useState(false);

  const {user} = useContext(UserContext);

  //로그인 여부
  const isLoggedIn = !!user.userId;

  // 프로필 이미지 결정 로직
  const profileImage = user.userProfileImage ? user.userProfileImage : defaultImage;


  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };
  const navigate = useNavigate();

  const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;        // 프로필 이미지를 원형으로 만들기
  cursor: pointer;          // 클릭 가능한 영역으로 처리
`;

  const iconComponents = [
    { id: "home", component: <SlHome />, route: "/" },
    { id: "map", component: <IoMapOutline />, route: "/map" },
    { id: "post", component: <BsFillPostageHeartFill />, route: "/post" },
  ];

  return(    
    <header className="home-header">
      <div className="logo-container">
        {logo ? (
          <img src={logo} alt="Logo" className="logo" />
        ) : (
          <label className="file-input">
            로고 선택
            <input type="file" accept="image/*" onChange={handleLogoChange} />
          </label>
        )}
      </div>
      <div className="icon-container">
        {iconComponents.map((icon) => (
          <div 
            key={icon.id}
            className="icon"
            onClick={() => navigate(icon.route)}
          >
            {icon.component}
          </div>
        ))}
        <div style={{width:"130px",height:"100px",justifyItems:"center",alignItems:"center",margin:"5px"}}>
          {isLoggedIn ? (
            <ProfileImage
              src={profileImage} // 업로드된 이미지가 없으면 기본 이미지
              alt="profile"
              onClick={()=>setIsbutton(!isbutton)}
            />
          ) : (
            <ProfileImage
              src={defaultImage} //로그인안되어있으면 기본 이미지
              alt="profile"
              onClick={()=>setIsbutton(!isbutton)}
            />
          )}
          <p>username</p>
          {isbutton&&(
            <div
              style={{
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                padding: "10px",
                borderRadius: "5px",
                display: "flex", // Flexbox 사용
                flexDirection: "column", // 세로 방향 정렬
                gap: "10px", // 버튼 간격 추가
              }}
            >
              <button 
                style={{ 
                  margin: "5px", 
                  padding: "10px", 
                  backgroundColor: "#007bff", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "5px" 
                }} 
                onClick={()=>(navigate("/mypage/personalInfo"))}
              >
                내 정보
              </button>
              <button
                style={{ 
                  margin: "5px", 
                  padding: "10px", 
                  backgroundColor: "#28a745", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "5px" 
                }}
                onClick={()=>(navigate("/mypage/mypost"))}
              >
                My게시글
              </button>
            </div>
          )}
        </div>
      </div>  
    </header>
  )
}

export default TopIcon;