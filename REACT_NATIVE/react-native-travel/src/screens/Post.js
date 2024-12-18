import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // Import axios
import { PlaceContext } from "../contexts/PlaceContext";
import { ListContext } from "../contexts/ListContext";
import { CopyListContext } from "../contexts/CopyListContext";
import { PostContext } from "../contexts/PostContext";
import { UserContext } from "../contexts/UserContext";

const Post = () => {
  const navigation = useNavigation();
  const {user} = useContext(UserContext);
  const { placeList, setPlaceList } = useContext(PlaceContext);
  const { list, setList } = useContext(ListContext);
  const { copyList, setCopyList } = useContext(CopyListContext);
  const { postList, setPostList } = useContext(PostContext);

  const [likedPosts, setLikedPosts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://192.168.3.25:9090/api/posts", { 
          headers: { 
            'Authorization': `Bearer ${user.token}`
          }
        });
        console.log("Fetched posts:", response.data);
        setPostList(response.data.data); // Set the fetched posts to the postList state
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    
    fetchPosts(); // Fetch posts when component mounts
  }, [user.token]);

  const filteredPosts = (Array.isArray(postList) ? postList : []).filter((post) =>
    post.postTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const likeButtonClick = (id) => {
    setPostList((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === id
          ? { 
              ...post, 
              like: likedPosts[id] ? post.like - 1 : post.like + 1 
            }
          : post
      )
    );

    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [id]: !prevLikedPosts[id], // Toggle like state
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

  const _toMyPost = () => {
    navigation.navigate("MyPost");
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postItem} onPress={() => handlePostClick(item.postId)}>
      {/* 이미지는 item.thumbnail로 설정 */}
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      
      {/* 제목은 item.postTitle로 표시 */}
      <Text style={styles.title}>{item.postTitle}</Text>
      
      {/* 작성자는 item.userNickname으로 표시 */}
      <Text style={styles.author}>작성자: {item.userNickname}</Text>
      
      {/* 좋아요 버튼 클릭 시 item.postId를 전달 */}
      <TouchableOpacity onPress={() => likeButtonClick(item.postId)}>
        <Text style={styles.likeButton}>
          {likedPosts[item.postId] ? '❤️' : '🤍'} {item.likes}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>게시물 목록</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="게시글 제목 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.postId.toString()}
        contentContainerStyle={styles.postList}
        numColumns={3}
      />
      
      <View style={styles.writeButtonContainer}>
        <TouchableOpacity 
          style={styles.writeButton} 
          onPress={handleWriteButton}
        >
          <Text style={styles.writeButtonText}>기록 시작</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.toMyPost} 
          onPress={_toMyPost}
        >
          <Text style={styles.writeButtonText}>내 글 보기</Text>
        </TouchableOpacity>
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
    flexDirection : "row",
    justifyContent : "center",
    gap: 50,
  },
  writeButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  toMyPost: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  writeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  author: {
    fontSize: 12,
    color: "#555",
    marginTop: 1,
  },
});

export default Post;