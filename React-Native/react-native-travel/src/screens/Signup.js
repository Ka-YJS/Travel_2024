import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Input, Button } from "../components/index";
import { validateEmail, removeWhitespace } from "../utils/common";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 0 20px;
  color: ${({ theme }) => theme.errorText};
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
  const [userNickName, setUserNickName] = useState("");
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const _handleUserIdChange = (userId) => {
    const changedUserId = removeWhitespace(userId);
    setUserId(changedUserId);
    setErrorMessage(
      validateEmail(changedUserId) ? "" : "이메일(아이디) 형식을 확인하세요"
    );
  };

  const handleSendAuthCode = async () => {
    if (!validateEmail(userId)) {
      setErrorMessage("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`http://192.168.3.24:9090/api/email/auth?address=${userId}`);

      if (response.data.success) {
        alert("인증 코드가 이메일로 전송되었습니다.");
        setIsAuthCodeSent(true);
      } else {
        setErrorMessage("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("인증 코드 발송 실패:", error);
      setErrorMessage("인증 코드 발송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAuthCode = async () => {
    if (!authCode) {
      setErrorMessage("인증 코드를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`http://192.168.3.24:9090/api/email/auth?address=${userId}&authCode=${authCode}`);

      if (response.data.success) {
        alert("이메일 인증이 완료되었습니다.");
        setIsEmailVerified(true);
      } else {
        setErrorMessage("인증 코드가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("인증 코드 검증 실패:", error);
      setErrorMessage("인증 코드 검증 중 오류가 발생했습니다.");
    }
  };

  const handleSignup = async () => {
    if (!userName || !userNickName || !userId || !userPassword || !passwordConfirm) {
      setErrorMessage("모든 필드를 입력해주세요.");
      return;
    }

    if (userPassword !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isEmailVerified) {
      setErrorMessage("이메일 인증을 완료해주세요.");
      return;
    }

    const newUser = {
      userName,
      userNickName,
      userId,
      userPassword,
    };

    try {
      const response = await axios.post("http://192.168.3.24:9090/travel/signup", newUser, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다!");
        registerUser(newUser); // Optional: UserContext 업데이트
        navigation.navigate("Login");
      } else {
        setErrorMessage("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      setErrorMessage("회원가입 요청 중 오류가 발생했습니다.");
    }
  };

  return (
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
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
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
            disabled={isLoading || (isAuthCodeSent && !authCode) || (!isAuthCodeSent && !validateEmail(userId))}
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
          label="닉네임"
          value={userNickName}
          onChangeText={setUserNickName}
          placeholder="Nickname"
          returnKeyType="next"
        />
        <Input
          label="비밀번호"
          value={userPassword}
          onChangeText={(text) => setUserPassword(removeWhitespace(text))}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />
        <Input
          label="비밀번호 확인"
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(removeWhitespace(text))}
          placeholder="Password Confirm"
          isPassword
        />

        <Button title="회원가입" onPress={handleSignup} disabled={!isEmailVerified} />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signup;
