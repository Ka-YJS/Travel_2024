import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WriteScreen from './screens/WriteScreen'; // 게시판 작성 화면
import PostScreen from './screens/PostScreen'; // 게시판 보기 화면
import { Ionicons } from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="WriteScreen"  // 초기 화면을 '게시판 작성'으로 설정
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'WriteScreen') {
            iconName = 'create'; // 게시판 작성 아이콘
          } else if (route.name === 'PostScreen') {
            iconName = 'eye'; // 게시판 보기 아이콘
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="WriteScreen" component={WriteScreen} options={{ tabBarLabel: '게시판 작성' }} />
      <Tab.Screen name="PostScreen" component={PostScreen} options={{ tabBarLabel: '게시판 보기' }} />
    </Tab.Navigator>
  );
};

export default MainTabs;
