import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { createStackNavigator } from '@react-navigation/stack';
import { Login, Signup } from '../screens';

const Stack = createStackNavigator();

const AuthStack = () => {
    const theme = useContext(ThemeContext);
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerTitleAlign: 'center',
                cardStyle: { backgroundColor: theme.background },
                headerTitleStyle: {
                    fontFamily: 'GCB_Bold',  // 폰트 설정
                    fontSize: 20,  // 폰트 크기 설정
                    color: theme.text,  // 제목 색상 설정
                },
            }}
        >
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerLeft: () => null,
                    headerTitle: "로그인"
                }}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
                options={{
                    headerTitle: "회원 가입"
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
