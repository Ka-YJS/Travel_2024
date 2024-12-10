import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ProfileScreen = ({ navigation, setIsLoggedIn }) => {
  const handleLogout = () => {
    setIsLoggedIn(false); // 로그아웃 처리
    navigation.navigate('Login'); // 로그인 화면으로 돌아가기
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 프로필</Text>
      <Text style={styles.info}>이메일: user@example.com</Text>
      <Text style={styles.info}>이름: 홍길동</Text>
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ProfileScreen;
