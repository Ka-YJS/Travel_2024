import React, { useState, useContext } from "react";
import Modal from 'react-modal';
import { Input } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import defaultImage from "../image/defaultImage.png";
import '../css/MyPage_per.css'; // CSS 파일 import
import { IoPencil } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";

Modal.setAppElement('#root');

const PersonalInfo = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPopup, setCurrentPopup] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [userNickname, setUserNickname] = useState('길동');
  const { user, setUser,profileImage, setProfileImage  } = useContext(UserContext);

  const openPopup = (type) => {
    setCurrentPopup(type);
    setIsOpen(true);
  };

  const closePopup = () => setIsOpen(false);

  //비밀번호변경
  const handleChangePassword = async () => {

    if (newPassword === newPasswordConfirm) {
      try {

        const userProfile = {
          userPassword: newPassword
        };
        console.log(`Bearer ${user.token}` )

        const response = await axios.patch(`http://localhost:9090/travel/userPasswordEdit/${user.id}`, userProfile, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user.token}` 
          },
          withCredentials: true
        });
        
        if(response.data){
          alert("비밀번호가 변경되었습니다.");
          closePopup();
        }
      } catch (err) {
        console.error('비밀번호변경 실패:', err);
      }
    } else {
      alert("새로운 비밀번호와 확인이 일치하지 않습니다.");
    }

  };

  const handleChangeNickname = () => {
    alert("닉네임이 변경되었습니다.");
    closePopup();
  };

  const handleProfileImageChange = async(e) => {

    const file = e.target.files[0];

    if (file) {

      // FormData 객체를 사용해 파일과 기타 데이터를 전송
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', user.token);
      
      formData.forEach((value, key) => {
        console.log(key, value);  // key는 'file' 또는 'token' 값이 출력됩니다.
      });

      try {
        // 백엔드에 프로필 사진을 업로드
        const response = await axios.patch(`http://localhost:9090/travel/userProfileImageEdit/${user.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`
          },
        });
        
        if(response.data){
          //성공적으로 업로드되면 사용자 정보 업데이트
          setUser(response.data);
        }

      } catch (err) {
        console.error('파일 업로드 실패:', err);
      }
    }//if문 종료

  };


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    alert("로그아웃 되었습니다.");
    navigate('/login');
  };

  const handlemypost = () => {
    navigate("/mypage/mypost")
  }

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
    <div className="PageWrapper">
      <div className="Wrapper">
        <div className="ProfileWrapper ">
          <img
            className="ProfileImage"
            src={profileImage}
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
            <button style={{backgroundColor:"transparent"}} type="button" onClick={() => setUser({userProfileImage:defaultImage})}>
            <FaRegTrashAlt />
            </button>
          </div>
        </div>

        <div className="PersonalContainer">
          <div>이름 : {user.userName}</div>
          <div>닉네임 : {user.userNickName}</div>
          <div>아이디 : {user.userId}</div>
          <button onClick={() => openPopup('password')}>비밀번호 변경</button>
          <button onClick={() => openPopup('nickname')}>닉네임 변경</button>
          <button onClick={handleLogout}>로그아웃</button>
          <button onClick={handlemypost}>내게시글보기</button>
          <div>
            <button onClick={handleDeleteAccount} style={{ backgroundColor: "red" }}>
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
        className="CustomModal"
        overlayClassName="Overlay"
      >
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
      </Modal>
    </div>
  );
};

export default PersonalInfo;
