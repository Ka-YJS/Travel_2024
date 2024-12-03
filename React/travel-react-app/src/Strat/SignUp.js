import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import TopIcon from "../TopIcon/TopIcon";
import axios from "axios";

function Signup() {
  const { user, setUser } = useContext(UserContext);
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirm, setUserPasswordConfirm] = useState("");
  const [userName, setUserName] = useState("");
  const [userNickName, setUserNickName] = useState("");
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [emailError, setEmailError] = useState(false); // 이메일 형식 에러 상태
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 상태
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (userPassword !== userPasswordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 새로운 사용자 객체 생성
    const newUser = {
      userId:userId,
      userName:userName,
      userNickName:userNickName,
      userPassword:userPassword,
    };

    // 아이디 중복 체크 여부 확인
    if (!isIdChecked) {
      alert("아이디 중복체크를 해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:9090/travel/signup", newUser, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      alert("회원가입이 완료되었습니다.");
      navigate("/Login");
    } catch (error) {
      console.error("회원가입 중 오류가 발생했습니다:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleIdCheck = () => {
    if (!userId) {
      alert("아이디를 입력하세요.");
      return;
    }

    const isDuplicate = user.some((existingUser) => existingUser.id === userId);

    if (isDuplicate) {
      alert("이미 사용 중인 아이디입니다.");
      setIsIdChecked(false);
    } else {
      alert("사용 가능한 아이디입니다.");
      setIsIdChecked(true);
    }
  };

  const handleEmailValidation = (value) => {
    setUserId(value);
    setIsIdChecked(false);

    // 이메일 형식 검증 (정규식 사용)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value)); // 이메일 형식이 맞지 않으면 true
  };

  const handleEmailVerification = () => {
    if (emailError || !userId) {
      alert("올바른 이메일 주소를 입력해주세요.");
      return;
    }
    // 이메일 인증 로직 추가 (예: 서버로 인증 요청 전송)
    alert("이메일 인증 링크를 보냈습니다. 이메일을 확인해주세요.");
    setIsEmailVerified(true); // 이메일 인증 성공 시 true로 변경
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setUserPassword(password);

    if (!validatePassword(password)) {
      setPasswordError("비밀번호는 8자 이상이며 특수문자를 포함해야 합니다.");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopIcon />

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
        <form
          onSubmit={handleSubmit}
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
          <h3 style={{ textAlign: "center" }}>::: 회원가입 :::</h3>

          <div style={{ marginBottom: "15px", marginRight: "18px" }}>
            <label htmlFor="userId" style={{ display: "block", marginBottom: "5px" }}>
              이메일 (아이디)
            </label>
            <input
              id="userId"
              name="userId"
              value={userId}
              placeholder="example@email.com"
              onChange={(e) => handleEmailValidation(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
             {emailError && (
              <span style={{ color: "red", fontSize: "12px", display: "block", marginTop: "5px" }}>
                이메일 형식이 올바르지 않습니다.
              </span>
            )}
            <div style={{ marginTop: "5px", display: "flex", justifyContent: "center", gap: "10px", marginLeft : "18px" }}>
              <input
                type="button"
                value="중복체크"
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  flex: 1,
                  maxWidth: "100%", // 버튼 크기 조정
                }}
                onClick={handleIdCheck}
              />
              <input
                type="button"
                value="이메일 인증"
                style={{
                  padding: "8px 15px",
                  backgroundColor: isEmailVerified ? "#4CAF50" : "#008CBA",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  flex: 1,
                  maxWidth: "100%", // 버튼 크기 조정
                }}
                onClick={handleEmailVerification}
                disabled={isEmailVerified}
              />
            </div>

           
          </div>

          <div style={{ marginBottom: "15px", marginRight: "18px" }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
              이름
            </label>
            <input
              id="userName"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px", marginRight: "18px" }}>
            <label htmlFor="userNickName" style={{ display: "block", marginBottom: "5px" }}>
              닉네임
            </label>
            <input
              id="userNickName"
              name="userNickName"
              value={userNickName}
              onChange={(e) => setUserNickName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px", marginRight: "18px" }}>
            <label htmlFor="userPassword" style={{ display: "block", marginBottom: "5px" }}>
              비밀번호
            </label>
            <input
              id="userPassword"
              name="userPassword"
              type="password"
              value={userPassword}
              onChange={handlePasswordChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            {passwordError && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{passwordError}</p>
            )}
          </div>

          <div style={{ marginBottom: "15px", marginRight: "18px" }}>
            <label htmlFor="userPasswordConfirm" style={{ display: "block", marginBottom: "5px" }}>
              비밀번호 확인
            </label>
            <input
              id="userPasswordConfirm"
              name="userPasswordConfirm"
              type="password"
              value={userPasswordConfirm}
              onChange={(e) => setUserPasswordConfirm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <input
              type="submit"
              value="가입"
              style={{
                padding: "10px 20px",
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
              value="취소"
              onClick={() => navigate("/")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#008CBA",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
                marginTop: "10px",
              }}
            />
          </div>
        </form>
        {/* 큰 로고 */}
        <div
          style={{
            width: "25%",
            height: "auto", // 높이를 자동으로 조정
            maxWidth: "400px", // 최대 너비 제한
            aspectRatio: "1 / 1", // 정사각형 비율 유지
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
}

export default Signup;
