import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import TopIcon from "../TopIcon/TopIcon";
import axios from "axios";
import "../css/Strat.css";
import defaultImage from "../image/defaultImage.png";
import {call} from "../api/ApiService";

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
  const [authCode, setAuthCode] = useState(""); // 인증 코드
  const [authCodeError, setAuthCodeError] = useState(""); // 인증 코드 오류 메시지
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false); // 인증 코드 발송 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const navigate = useNavigate();

  const validatePassword = (password) => {
    // const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    // return passwordRegex.test(password);
    return password
  };

  const validateEmail = (email) => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // return emailRegex.test(email);
    return email
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 이메일 형식 검증
    if (!validateEmail(userId)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    // 비밀번호 형식 검증
    if (!validatePassword(userPassword)) {
      alert("비밀번호는 8자 이상이며 특수문자를 포함해야 합니다.");
      return;
    }

    // // 이메일 인증 확인
    // if (!isEmailVerified) {
    //   alert("이메일 인증을 완료해주세요.");
    //   return;
    // }

    // 비밀번호 확인 일치 여부
    if (userPassword !== userPasswordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 아이디 중복 체크 확인
    if (!isIdChecked) {
      alert("아이디 중복체크를 해주세요.");
      return;
    }

    const newUser = {
      userId: userId,
      userPassword: userPassword,
      userName: userName,
      userNickName: userNickName
    };


    call("/travel/signup","POST",newUser,user)
      .then((response)=>{
        console.log(response)
        alert("회원가입이 완료되었습니다.");
        navigate("/Login");
    })


    // try {
    //   const response = await axios.post("http://localhost:9090/travel/signup", newUser, {
    //     headers: { "Content-Type": "application/json" },
    //   });
    //   console.log(response.data)

    // } catch (error) {
      
    // }

    // alert("회원가입이 완료되었습니다.");
    // navigate("/Login");

  };


  const handleIdCheck = () => {
    if (!userId) {
      alert("아이디를 입력하세요.");
      return;
    }
    alert("사용 가능한 아이디입니다.");
    setIsIdChecked(true);
    
    //나중에 백엔드에서 유전 전체조회 기능 가져오기
    // if (response.data) {
    //   alert("이미 사용 중인 아이디입니다.");
    //   setIsIdChecked(false);
    // } else {
    //   alert("사용 가능한 아이디입니다.");
    //   setIsIdChecked(true);
    // }
  };

  const handleEmailValidation = (value) => {
    setUserId(value);
    setIsIdChecked(false);
    setEmailError(!validateEmail(value)); // 이메일 형식 검증
  };

  // const handleEmailVerification = () => {
  //   if (emailError || !userId) {
  //     alert("올바른 이메일 주소를 입력해주세요.");
  //     return;
  //   }

  //   // 이메일 인증 코드 발송 전에 로딩 상태로 설정
  //   setIsLoading(true);

  //   // 이메일 인증 코드 발송
  //   axios.get(`http://localhost:9090/api/email/auth?address=${userId}`)
  //     .then((response) => {
  //       setIsLoading(false); // 로딩 상태 해제
  //       if (response.data.success) {
  //         alert("이메일 인증 코드가 발송되었습니다. 인증 코드를 입력하세요.");
  //         setIsAuthCodeSent(true); // 인증 코드 입력창 활성화
  //       } else {
  //         alert("이메일 인증 코드 발송에 실패했습니다.");
  //       }
  //     })
  //     .catch((error) => {
  //       setIsLoading(false); // 로딩 상태 해제
  //       console.error("이메일 인증 코드 발송 실패:", error);
  //       alert("이메일 인증 코드 발송 중 오류가 발생했습니다.");
  //     });
  // };

  const handleAuthCodeChange = (e) => {
    setAuthCode(e.target.value);
    setAuthCodeError(""); // 오류 초기화
  };

  const handleAuthCodeVerification = () => {
    if (!authCode) {
      setAuthCodeError("인증 코드를 입력해주세요.");
      return;
    }

    // 인증 코드 검증
    axios.post(`http://localhost:9090/api/email/auth?address=${userId}&authCode=${authCode}`)
      .then((response) => {
        const { success } = response.data;
        if (success) {
          setIsEmailVerified(true);
          alert("이메일 인증이 완료되었습니다.");
        } else {
          setAuthCodeError("인증 코드가 일치하지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("인증 코드 검증 실패:", error);
        setAuthCodeError("인증 코드 검증 중 오류가 발생했습니다.");
      });
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
    <div className="container">
      <TopIcon />
      <main>
        <form className="form" onSubmit={handleSubmit}>
          <h3>::: 회원가입 :::</h3>

          {/* 이메일 입력 필드 */}
          <div className="form-group">
            <label htmlFor="userId">이메일 (아이디)</label>
            <input
              id="userId"
              name="userId"
              value={userId}
              placeholder="example@email.com"
              onChange={(e) => handleEmailValidation(e.target.value)}
            />
            {emailError && <span className="error-message">이메일 형식이 올바르지 않습니다.</span>}
          </div>

          {/* 버튼 그룹 */}
          <div className="buttons-container">
            <input
              type="button"
              value="중복체크"
              className="button-check"
              onClick={handleIdCheck}
            />
            {/* <input
              type="button"
              value={isLoading ? "발송 중..." : "인증번호 발송"}
              className="button-verify"
              onClick={handleEmailVerification}
              disabled={isLoading || !userId || emailError || isEmailVerified}
            /> */}
          </div>

          {/* 인증 코드 입력 필드 */}
          {isAuthCodeSent && (
            <div className="form-group">
              <label htmlFor="authCode">인증 코드</label>
              <input
                id="authCode"
                name="authCode"
                value={authCode}
                onChange={handleAuthCodeChange}
                placeholder="인증 코드를 입력하세요"
              />
              {authCodeError && <span className="error-message">{authCodeError}</span>}
              <div className="auth-code-button">
                <input
                  type="button"
                  value="인증 코드 확인"
                  onClick={handleAuthCodeVerification}
                />
              </div>
            </div>
          )}

          {/* 이름 입력 필드 */}
          <div className="form-group">
            <label htmlFor="userName">이름</label>
            <input
              id="userName"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* 닉네임 입력 필드 */}
          <div className="form-group">
            <label htmlFor="userNickName">닉네임</label>
            <input
              id="userNickName"
              name="userNickName"
              value={userNickName}
              onChange={(e) => setUserNickName(e.target.value)}
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="form-group">
            <label htmlFor="userPassword">비밀번호</label>
            <input
              id="userPassword"
              name="userPassword"
              type="password"
              value={userPassword}
              onChange={handlePasswordChange}
            />
            {passwordError && <span className="error-message">{passwordError}</span>}
          </div>

          {/* 비밀번호 확인 필드 */}
          <div className="form-group">
            <label htmlFor="userPasswordConfirm">비밀번호 확인</label>
            <input
              id="userPasswordConfirm"
              name="userPasswordConfirm"
              type="password"
              value={userPasswordConfirm}
              onChange={(e) => setUserPasswordConfirm(e.target.value)}
            />
          </div>

          {/* 제출 및 취소 버튼 */}
          <div className="submit-container">
            <input type="submit" value="가입" className="submit" />
            <input
              type="button"
              value="취소"
              className="cancel"
              onClick={() => navigate("/")}
            />
          </div>
        </form>

        {/* 큰 로고 */}
        <div className="logo-box">큰 로고</div>
      </main>
    </div>
  );
}

export default Signup;
