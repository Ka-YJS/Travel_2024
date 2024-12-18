import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import "../css/Strat.css";
import logo2 from '../image/logo2.JPG';
import { call } from "../api/ApiService";

// Google OAuth 설정
const googleOAuthConfig = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  responseType: "code",
  scope: "email profile",
  flowName: "auth-code"
};

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  // 회원가입 버튼
  const toSignup = () => {
    navigate('/signup');
  };

  // 일반 로그인 처리
  const handleLogin = async (event) => {
    event.preventDefault();

    const userProfile = {
      userId: loginId,
      userPassword: loginPassword
    };

    try {
      const response = await call("/travel/login", "POST", userProfile);

      if(response) {
        setUser(response);
        console.log("로그인 call 메서드 response:", response);
        alert(`로그인 성공! 환영합니다, ${response.userNickName}님!`);
        navigate("/main");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

    // Google 로그인 성공 처리
    const handleGoogleSuccess = async (googleResponse) => {
      try {
          if (!googleResponse.credential) {
              throw new Error("No credential received");
          }
          
          console.log("Google response:", googleResponse); // 구글 응답 로깅
          
          const response = await call(
              "/travel/oauth2/google/callback",
              "POST",
              { credential: googleResponse.credential }
          );
          
          console.log("Server response:", response); // 서버 응답 로깅

          if (response) {  // response.token 대신 response 자체를 확인
              localStorage.setItem("token", response); // 토큰이 직접 반환되는 경우
              // 사용자 정보는 별도 API 호출로 가져오기
              navigate("/main");
          } else {
              throw new Error("Invalid server response");
          }
      } catch (error) {
          console.error("Full error object:", error); // 전체 에러 객체 로깅
          handleGoogleFailure(error);
      }
  };

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
          <div className="login-container">
            {/* Google OAuth */}
            <GoogleOAuthProvider clientId={googleOAuthConfig.clientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
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

        <div>
          <img src={logo2} alt="Logo" className="logo-box" />
        </div>
      </main>
    </div>
  );
};

export default Login;