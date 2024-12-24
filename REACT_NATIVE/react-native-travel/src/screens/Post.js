import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios"; // Import axios
import { PlaceContext } from "../contexts/PlaceContext";
import { PostContext } from "../contexts/PostContext";
import { UserContext } from "../contexts/UserContext";


const Post = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const { setPlaceList } = useContext(PlaceContext);
  const { postList, setPostList } = useContext(PostContext);
  const [likedPosts, setLikedPosts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch posts from API
  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get("http://192.168.3.25:9090/api/posts", {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }

          });
          setPostList(response.data.data); // Set the fetched posts to the postList state

        } catch (error) {
          console.error("Error fetching posts:", error);
        }

      };

      fetchPosts(); // Fetch posts when screen is focused
    }, [user.token]) // Dependency array
  );

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const likedStatus = {};
        for (const post of postList) {
          const response = await axios.get(
            `http://192.168.3.25:9090/api/likes/${post.postId}/isLiked`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          likedStatus[post.postId] = response.data; // API 결과를 저장
        }
        setLikedPosts(likedStatus);
      } catch (error) {
        console.error("Error fetching liked status:", error);
      }
    };
  
    if (postList.length > 0) {
      fetchLikedStatus();
    }
  }, [postList, user.token]);

  const filteredPosts = (Array.isArray(postList) ? postList : []).filter((post) =>
    post.postTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reverse the order of posts
  const reversedPosts = filteredPosts.slice().reverse(); // Make a copy and reverse

  const likeButtonClick = async (postId) => {
    try {
      if (likedPosts[postId]) {
        // 이미 좋아요 상태인 경우 API를 통해 좋아요 삭제
        await axios.delete(`http://192.168.3.25:9090/api/likes/${postId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setLikedPosts((prevLikedPosts) => ({
          ...prevLikedPosts,
          [postId]: false, // 좋아요 상태 해제
        }));
        setPostList((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId ? { ...post, likes: post.likes - 1 } : post
          )
        );
      } else {
        // 좋아요 상태가 아닌 경우 API를 통해 좋아요 추가
        await axios.post(`http://192.168.3.25:9090/api/likes/${postId}`, {}, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setLikedPosts((prevLikedPosts) => ({
          ...prevLikedPosts,
          [postId]: true, // 좋아요 상태로 설정
        }));
        setPostList((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleWriteButton = () => {
    setPlaceList([]);
    navigation.navigate("Map");
  };

  const handlePostClick = (id) => {
    navigation.navigate("PostDetail", { id });
  };

  const _toMyPost = () => {
    navigation.navigate("MyPost");
  };

  const renderPost = ({ item }) => {

    const thumbnail = item.imageUrls && item.imageUrls.length > 0
      ? `http://192.168.3.25:9090${item.imageUrls[0]}`
      : null;

    return (
      <TouchableOpacity style={styles.postItem} onPress={() => handlePostClick(item.postId)}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>No image</Text>
          </View>
        )}
        {/* 제목은 item.postTitle로 표시 */}
        <Text
          style={styles.title}
          numberOfLines={1} // 한 줄로 제한
          ellipsizeMode="tail" // 끝에 '...' 추가
        >
          {item.postTitle}
        </Text>

        {/* 작성자는 item.userNickname으로 표시 */}
        <Text style={styles.author}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          작성자: {item.userNickname}</Text>

        <Text style={styles.createTime}>{item.postCreatedAt}</Text>
        {/* 좋아요 버튼 클릭 시 item.postId를 전달 */}
        <TouchableOpacity onPress={() => likeButtonClick(item.postId)}>
          <Text style={styles.likeButton}>
            {likedPosts[item.postId] ? '❤️' : '🤍'} {item.likes}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.header}>Post</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="게시글 제목 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={reversedPosts}
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
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 5,
    fontFamily: 'GCB_Bold', // 추가
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'GCB_Bold', // 추가
  },
  postList: {
    justifyContent: "space-between",
    alignItems: "flex-start", // 게시물 왼쪽 정렬
    paddingBottom: 20, // 아래 여백 추가
  },
  postItem: {
    margin: 5,
    flexBasis: "30.8%", // 아이템 크기를 3열로 균등 분배
    alignItems: "center", // 아이템 내용 중앙 정렬
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2, // 그림자 효과 (Android)
    shadowColor: "#000", // 그림자 색상 (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  thumbnail: {
    width: "100%", // 부모 컨테이너 너비에 맞춤
    aspectRatio: 1, // 정사각형 이미지
    borderRadius: 8,
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 3,
    fontFamily: 'GCB_Bold', // 추가
  },
  likeButton: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
  },
  writeButtonContainer: {
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
  },
  writeButton: {
    backgroundColor: "#08D37A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  toMyPost: {
    backgroundColor: "#03B764",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  writeButtonText: {
    color: "white",
    fontFamily: 'GCB_Bold', // 추가
  },
  author: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
    fontFamily: 'GCB', // 추가
  },
  createTime: {
    marginTop: 2,
    fontSize: 10,
    color: "#555",
  },
  noImage: {
    width: "100%", // 부모 컨테이너 너비에 맞춤
    aspectRatio: 1, // 정사각형 이미지
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center"
  },
  noImageText: {
    fontSize: 15,
    textAlign: "center",
    color: "#999",
    fontWeight: "bold"
  }
});

export default Post;