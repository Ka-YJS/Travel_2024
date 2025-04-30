import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import MainStack from './MainStack'; // MainStack을 제대로 import 했는지 확인
import { UserContext } from '../contexts/UserContext'; 

const Stack = createStackNavigator();

const Navigation = () => {
  const { user, dispatch } = useContext(UserContext); // 현재 로그인한 사용자 정보 가져오기

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
      }
    };

    loadUserData(); // 앱 시작 시 사용자 정보 불러오기
  }, []);

  return (
    <NavigationContainer>
      {user.userId ? (
        <MainStack /> // 사용자 있을 경우 MainStack 렌더링
      ) : (
        <AuthStack /> // 사용자 없을 경우 AuthStack 렌더링
      )}
    </NavigationContainer>
  );
};

export default Navigation;
