import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopIcon from "../TopIcon/TopIcon";
import axios from "axios";

const Login = () => {
  const [loginId, setLoginId] = useState(""); // 로그인 ID 상태
  const [loginPassword, setLoginPassword] = useState(""); // 로그인 비밀번호 상태
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태
  const navigate = useNavigate();

  const toSignup = () => {
    navigate('/Signup');
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:9090/travel/signin", {
        userId:loginId,
        userPassword:loginPassword,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 && response.data) {
        // 로그인 성공 시
        alert(`로그인 성공! 환영합니다, ${loginId}님!`);
        navigate("/main");
      } else {
        setErrorMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      // 네트워크 오류나 서버 오류 처리
      setErrorMessage("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 헤더 섹션 */}
      <TopIcon />

      {/* 메인 콘텐츠 */}
      <main
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          gap: "20px",
        }}
      >
        {/* 로그인 폼 */}
        <form
          onSubmit={handleLogin}
          style={{
            width: "35%",
            maxWidth: "400px",
            minWidth: "300px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            margin: "0 10px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>::: 로그인 :::</h3>
          <div style={{ marginBottom: "15px", marginRight: "18px" }}>
            <label htmlFor="loginId" style={{ display: "block", marginBottom: "5px" }}>
              아이디
            </label>
            <input
              id="loginId"
              name="loginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px", marginRight: "18px" }}>
            <label htmlFor="loginPassword" style={{ display: "block", marginBottom: "5px" }}>
              비밀번호
            </label>
            <input
              id="loginPassword"
              name="loginPassword"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {/* 오류 메시지 표시 */}
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}

          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <input
              type="submit"
              value="로그인"
              style={{
                padding: "10px 20px",
                marginBottom: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
              }}
            />
            <input
              type="button"
              value="회원가입"
              onClick={toSignup}
              style={{
                padding: "10px 20px",
                backgroundColor: "#008CBA",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
              }}
            />
          </div>
        </form>

        {/* 큰 로고 */}
        <div
          style={{
            width: "25%",
            height: "auto",
            maxWidth: "400px",
            aspectRatio: "1 / 1",
            border: "1px solid #ddd",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          큰 로고
        </div>
      </main>
    </div>
  );
};

export default Login;
