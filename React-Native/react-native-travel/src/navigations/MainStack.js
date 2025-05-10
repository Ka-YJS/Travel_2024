import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { createStackNavigator } from '@react-navigation/stack'
import MyPost from "../screens/MyPost";
import Login from "../screens/Login";
import { Main } from "../screens";
import MainTab from "./MainTab";
import PostDetail from "../screens/PostDetail";
import EditPost from "../screens/EditPost";

const Stack = createStackNavigator();

const MainStack = () => {
    const theme = useContext(ThemeContext);
    return(
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign:"left",
                headerTintColor:theme.headerTintColor,
                cardStyle:{backgroundColor:theme.background},
                headerBackTitleVisible:false,
                headerTitleStyle: {
                    fontFamily: 'GCB_Bold',  // 폰트 설정
                },

            }}
        >
            <Stack.Screen 
                name="MainTab" 
                component={MainTab}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="MyPost"
                component={MyPost}
                options={{ 
                    title: '내 기록 보기',
                    headerTitleAlign : "center",
                    headerTitleStyle: {
                        fontFamily: 'GCB_Bold',  // 폰트 설정
                    }, 
                }}
            />
            <Stack.Screen 
                name="PostDetail" 
                component={PostDetail} 
                options={{ 
                    title: "기록 상세", headerTitleAlign : "center",
                    headerTitleStyle: {
                        fontFamily: 'GCB_Bold',  // 폰트 설정
                    },
                }} 
            />
            <Stack.Screen
                name="EditPost"
                component={EditPost}
                options={{
                    title: "기록 수정", headerTitleAlign : "center",
                    headerTitleStyle: {
                        fontFamily: 'GCB_Bold',  // 폰트 설정
                    },
                }}
            />
        </Stack.Navigator>
    )
}

export default MainStack;