import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PostContext } from "../contexts/PostContext";
import { useNavigation } from "@react-navigation/native";

const PostDetail = ({ route }) => {
  const { id } = route.params; // 전달받은 ID
  const { postList } = useContext(PostContext); // 게시물 리스트에서 데이터 찾기
  const post = postList.find((p) => p.id === id); // 해당 ID의 게시물 찾기

  const navigation = useNavigation();

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>게시물을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.places}>여행지 :</Text>
      <Text style={styles.content}>{post.content}</Text>
      <Text style={styles.info}>좋아요: {post.like}</Text>
      
      {/* "목록으로" 버튼을 TouchableOpacity로 구현 */}
      <TouchableOpacity
        style={styles.button}  // 버튼 스타일 추가
        onPress={() => navigation.goBack()}  // 목록 화면으로 이동
      >
        <Text style={styles.buttonText}>목록으로</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  places: {
    fontSize: 16,
    marginVertical: 10,
  },
  info: {
    fontSize: 14,
    marginTop: 20,
    color: "#555",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",  // 버튼 배경색
    borderRadius: 5,  // 둥근 모서리
    alignItems: "center",  // 텍스트 중앙 정렬
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",  // 텍스트 색상
  }
});

export default PostDetail;