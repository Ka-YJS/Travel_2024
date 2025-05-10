import React, { useContext } from "react";
import { Button } from "../components";
import styled from "styled-components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserContext } from "../contexts/UserContext";
import { ImageBackground } from "react-native";

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
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
  width : 100%;
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
  font-size: 30px;
  color: ${({ theme }) => theme.text};
  line-height: 200px;
  font-family: GCB;
`;

const Nickname = styled.Text`
  font-size: 30px;
  color: ${({ theme }) => theme.text}; 
  font-family: GCB_Bold;
`;

const Main = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const insets = useSafeAreaInsets();

  return (
    <Background source={require("../../assets/flowers.png")} resizeMode="cover">
      <Container insets={insets}>
        {/* 로고 추가 */}
        <LogoContainer>
          <Logo source={require("../../assets/Logo.png")} />
        </LogoContainer>
        <WelcomeText>
          <Nickname>{user.userNickName}</Nickname> 님 환영합니다.
        </WelcomeText>
        <Button
          title="기록 시작하기"
          onPress={() => navigation.navigate("Map")}
          isFilled={true}
        />
        <Button
          title="내 기록 보기"
          onPress={() => navigation.navigate("MyPost")}
          isFilled={false}
        />

      </Container>
    </Background>
  );
};

export default Main;
