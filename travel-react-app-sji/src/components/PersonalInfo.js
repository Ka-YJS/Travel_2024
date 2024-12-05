import React, { useState } from "react";
import styled from "styled-components";
import Modal from 'react-modal';
import { Input } from "@mui/material";
import defaultImage from './defaultImage.png';  // 이미지 파일을 import로 불러옴
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

// 전체 페이지를 가운데로 배치하는 스타일
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;  // 수평 중앙 정렬
  align-items: center;      // 수직 중앙 정렬
  height: 100vh;            // 화면 높이를 100%로 설정
  margin: 0;                // 기본 여백 제거
`;

const Wrapper = styled.div`
  display: flex;            // Flexbox를 사용하여 이미지와 텍스트 나란히 배치
  align-items: center;      // 세로 중앙 정렬
  padding: 20px;
  gap : 20px;
`;

const PersonalContainer = styled.div`
  margin-left: 20px;         // 이미지와 텍스트 사이에 여백 추가
  color: black;              // 글자 색을 검정으로 설정 (필요시 변경 가능)
  font-size: 16px;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;        // 프로필 이미지를 원형으로 만들기
  cursor: pointer;          // 클릭 가능한 영역으로 처리
`;

const PopupWrapper = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);  // 그림자 효과 추가
`;

const CustomModal = styled(Modal)`
  position: fixed;  // 화면에 고정되도록 설정
  top: 50%;         // 화면 중앙에 수직 정렬
  left: 50%;        // 화면 중앙에 수평 정렬
  transform: translate(-50%, -50%);  // 정확한 중앙 정렬을 위한 변환
  z-index: 9999;    // 다른 콘텐츠보다 위에 표시
`;

const PersonalInfo = () => {
  const navigate = useNavigate(); // 로그아웃 후 페이지 이동을 위한 useNavigate 사용
  const [isOpen, setIsOpen] = useState(false); // 팝업 열림 상태
  const [currentPopup, setCurrentPopup] = useState(""); // 현재 열려 있는 팝업 유형 (닉네임 변경 또는 비밀번호 변경)

  const [userPassword, setUserPassword] = useState(""); // 현재 비밀번호
  const [newPassword, setNewPassword] = useState(""); // 새로운 비밀번호
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(""); // 새로운 비밀번호 확인
  const [userNickname, setUserNickname] = useState('길동');  // 기존 닉네임 값
  const [profileImage, setProfileImage] = useState(null); // 기본 프로필 사진 경로

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

  return (
    <PageWrapper>
      <Wrapper>
        <div>
          <ProfileImage 
            src={profileImage || defaultImage} // 기본 이미지나 프로필 이미지 표시
            alt="profile"
            onClick={() => document.getElementById("fileInput").click()} // 클릭 시 파일 선택 창 열기
          />
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }} // input을 숨김
            accept="image/*" // 이미지 파일만 선택 가능
            onChange={handleProfileImageChange}
          />
        </div>
        <PersonalContainer>
          <div>이름 : {user.userName}</div>
          <div>닉네임 : {user.userNickname}</div>
          <div>아이디 : {user.userId}</div>
          <button onClick={() => openPopup('password')}>비밀번호 변경</button>  {/* 비밀번호 변경 팝업 열기 */}
          <button onClick={() => openPopup('nickname')}>닉네임 변경</button>  {/* 닉네임 변경 팝업 열기 */}
          <button onClick={handleLogout}>로그아웃</button>  {/* 로그아웃 버튼 */}
        </PersonalContainer>
      </Wrapper>

      {/* Modal 컴포넌트 */}
      <CustomModal
        isOpen={isOpen}
        onRequestClose={closePopup} 
        contentLabel="Personal Information Popup"
      >
        {/* 닉네임 변경 팝업 */}
        {currentPopup === 'nickname' && (
          <PopupWrapper>
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
          </PopupWrapper>
        )}

        {/* 비밀번호 변경 팝업 */}
        {currentPopup === 'password' && (
          <PopupWrapper>
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
          </PopupWrapper>
        )}
      </CustomModal>
    </PageWrapper>
  );
};

export default PersonalInfo;
