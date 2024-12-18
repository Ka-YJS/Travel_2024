import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { call } from "../api/ApiService";
import "../css/Strat.css";
import logo2 from '../image/logo2.JPG';

function Signup() {
 const { user } = useContext(UserContext);
 const [userId, setUserId] = useState("");
 const [isIdChecked, setIsIdChecked] = useState(false);
 const [userPassword, setUserPassword] = useState("");
 const [userPasswordConfirm, setUserPasswordConfirm] = useState("");
 const [passwordError, setPasswordError] = useState("");
 const [userName, setUserName] = useState("");
 const [userNickName, setUserNickName] = useState("");
 const [emailError, setEmailError] = useState(false);
 const [isEmailVerified, setIsEmailVerified] = useState(false);
 const [authCode, setAuthCode] = useState("");
 const [authCodeError, setAuthCodeError] = useState("");
 const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

 const navigate = useNavigate();

 const validatePassword = (password) => {
   return password;
 };

 const validateEmail = (email) => {
   return email;
 };

 const handleSubmit = async (event) => {
   event.preventDefault();

   if (!validatePassword(userPassword)) {
     alert("비밀번호는 8자 이상이며 특수문자를 포함해야 합니다.");
     return;
   }
   if (userPassword !== userPasswordConfirm) {
     alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
     return;
   }
   if (!isIdChecked) {
     alert("아이디 중복체크를 해주세요.");
     return;
   }

   const userInfo = {
     userId: userId,
     userPassword: userPassword,
     userName: userName,
     userNickName: userNickName,
   };

   try {
     const response = await call("/travel/signup", "POST", userInfo, user);
     if (response) {
       console.log("회원가입 call메서드 response:", response);
       alert("회원가입이 완료되었습니다.");
       navigate("/login");
     }
   } catch (error) {
     console.error("회원가입 실패:", error);
     alert("회원가입 중 오류가 발생했습니다.");
   }
 };

 const handleUserIdCheck = async () => {
   if (!userId) {
     alert("아이디를 입력하세요.");
     return;
   }

   const userIdCheck = { userId: userId };

   try {
     const response = await call("/travel/userIdCheck", "POST", userIdCheck, user);
     if (response) {
       alert("사용 가능한 아이디입니다.");
       setIsIdChecked(true);
     } else {
       alert("이미 사용 중인 아이디입니다.");
       setIsIdChecked(false);
     }
   } catch (error) {
     console.error("아이디 중복 체크 실패:", error);
     alert("중복 체크 중 오류가 발생했습니다.");
   }
 };

 const handleEmailValidation = (value) => {
   setUserId(value);
   setIsIdChecked(false);
   setEmailError(!validateEmail(value));
 };

 const handleEmailVerification = async () => {
   if (emailError || !userId) {
     alert("올바른 이메일 주소를 입력해주세요.");
     return;
   }

   setIsLoading(true);
   try {
     const response = await call(`/api/email/auth?address=${userId}`, "GET", null, null);
     setIsLoading(false);
     if (response.success) {
       alert("이메일 인증 코드가 발송되었습니다. 인증 코드를 입력하세요.");
       setIsAuthCodeSent(true);
     } else {
       alert("이메일 인증 코드 발송에 실패했습니다.");
     }
   } catch (error) {
     setIsLoading(false);
     console.error("이메일 인증 코드 발송 실패:", error);
     alert("이메일 인증 코드 발송 중 오류가 발생했습니다.");
   }
 };

 const handleAuthCodeChange = (e) => {
   setAuthCode(e.target.value);
   setAuthCodeError("");
 };

 const handleAuthCodeVerification = async () => {
   if (!authCode) {
     setAuthCodeError("인증 코드를 입력해주세요.");
     return;
   }

   try {
     const response = await call(`/api/email/auth?address=${userId}&authCode=${authCode}`, "POST", null, null);
     if (response.success) {
       setIsEmailVerified(true);
       alert("이메일 인증이 완료되었습니다.");
     } else {
       setAuthCodeError("인증 코드가 일치하지 않습니다.");
     }
   } catch (error) {
     console.error("인증 코드 검증 실패:", error);
     setAuthCodeError("인증 코드 검증 중 오류가 발생했습니다.");
   }
 };

 const handleUserPassword = (e) => {
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
     <main>
       <form className="form" onSubmit={handleSubmit}>
         <h3>::: 회원가입 :::</h3>

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

         <div className="buttons-container">
           <input
             type="button"
             value="중복체크"
             className="button-check"
             onClick={handleUserIdCheck}
           />
         </div>

         <div className="form-group">
           <label htmlFor="userName">이름</label>
           <input
             id="userName"
             name="userName"
             value={userName}
             onChange={(e) => setUserName(e.target.value)}
           />
         </div>

         <div className="form-group">
           <label htmlFor="userNickName">닉네임</label>
           <input
             id="userNickName"
             name="userNickName"
             value={userNickName}
             onChange={(e) => setUserNickName(e.target.value)}
           />
         </div>

         <div className="form-group">
           <label htmlFor="userPassword">비밀번호</label>
           <input
             id="userPassword"
             name="userPassword"
             type="password"
             value={userPassword}
             onChange={handleUserPassword}
           />
           {passwordError && <span className="error-message">{passwordError}</span>}
         </div>

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

         <div className="submit-container">
           <input type="submit" value="가입" className="submit" />
           <input
             type="button"
             value="취소"
             className="cancel"
             onClick={() => navigate("/login")}
           />
         </div>
       </form>

       <div>
         <img 
           src={logo2} 
           alt="Logo"
           className="logo-box" 
         />
       </div>
     </main>
   </div>
 );
}

export default Signup;