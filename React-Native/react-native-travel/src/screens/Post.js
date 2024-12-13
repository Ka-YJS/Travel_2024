import React, { useContext, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PlaceContext } from "../contexts/PlaceContext";
import { ListContext } from "../contexts/ListContext";
import { CopyListContext } from "../contexts/CopyListContext";
import { PostContext } from "../contexts/PostContext";

const Post = () => {
  const navigation = useNavigation();

  const { placeList, setPlaceList } = useContext(PlaceContext);
  const { list, setList } = useContext(ListContext);
  const { copyList, setCopyList } = useContext(CopyListContext);
  const { postList, setPostList } = useContext(PostContext);

  const [likedPosts, setLikedPosts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = postList.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const likeButtonClick = (id) => {
    setPostList((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, like: likedPosts[id] ? post.like - 1 : post.like + 1 }
          : post
      )
    );

    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [id]: !prevLikedPosts[id], // 좋아요 상태 반전
    }));
  };

  const handleWriteButton = () => {
    setPlaceList([]);
    setList([]);
    navigation.navigate("Map");
  };

  const handlePostClick = (id) => {
    navigation.navigate("PostDetail", { id });
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postItem} onPress={() => handlePostClick(item.id)}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
      <TouchableOpacity onPress={() => likeButtonClick(item.id)}>
        <Text style={styles.likeButton}>❤️ {item.like}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>게시물 목록</Text>

      {/* 검색 */}
      <TextInput
        style={styles.searchInput}
        placeholder="게시글 제목 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 게시물 목록 */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.postList}
        numColumns={3} // 한 줄에 3개씩 표시
      />

      {/* 글쓰기 버튼 */}
      <View style={styles.writeButtonContainer}>
        <Button title="글쓰기" onPress={handleWriteButton} />
      </View>
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
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  postList: {
    justifyContent: "space-between",
  },
  postItem: {
    flex: 1,
    margin: 5,
    alignItems: "center",
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
  likeButton: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
  },
  writeButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default Post;
