import React, { useContext } from "react";
import { Button } from "../components";
import styled from "styled-components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserContext } from "../contexts/UserContext";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 0 20px;
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
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

const WelcomeText = styled.Text`
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: ${({ theme }) => theme.text};
  line-height: 200px;
`;

const Nickname = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: ${({ theme }) => theme.text}; 
`;

const Main = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const insets = useSafeAreaInsets();

  return (
    <Container insets={insets}>
      {/* 로고 추가 */}
      <LogoContainer>
          <Logo source={require('../../assets/Logo.png')} />
        </LogoContainer>
      <WelcomeText>
        <Nickname>{user.userNickName}</Nickname> 님 환영합니다.
      </WelcomeText>
      <Button title="기록 시작하기" onPress={() => navigation.navigate("Map")} />
      <Button title="내 기록 보기" onPress={() => navigation.navigate("MyPost")} />
    </Container>
  );
};

export default Main;
