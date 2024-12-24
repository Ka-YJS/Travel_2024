import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";

const MyPost = () => {
  const { user } = useContext(UserContext); // 현재 로그인 사용자 정보
  const [myPosts, setMyPosts] = useState([]); // 게시물 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigation = useNavigation();

  // 데이터 요청 함수
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.3.25:9090/api/myPosts/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setMyPosts(response.data.data); // 서버에서 데이터 배열을 받아와 상태에 저장
    } catch (error) {
      console.error("Error fetching my posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchMyPosts();
  }, []);

  // 게시물 순서 반대로 변경
  const reversedPosts = myPosts.slice().reverse(); // myPosts의 복사본을 만들고 순서를 반대로


  // 게시물 렌더링 함수
  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { id: item.postId })}
    >
      {/* 썸네일 */}
      {item.imageUrls && item.imageUrls.length > 0 ? (
        <Image
          source={{ uri: `http://192.168.3.25:9090${item.imageUrls[0]}` }}
          style={styles.thumbnail}
        />
      ) : (
        <View style={styles.noThumbnail}>
          <Text style={styles.noThumbnailText}>No Image</Text>
        </View>
      )}

      {/* 제목 및 여행지 */}
      <View style={styles.postInfo}>
        <Text style={styles.postTitle} numberOfLines={1}>
          {item.postTitle}
        </Text>
        <Text style={styles.postPlaces} numberOfLines={1}>
          {item.placeList ? item.placeList.join(", ") : "여행지 없음"}
        </Text>

        {/* 좋아요 개수 */}
        <Text style={styles.likeCount}>❤️ 좋아요: {item.likes || 0}</Text>
        <Text style={styles.createTime}>작성 시간: {item.postCreatedAt}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 로딩 중 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#999" />
          <Text>게시물을 불러오는 중...</Text>
        </View>
      ) : myPosts.length > 0 ? (
        // 게시물 리스트
        <FlatList
          data={reversedPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.postId.toString()}
          contentContainerStyle={styles.postList}
        />
      ) : (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>게시물이 없습니다.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postList: {
    padding: 20,
  },
  postItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    elevation: 2, // Android 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  noThumbnail: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  noThumbnailText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "bold",
  },
  postInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  postTitle: {
    fontSize: 16,
    fontFamily: 'GCB_Bold', // 추가
    color: "#333",
    marginBottom: 5,
  },
  postPlaces: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontFamily: 'GCB', // 추가
  },
  likeCount: {
    fontSize: 14,
    color: "#999",
    fontFamily: 'GCB', // 추가
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    fontSize: 16,
    color: "#999",
  },
  createTime: {
    marginTop: -10,
    fontSize: 11,
    color: "#555",
    textAlign: "right",
    fontFamily: 'GCB', // 추가
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyPost;
