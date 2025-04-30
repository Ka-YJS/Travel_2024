import React from "react";
import styled from "styled-components";
import { Button } from "react-native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
`;

const Home = ({navigation}) => {
    return(
        <Container>
            <Button title="시작하기" onPress={() => navigation.navigate('Login')} />
        </Container>
    )
}

export default Home;