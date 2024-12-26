import React, { useState,useRef } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin,GoogleOAuthProvider } from '@react-oauth/google'; // 구글 로그인 라이브러리 import
import "../css/Strat.css";
import logo4 from '../image/logo4.png';
import {call} from "../api/ApiService";
import backgroundImage from "../image/back3.png"
import axios from "axios";

const Login = () => {
  const { user,setUser,setGoogleUser } = useContext(UserContext); // `user` 배열로부터 사용자 정보를 가져옴
  const [loginId, setLoginId] = useState(""); // 입력받은 ID 저장 useState
  const [loginPassword, setLoginPassword] = useState(""); // 입력받은 비밀번호 상태 useState
  const [popupContent, setPopupContent] = useState(""); // 팝업 내용
  const [isPopupVisible, setIsPopupVisible] = useState(false); // 팝업 표시 상태
  const navigate = useNavigate();
  
  const findUserIdRef = useRef("");
  const findUserNameRef = useRef("");
  const findUserPhoneNumberRef = useRef("");

  //회원가입 버튼
  const toSignup = () => {
    navigate('/Signup')
  };//회원가입 버튼 종료

  //ID 찾기 팝업창
  const handleFindId = () => {
    setPopupContent(
      <div>
        <h4>이메일(아이디) 찾기</h4>
        <div className="form-group">
          <label htmlFor="findUserName">이름</label>
          <input 
            id="findUserName" 
            name="findUserName" 
            placeholder="Name" 
            onChange={(e) => {findUserNameRef.current =e.target.value}}
          />
        </div>
        <div className="form-group">
          <label htmlFor="findUserPhoneNumber">전화번호</label>
          <input
            id="findUserPhoneNumber"
            name="findUserPhoneNumber"
            placeholder=" - 빼고 숫자만 입력하세요"
            onChange={(e) => {findUserPhoneNumberRef.current =e.target.value}}
          />
        </div>
        <div className="popup-buttons">
          <button onClick={handleFindIdConfirm}>확인</button>
          <button onClick={closePopup}>취소</button>
        </div>
      </div>
    );
    setIsPopupVisible(true);
  };//ID 찾기 팝업창 종료


  //ID 찾기 팝업창 확인 버튼
  const handleFindIdConfirm = async(event) => {

    event.preventDefault();

    console.log("findUserId"+findUserNameRef.current)
    console.log("findUserPhoneNumber"+findUserPhoneNumberRef.current)
    const userInfo = {
      userName: findUserNameRef.current,
      userPhoneNumber: findUserPhoneNumberRef.current
    };
    try {
      //ID찾기 call 메서드
      const response = await call("/travel/userFindId","POST",userInfo,user)

      if(response){
        console.log("ID찾기 call 메서드 response:"+response);
        alert(`ID는 ${response.userId} 입니다`);
      }   

    } catch (error) {
      console.error("ID찾기 실패:", error);
      alert("이름or전화번호 확인해주세요");
    }
  }//ID 찾기 팝업창 확인 버튼 종료


  
  //Password 찾기 팝업창
  const handleFindPassword = () => {
    setPopupContent(
      <div>
        <h4>Password 찾기</h4>
        <div className="form-group">
          <label htmlFor="findUserId">이메일(아이디)</label>
          <input 
            id="findUserId" 
            name="findUserId" 
            placeholder="example@email.com"  
            onChange={(e) => {findUserIdRef.current =e.target.value}}           
          />
        </div>
        <div className="form-group">
          <label htmlFor="findIdName">이름</label>
          <input 
            id="findIdName" 
            name="findIdName" 
            placeholder="Name"
            onChange={(e) => {findUserPhoneNumberRef.current =e.target.value}} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="findIdPhone">전화번호</label>
          <input
            id="findIdPhone"
            name="findIdPhone"
            placeholder=" - 빼고 숫자만 입력하세요"
            onChange={(e) => {findUserNameRef.current =e.target.value}}
          />
        </div>
        <div className="popup-buttons">
          <button onClick={handleFindPasswordConfirm}>확인</button>
          <button onClick={closePopup}>취소</button>
        </div>
      </div>
    );
    setIsPopupVisible(true);
  };//Password 찾기 팝업창 종료

  //Password 찾기 팝업창 확인 버튼
  const handleFindPasswordConfirm = () => {

  }//Password 찾기 팝업창 확인 버튼 종료

  // 팝업 닫기
  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupContent("");
  };  

  

  //로그인 버튼
  const handleLogin = async (event) => {

    event.preventDefault();

    const userProfile = {
      userId: loginId,
      userPassword: loginPassword
    };

    try {

      //로그인 call 메서드
      const response = await call("/travel/login","POST",userProfile,user)

      if(response){
        setUser(response);
        console.log("로그인 call 메서드 response:"+response);
        alert(`로그인 성공! 환영합니다, ${response.userNickName}님!`);
        navigate("/main")
      }
      
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };//로그인 버튼 종료


  //Google 로그인 성공 처리
  const handleGoogleSuccess = async (response) => {
    try {
      
      console.log('Google Login Success:', response.credential);
      const credential = response.credential      

      // JWT 디코딩하여 Google 사용자 정보 확인
      try {
        // Authorization 헤더에 Bearer 토큰 포함, payload는 본문에 전달
        const response = await axios.post('http://192.168.3.24:9090/travel/oauth2/google/callback', { credential },{
          headers: {
              'Authorization': `Bearer ${credential}` // Google 로그인 후 받은 credential
          }
        })

        console.log("백엔드 응답:", response.data);
        
        if (response.data) {          
          setGoogleUser(response.data);
          navigate("/signup")
        }

      } catch (backendError) {
        console.error("백엔드 통신 에러:", {
          상태: backendError.response?.status,
          메시지: backendError.message,
          데이터: backendError.response?.data
        });
        throw backendError;
      }
  
    } catch (error) {
      console.error("전체 로그인 프로세스 에러:", error);
      handleGoogleFailure(error);
    }
  };//Google 로그인 성공 처리 종료

  // Google 로그인 실패 처리
  const handleGoogleFailure = (error) => {
    console.error("Google login error details:", {
        error,
        response: error.response,
        message: error.message,
        status: error.response?.status
    });
    
    let errorMessage;
    
    if (!error) {
      errorMessage = "알 수 없는 오류가 발생했습니다.";
    } else if (error.error === "popup_closed_by_user") {
      errorMessage = "로그인 창이 닫혔습니다. 다시 시도해주세요.";
    } else if (error.error === "access_denied") {
      errorMessage = "구글 계정 접근이 거부되었습니다.";
    } else if (error.error === "immediate_failed") {
      errorMessage = "자동 로그인에 실패했습니다. 다시 시도해주세요.";
    } else if (error.response?.status === 401) {
      errorMessage = "인증에 실패했습니다. 다시 로그인해주세요.";
    } else if (error.response?.status === 500) {
      errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    } else if (error.details) {
      errorMessage = error.details;
    } else {
      errorMessage = "구글 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    alert(errorMessage);
    setLoginId("");
    setLoginPassword("");
  };

  const googleOAuthConfig = {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID  // 환경변수가 제대로 로드되는지 확인
  };



  return (
<div
  className="fullscreen-background"
  style={{ backgroundImage: `url(${backgroundImage})` }}
>
      <div className="container">
        <main>
          <form className="form" onSubmit={handleLogin}>
            <h3>::: 로그인 :::</h3>

            <div className="form-group">
              <label htmlFor="loginId">이메일(아이디)</label>
              <input
                id="loginId"
                name="loginId"
                value={loginId}
                placeholder="example@email.com"
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">비밀번호</label>
              <input
                id="loginPassword"
                name="loginPassword"
                type="password"
                value={loginPassword}
                placeholder="Password"
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            {/* ID 찾기 및 Password 찾기 텍스트 */}
            <div className="find-texts">
              <span className="find-text" onClick={handleFindId}>
                ID 찾기
              </span>
              <span className="divider">|</span>
              <span className="find-text" onClick={handleFindPassword}>
                Password 찾기
              </span>
            </div>

            {/* id찾기/password찾기 팝업 모달 */}
            {isPopupVisible && (
              <div className="popup">
                <div className="popup-content">
                  <span className="close-button" onClick={closePopup}>
                    &times;
                  </span>
                  <div>{popupContent}</div>
                </div>
              </div>
            )}

            <div className="submit-container">
              <input type="submit" value="로그인" className="submit" />
              <input type="button" value="회원가입" className="cancel" onClick={toSignup} />
            </div>

            <div>
              {/* Google OAuth */}
              <GoogleOAuthProvider clientId={googleOAuthConfig.clientId}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  useOneTap={false}
                  type="standard"
                  ux_mode="popup"
                  flow="implicit"
                  scope="email profile"
                  cookiePolicy={'single_host_origin'}
                />
              </GoogleOAuthProvider>
            </div>
          </form>
          
          <div >
            <img src={logo4} alt="Logo" className="logo-box" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
