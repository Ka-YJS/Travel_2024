import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PostContext } from "../contexts/PostContext";
import { UserContext } from "../contexts/UserContext"; // 사용자 정보 관리 Context

const MyPost = () => {
  const navigation = useNavigation();
  const { postList } = useContext(PostContext);
  const { user } = useContext(UserContext); // 현재 사용자 정보

  // 작성자 ID 기준으로 게시물 필터링
  const myPosts = postList.filter((post) => post.authorId === user.userId);

  const handlePostClick = (id) => {
    navigation.navigate("PostDetail", { id });
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postItem} onPress={() => handlePostClick(item.id)}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.likeCount}>❤️ {item.like}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={myPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.postList}
        numColumns={3} // 한 줄에 3개씩 표시
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  postList: {
    justifyContent: "space-between",
  },
  postItem: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    maxWidth: "30%", // 한 줄에 3개씩 맞추기 위해 최대 너비 설정
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  likeCount: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
});

export default MyPost;
