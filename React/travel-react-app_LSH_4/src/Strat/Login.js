import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import TopIcon from "../TopIcon/TopIcon";

const Login = () => {
  const { user } = useContext(UserContext); // `user` 배열로부터 사용자 정보를 가져옴
  const [loginId, setLoginId] = useState(""); // 로그인 ID 상태
  const [loginPassword, setLoginPassword] = useState(""); // 로그인 비밀번호 상태
  const navigate = useNavigate();

  const toSignup = () => {
    navigate('/Signup')
  };

  const handleLogin = (event) => {
    event.preventDefault();

    // 입력한 ID와 비밀번호를 기준으로 사용자 검색
    const matchedUser = user.find(
      (u) => u.id === loginId && u.password === loginPassword
    );

    if (matchedUser) {
      alert(`로그인 성공! 환영합니다, ${matchedUser.nickname}님!`);
      navigate("/main");
    } else {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header Section */}
      <TopIcon />  

      {/* Main Content */}
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
        {/* Login Form */}
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

        {/* Large Logo */}
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
