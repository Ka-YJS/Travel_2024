import React, { useState, useContext } from "react";
import Modal from 'react-modal';
import { Input } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import defaultImage from "../image/defaultImage.png";
import '../css/MyPage.css';
import { IoPencil } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";

Modal.setAppElement('#root');

const PersonalInfo = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPopup, setCurrentPopup] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [userNickname, setUserNickname] = useState('길동');
  const { profileImage, setProfileImage } = useContext(UserContext);

  const user = {
    userName: '홍길동',
    userNickname: userNickname,
    userId: 'hong123'
  };

  const openPopup = (type) => {
    setCurrentPopup(type);
    setIsOpen(true);
  };

  const closePopup = () => setIsOpen(false);

  const handleChangePassword = () => {
    if (newPassword === newPasswordConfirm) {
      alert("비밀번호가 변경되었습니다.");
      closePopup();
    } else {
      alert("새로운 비밀번호와 확인이 일치하지 않습니다.");
    }
  };

  const handleChangeNickname = () => {
    alert("닉네임이 변경되었습니다.");
    closePopup();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('fileInput').click();
  }

  const handleDeleteAccount = () => {
    const confirmation = window.confirm("정말로 계정을 삭제하시겠습니까?");
    if (confirmation) {
      alert("계정이 삭제되었습니다.");
      navigate('/login');
    }
  };

  return (
    <div className="page_wrapper">
      <div className="wrapper">
        <div className="profile_wrapper ">
          <img
            className="profile_image"
            src={profileImage || defaultImage}
            alt="profile"
          />
          <div style={{display:"flex" }}>
            <div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfileImageChange}
              />
              <button style={{backgroundColor:"transparent"}} type="button" onClick={handleButtonClick}><IoPencil /></button>
            </div>
            <button style={{backgroundColor:"transparent"}} type="button" onClick={() => setProfileImage(defaultImage)}>
            <FaRegTrashAlt />
            </button>
          </div>
        </div>

        <div className="personal_container">
          <div className="user-info">
            <div className="user-info-item">이름 : {user.userName}</div>
            <div className="user-info-item">닉네임 : {user.userNickname}</div>
            <div className="user-info-item">아이디 : {user.userId}</div>
          </div>

          <div className="button-container">
            <button className="custom-button" onClick={() => openPopup('nickname')}>닉네임 변경</button>
          </div>
          <div className="button-container">
            <button className="custom-button" onClick={() => openPopup('password')}>비밀번호 변경</button>
          </div>
          <div>
            <button onClick={handleDeleteAccount} className="delete-button">
              계정삭제
            </button>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closePopup}
        contentLabel="Personal Information Popup"
        className="custom_modal"
        overlayClassName="overlay"
      >
        {currentPopup === 'nickname' && (
          <div className="popup_wrapper">
            <h2>닉네임 변경</h2>
            <div>
              <Input
                value={userNickname}
                onChange={(e) => setUserNickname(e.target.value)}
                placeholder="새로운 닉네임"
              />
            </div>
            <button onClick={handleChangeNickname} style={{marginRight:"5px"}}>변경</button>
            <button onClick={closePopup}>닫기</button>
          </div>
        )}

        {currentPopup === 'password' && (
          <div className="popup_wrapper">
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
            <button onClick={handleChangePassword} style={{marginRight:"5px"}}>변경</button>
            <button onClick={closePopup}>닫기</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PersonalInfo;
