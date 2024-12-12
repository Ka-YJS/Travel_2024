import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from 'react-google-login'; // 구글 로그인 라이브러리 import
import  KakaoLogin  from 'react-kakao-login'; // 카카오 로그인 라이브러리 import
import "../css/Strat.css";
import logo2 from '../image/logo2.JPG';
import {call} from "../api/ApiService"

const Login = () => {
  const { user,setUser } = useContext(UserContext); // `user` 배열로부터 사용자 정보를 가져옴
  const [loginId, setLoginId] = useState(""); // 로그인 ID 상태
  const [loginPassword, setLoginPassword] = useState(""); // 로그인 비밀번호 상태
  const navigate = useNavigate();

  const toSignup = () => {
    navigate('/Signup')
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
    

  };
  //------------연동 주석처리------------------
  // // Google login callback
  // const handleGoogleSuccess = (response) => {
  //   console.log('구글 로그인 성공', response);
  //   // response.profileObj 또는 response.tokenId로 사용자 정보 처리
  //   navigate("/main");
  // };

  // const handleGoogleFailure = (error) => {
  //   console.log('구글 로그인 실패', error);
  //   alert('구글 로그인 실패');
  // };

  // // Kakao login callback
  // const handleKakaoSuccess = (response) => {
  //   console.log('카카오 로그인 성공', response);
  //   // response.profile 또는 response.token으로 사용자 정보 처리
  //   navigate("/main");
  // };

  // const handleKakaoFailure = (error) => {
  //   console.log('카카오 로그인 실패', error);
  //   alert('카카오 로그인 실패');
  // };

  return (
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
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <div className="submit-container">
            <input type="submit" value="로그인" className="submit" />
            <input type="button" value="회원가입" className="cancel" onClick={toSignup} />
          </div>

          <div>
            {/* Google Login Button */}
            {/* <div className="google_button">
              <GoogleLogin
                clientId="YOUR_GOOGLE_CLIENT_ID" // 구글 API 클라이언트 ID
                buttonText="구글 로그인"
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
                cookiePolicy={'single_host_origin'}
              />
            </div> */}

            {/* Kakao Login Button */}
            {/* <div className="kakao_button">
              <KakaoLogin
                token="YOUR_KAKAO_JS_KEY" // 카카오 개발자 사이트에서 발급받은 JavaScript 키
                onSuccess={handleKakaoSuccess}
                onFailure={handleKakaoFailure}
                render={(props) => <button onClick={props.onClick}>카카오 로그인</button>}
              />
            </div> */}
          </div>
        </form>
        
        <div >
          <img src={logo2} alt="Logo" className="logo-box" />
        </div>
      </main>
    </div>
  );
};

export default Login;
