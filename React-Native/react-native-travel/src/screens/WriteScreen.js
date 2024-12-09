import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const WriteScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePost = () => {
    console.log('게시글 작성:', { title, content });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="내용"
        value={content}
        onChangeText={setContent}
      />
      <Button title="게시글 작성" onPress={handlePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default WriteScreen;
