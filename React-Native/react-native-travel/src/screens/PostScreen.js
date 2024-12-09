import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PostScreen = () => {
  return (
    <View style={styles.container}>
      <Text>게시판 내용</Text>
      <Button title="게시글 보기" onPress={() => console.log('게시글 보기')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostScreen;
