import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Input, Button } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios'; // axios 임포트
import { validateEmail, removeWhitespace } from '../utils/common';
import { UserContext } from '../contexts/UserContext'; // UserContext 불러오기
import AsyncStorage from '@react-native-async-storage/async-storage';

const ErrorText = styled.Text`
  align-items : flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  margin:3%;
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

const Login = ({ navigation }) => {
  const { dispatch } = useContext(UserContext); // loginUser 함수 가져오기
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const _handleLoginIdChange = loginId => {
    const changedLoginId = removeWhitespace(loginId);
    setLoginId(changedLoginId);
    setErrorMessage(
      validateEmail(changedLoginId) ? '' : '이메일(아이디) 형식을 확인하세요'
    );
  };

  const _handlePasswordChange = loginPassword => {
    setLoginPassword(removeWhitespace(loginPassword));
  };

  const _handleLoginButtonPress = async () => {
    if (!validateEmail(loginId) || !loginPassword) {
      setErrorMessage('아이디와 비밀번호를 확인하세요');
      return;
    }

    const userProfile = {
      userId: loginId,
      userPassword: loginPassword
    };

    try {
      const response = await axios.post(
        'http://192.168.3.24:9090/travel/login', // 백엔드 엔드포인트
        userProfile,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data) {
        dispatch(response.data); // UserContext에 사용자 정보 저장
        console.log(response.data)
        alert(`로그인 성공! 환영합니다, ${response.data.userNickName} 님!`);
        // 토큰 저장 예시
        await AsyncStorage.setItem('userToken', response.data.token);
      } else {
        setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={20}
    >
      <Container>
        {/* 로고 추가 */}
        <LogoContainer>
          <Logo source={require('../../assets/Logo.png')} />
        </LogoContainer>
        <Input
          label="아이디"
          value={loginId}
          onChangeText={_handleLoginIdChange}
          onSubmitEditing={() => {}}
          placeholder="Email"
          returnKeyType="next"
        />
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        <Input
          label="비밀번호"
          value={loginPassword}
          onChangeText={_handlePasswordChange}
          onSubmitEditing={() => {}}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />

        <Button title="로그인" onPress={_handleLoginButtonPress} />
        <Button title="회원가입" onPress={() => navigation.navigate('Signup')} isFilled={false} />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Login;
