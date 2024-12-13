import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { createStackNavigator } from '@react-navigation/stack'
import MyPost from "../screens/MyPost";
import Login from "../screens/Login";
import { Main } from "../screens";
import MainTab from "./MainTab";
import PostDetail from "../screens/PostDetail";

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
                options={{ title: 'My Post' }}
            />
            <Stack.Screen 
                name="PostDetail" 
                component={PostDetail} 
                options={{ title: "게시물 상세" }} 
            />

            
        </Stack.Navigator>
    )
}

export default MainStack;