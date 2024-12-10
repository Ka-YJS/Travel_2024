import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSize, buttonStyles } from '../theme/Theme';  // Theme.js에서 스타일 불러오기

const LoginScreen = ({ setIsLoggedIn, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (email === 'a' && password === 'a') {
      setError('');
      setIsLoggedIn(true);
    } else {
      setError('잘못된 이메일 또는 비밀번호입니다');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="로그인" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.medium,
    backgroundColor: colors.secondary,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: spacing.small,
    paddingLeft: 8,
    borderRadius: 5,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.small,
  },
  signupText: {
    marginTop: spacing.small,
    color: colors.primary,
    fontSize: fontSize.medium,
  },
});

export default LoginScreen;
