import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import LoginScreen from './screens/LoginScreen'; // 로그인 화면
import SignupScreen from './screens/SignupScreen'; // 회원가입 화면
import MainTabs from './MainTabs'; // 하단 탭 네비게이션

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  return (
    <NavigationContainer>
      <StatusBar barStyle='dark-content' />
      <Stack.Navigator initialRouteName="Login">
        {/* 로그인 화면 */}
        {!isLoggedIn ? (
          <Stack.Screen
            name="Login"
            component={() => <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Main"
            component={MainTabs} // 로그인 후 MainTabs 화면으로 이동
            options={{ headerShown: false }}
          />
        )}
        {/* 회원가입 화면 */}
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
