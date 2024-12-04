import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import TopIcon from "../TopIcon/TopIcon";
import "../css/Strat.css";

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
    <div className="container">
  <TopIcon />
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
    </form>

    <div className="logo-box">큰 로고</div>
  </main>
</div>
  );
};

export default Login;
