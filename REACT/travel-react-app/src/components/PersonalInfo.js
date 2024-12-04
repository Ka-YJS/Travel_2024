import React, { useState, useContext } from "react";
import styled from "styled-components";
import Modal from 'react-modal';
import { Input } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import defaultImage from "../image/defaultImage.png"
import '../css/Mypage_per.css'

Modal.setAppElement('#root');

const PersonalInfo = () => {
  const navigate = useNavigate(); // 로그아웃 후 페이지 이동을 위한 useNavigate 사용
  const [isOpen, setIsOpen] = useState(false); // 팝업 열림 상태
  const [currentPopup, setCurrentPopup] = useState(""); // 현재 열려 있는 팝업 유형 (닉네임 변경 또는 비밀번호 변경)

  const [userPassword, setUserPassword] = useState(""); // 현재 비밀번호
  const [newPassword, setNewPassword] = useState(""); // 새로운 비밀번호
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(""); // 새로운 비밀번호 확인
  const [userNickname, setUserNickname] = useState('길동');  // 기존 닉네임 값
  const {profileImage, setProfileImage} = useContext(UserContext); // 기본 프로필 사진 경로

  //더미데이터
  const user = {
    userName: '홍길동',
    userNickname: userNickname,
    userId: 'hong123'
  };

  // 팝업 열기
  const openPopup = (type) => {
    setCurrentPopup(type);  // 닉네임 변경 또는 비밀번호 변경에 따른 팝업 구분
    setIsOpen(true);
  };

  // 팝업 닫기
  const closePopup = () => setIsOpen(false);

  // 비밀번호 변경 처리 함수
  const handleChangePassword = () => {
    if (newPassword === newPasswordConfirm) {
      alert("비밀번호가 변경되었습니다.");
      closePopup(); // 비밀번호가 일치하면 팝업 닫기
    } else {
      alert("새로운 비밀번호와 확인이 일치하지 않습니다.");
    }
  };

  // 닉네임 변경 처리 함수
  const handleChangeNickname = () => {
    alert("닉네임이 변경되었습니다.");
    closePopup(); // 닉네임 변경 후 팝업 닫기
  };

  // 프로필 이미지 변경 처리 함수
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]; // 사용자가 선택한 파일
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // 이미지 미리보기로 설정
      };
      reader.readAsDataURL(file); // 선택된 파일을 읽어 들임
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // 로컬스토리지에서 인증 토큰 삭제
    alert("로그아웃 되었습니다.");
    navigate('/login'); // 로그인 페이지로 이동
  };

  //내게시글로 넘어가기
  const handlemypost = () => {
    navigate("/mypage/mypost")
  }
  
  //프로필변경 숨겨진 버튼 클릭
  const handleButtonClick = () => {
    document.getElementById('fileInput').click();
  }

  // 계정 삭제 처리 함수 (예시로 작성)
  const handleDeleteAccount = () => {
      const confirmation = window.confirm("정말로 계정을 삭제하시겠습니까?");
      if (confirmation) {
        // 계정 삭제 로직을 여기에 추가 (서버에 요청 보내기 등)
        alert("계정이 삭제되었습니다.");
        navigate('/login'); // 계정 삭제 후 로그인 페이지로 이동
    }
  };

  return (
    <div className = "PageWrapper">
      <div className = "Wrapper">
        <div>
          <ProfileImage
            src={profileImage} // 기본 이미지나 프로필 이미지 표시
          /> 
          <div>
            <input
              type="file"
              id="fileInput"
              accept="image/*" // 이미지 파일만 선택 가능
              style={{ display: "none" }} // input을 숨김
              onChange={handleProfileImageChange} 
            />            
            <button 
              onClick={handleButtonClick}
            >
              프로필변경
            </button>
            
          </div>
            <button
              type="button"
              onClick={()=>setProfileImage(defaultImage)} 
            >
              프로필삭제
            </button> 
        </div>
        <div className="PersonalContainer">
          <div>이름 : {user.userName}</div>
          <div>닉네임 : {user.userNickname}</div>
          <div>아이디 : {user.userId}</div>
          <button onClick={() => openPopup('password')}>비밀번호 변경</button>  {/* 비밀번호 변경 팝업 열기 */}
          <button onClick={() => openPopup('nickname')}>닉네임 변경</button>  {/* 닉네임 변경 팝업 열기 */}
          <button onClick={handleLogout}>로그아웃</button>  {/* 로그아웃 버튼 */}
          <button onClick={handlemypost}>내게시글보기</button>
            <div>
              <button onClick={handleDeleteAccount} style={{backgroundColor : "red"}}>계정삭제</button>
            </div>
        </div>
      </div>
        

      {/* Modal 컴포넌트 */}
      <div className="CustomModal"
        isOpen={isOpen}
        onRequestClose={closePopup} 
        contentLabel="Personal Information Popup"
      >
        {/* 닉네임 변경 팝업 */}
        {currentPopup === 'nickname' && (
          <div className="PopupWrapper">
            <h2>닉네임 변경</h2>
            <div>
              <Input
                value={userNickname} 
                onChange={(e) => setUserNickname(e.target.value)} 
                placeholder="새로운 닉네임"
              />
            </div>
            <button onClick={handleChangeNickname}>변경</button>
            <button onClick={closePopup}>닫기</button>
          </div>
        )}

        {/* 비밀번호 변경 팝업 */}
        {currentPopup === 'password' && (
          <div className="PopupWrapper">
            <h2>비밀번호 변경</h2>
            <div>
              <label>현재 비밀번호</label>
              <Input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)} 
              />
            </div>
            <div>
              <label>새로운 비밀번호</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </div>
            <div>
              <label>새로운 비밀번호 확인</label>
              <Input
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)} 
              />
            </div>
            <button onClick={handleChangePassword}>변경</button>
            <button onClick={closePopup}>닫기</button>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default PersonalInfo;
