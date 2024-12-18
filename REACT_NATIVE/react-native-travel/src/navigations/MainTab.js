import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Profile, ChannelList, Main, Map, MyPage, Post } from "../screens/index";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "styled-components";
import { CardStyleInterpolators } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// TabBarIcon 컴포넌트
const TabBarIcon = ({ focused, name }) => {
    const theme = useContext(ThemeContext);
    return (
        <MaterialIcons
            name={name}
            size={26}
            color={focused ? theme.tabActiveColor : theme.tabInactiveColor}
        />
    );
}

// Main 탭 내부에 스택 네비게이터 생성
const MainScreenStack = () => {
    const theme = useContext(ThemeContext);

    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                gestureEnabled: true,
            }}
        >
            <Stack.Screen
                name="MainScreen"
                component={Main}
                options={({ navigation }) => ({
                    title: "Main",
                    headerRight: () => (
                        <MaterialIcons
                            name="person"
                            size={26}
                            style={{ margin: 10 }}
                            onPress={() => {
                                navigation.push('MyPage');
                            }}
                        />
                    )
                })}
            />
            <Stack.Screen
                name="MyPage"
                component={MyPage}
                options={{
                    title: "My Page",
                }}
            />
        </Stack.Navigator>
    );
}

const MainTab = () => {
    const theme = useContext(ThemeContext);

    return (
        <Tab.Navigator
            initialRouteName="Main"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.tabActiveColor,
                tabBarInactiveTintColor: theme.tabInactiveColor,
            }}
        >
            <Tab.Screen
                name="Map"
                component={Map}
                options={{
                    tabBarIcon: ({ focused }) => TabBarIcon({ focused, name: "map" }),
                }}
            />
            <Tab.Screen
                name="Main"
                component={MainScreenStack} // MainScreenStack으로 변경
                options={{
                    tabBarIcon: ({ focused }) => TabBarIcon({ focused, name: "home" }),
                    unmountOnBlur: true,  // 탭이 블러될 때 컴포넌트 언마운트
                }}
            />
            <Tab.Screen
                name="Post"
                component={Post}
                options={{
                    tabBarIcon: ({ focused }) => TabBarIcon({ focused, name: "apps" }),
                }}
            />
        </Tab.Navigator>
    );
}

export default MainTab;
