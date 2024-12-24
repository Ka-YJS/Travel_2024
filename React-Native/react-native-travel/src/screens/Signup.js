import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Input, Button } from "../components/index";
import { validateEmail, validatePassword, removeWhitespace } from "../utils/common";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ImageBackground } from 'react-native';

const Background = styled(ImageBackground)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  padding: 0 20px;
  color: ${({ theme }) => theme.errorText};
  width : 400px;
`;

const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const LogoContainer = styled.View`
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  border: 3px solid ${({ theme }) => theme.logoBorder};
`;

const Signup = () => {
  const { registerUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("")
  const [userNickName, setUserNickName] = useState("");
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [idErrorMessage, setIdErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);

  const _handleUserIdChange = (userId) => {
    const changedUserId = removeWhitespace(userId);
    setUserId(changedUserId);
    setIdErrorMessage(
      validateEmail(changedUserId) ? "" : "이메일(아이디) 형식을 확인하세요"
    );
    setIsUserIdChecked(false); // Reset user ID check when user changes input
  };

  const handlePasswordChange = (password) => {
    const trimmedPassword = removeWhitespace(password);
    setUserPassword(trimmedPassword);
    setPasswordErrorMessage(
      validatePassword(trimmedPassword)
        ? ""
        : "비밀번호는 최소 8자 이상이어야 하며, 특수문자를 포함해야 합니다."
    );
  };

  const handlePasswordConfirmChange = (confirmPassword) => {
    const trimmedConfirmPassword = removeWhitespace(confirmPassword);
    setPasswordConfirm(trimmedConfirmPassword);
    setPasswordConfirmErrorMessage(
      userPassword === trimmedConfirmPassword
        ? ""
        : "비밀번호가 일치하지 않습니다."
    );
  };

  const handleSendAuthCode = async () => {
    if (!isUserIdChecked) {
      setIdErrorMessage("아이디 중복 확인을 완료해주세요.");
      return;
    }

    if (!validateEmail(userId)) {
      setIdErrorMessage("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`http://192.168.3.25:9090/api/email/auth?address=${userId}`);

      if (response.data.success) {
        alert("인증 코드가 이메일로 전송되었습니다.");
        setIsAuthCodeSent(true);
      } else {
        setIdErrorMessage("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("인증 코드 발송 실패:", error);
      setIdErrorMessage("인증 코드 발송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAuthCode = async () => {
    if (!authCode) {
      setIdErrorMessage("인증 코드를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`http://192.168.3.25:9090/api/email/auth?address=${userId}&authCode=${authCode}`);

      if (response.data.success) {
        alert("이메일 인증이 완료되었습니다.");
        setIsEmailVerified(true);
      } else {
        setIdErrorMessage("인증 코드가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("인증 코드 검증 실패:", error);
      setIdErrorMessage("인증 코드 검증 중 오류가 발생했습니다.");
    }
  };

  const handleUserIdCheck = async () => {
    if (!validateEmail(userId)) {
      setIdErrorMessage("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://192.168.3.25:9090/travel/userIdCheck", { userId });

      if (response.data) {
        alert("사용 가능한 아이디입니다.");
        setIsUserIdChecked(true);
      } else {
        setIdErrorMessage("이미 사용 중인 아이디입니다.");
        setIsUserIdChecked(false);
      }
    } catch (error) {
      console.error("아이디 중복 체크 실패:", error);
      setIdErrorMessage("아이디 중복 체크 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!userName || !userNickName ||!userPhoneNumber || !userId || !userPassword || !passwordConfirm) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (!isUserIdChecked) {
      setIdErrorMessage("아이디 중복 확인을 완료해주세요.");
      return;
    }

    if (!validatePassword(userPassword)) {
      setPasswordErrorMessage("비밀번호는 최소 8자 이상이며, 특수문자를 포함해야 합니다.");
      return;
    }

    if (userPassword !== passwordConfirm) {
      setPasswordConfirmErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isEmailVerified) {
      setIdErrorMessage("이메일 인증을 완료해주세요.");
      return;
    }

    const newUser = {
      userName,
      userPhoneNumber,
      userNickName,
      userId,
      userPassword,
    };

    try {
      const response = await axios.post("http://192.168.3.25:9090/travel/signup", newUser, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다!");
        registerUser(newUser); // Optional: UserContext 업데이트
        navigation.navigate("Login");
      } else {
        alert("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <Background source={require("../../assets/flowers.png")} resizeMode="cover">
    <KeyboardAwareScrollView>
      <Container>
        <LogoContainer>
          <Logo source={require('../../assets/Logo.png')} />
        </LogoContainer>
        <Input
          label="아이디"
          value={userId}
          onChangeText={_handleUserIdChange}
          placeholder="Email"
          returnKeyType="next"
        />
        {idErrorMessage && <ErrorText>{idErrorMessage}</ErrorText>}
        <Button
          title="아이디 중복 확인"
          onPress={handleUserIdCheck}
          disabled={isLoading || !validateEmail(userId)}
        />
        {isAuthCodeSent && (
          <Input
            label="인증 코드"
            value={authCode}
            onChangeText={setAuthCode}
            placeholder="Authentication Code"
            returnKeyType="done"
          />
        )}
        {!isEmailVerified && (
          <Button
            title={isAuthCodeSent ? "인증 코드 확인" : isLoading ? "발송 중..." : "인증 코드 발송"}
            onPress={isAuthCodeSent ? handleVerifyAuthCode : handleSendAuthCode}
            disabled={
              isLoading || 
              (isAuthCodeSent && !authCode) || 
              (!isAuthCodeSent && (!validateEmail(userId) || !isUserIdChecked)) // 인증 코드 발송 비활성화 조건에 중복 체크 추가 
            }
          />
        )}
        <Input
          label="이름"
          value={userName}
          onChangeText={setUserName}
          placeholder="Name"
          returnKeyType="next"
        />
        <Input
          label="전화번호 (하이픈(-) 을 제외하고 입력해주세요.)"
          value={userPhoneNumber}
          onChangeText={setUserPhoneNumber}
          placeholder="PhoneNumber"
          returnKeyType="next"
        />
        <Input
          label="닉네임"
          value={userNickName}
          onChangeText={setUserNickName}
          placeholder="Nickname"
          returnKeyType="next"
        />
        <Input
          label="비밀번호"
          value={userPassword}
          onChangeText={handlePasswordChange}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />
        {passwordErrorMessage && <ErrorText>{passwordErrorMessage}</ErrorText>}
        <Input
          label="비밀번호 확인"
          value={passwordConfirm}
          onChangeText={handlePasswordConfirmChange}
          placeholder="Password Confirm"
          isPassword
        />
        {passwordConfirmErrorMessage && <ErrorText>{passwordConfirmErrorMessage}</ErrorText>}
        <Button title="회원가입" onPress={handleSignup} disabled={!isEmailVerified} />
      </Container>
    </KeyboardAwareScrollView>
    </Background>
  );
};

export default Signup;
