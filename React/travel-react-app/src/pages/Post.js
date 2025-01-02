import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { Button } from "@mui/material";
import TopIcon from "../TopIcon/TopIcon";
import "../css/Post.css";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import imageno from "../image/imageno.PNG";
import config from "../Apikey";
import backgroundImage from "../image/flowers.png";

const Post = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { postList, setPostList } = useContext(PostContext);
    const [likedPosts, setLikedPosts] = useState({});
    const [searchQuery, setSearchQuery] = useState(""); // 검색어
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const postsPerPage = 10; // 페이지당 게시물 수

    // 서버에서 게시물 가져오기
    const getPostList = async () => {
        try {
            const response = await axios.get(`http://${config.IP_ADD}:9090/api/posts`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const fetchedPosts = response.data.data;


            // 좋아요 상태 한번에 가져오기
            const likedStatusPromises = fetchedPosts.map((post) =>
                axios.get(`http://${config.IP_ADD}:9090/api/likes/${post.postId}/isLiked`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                })
            );

            // 모든 API 호출 완료 후, 상태 설정
            const likedStatusResponses = await Promise.all(likedStatusPromises);
            const likedStatus = likedStatusResponses.reduce((acc, response, index) => {
                acc[fetchedPosts[index].postId] = response.data;
                return acc;
            }, {});

            setLikedPosts(likedStatus); // 좋아요 상태 업데이트
            setPostList(fetchedPosts); // 게시물 리스트 설정

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // 컴포넌트 마운트 시 게시물 가져오기
    useEffect(() => {
        getPostList();
    }, []);

    // 검색 및 필터링
    const filteredPosts = Array.isArray(postList)
        ? postList.filter((post) =>
            searchQuery === "" ||
            (post.postTitle && post.postTitle.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : [];

    // 게시물 순서를 역순으로 변경
    const reversedPosts = filteredPosts.slice().reverse();

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage); // 전체 페이지 수
    const indexOfLastPost = currentPage * postsPerPage; // 현재 페이지 마지막 게시물 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 현재 페이지 첫 게시물 인덱스
    const currentPosts = reversedPosts.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지에 표시할 게시물

    // 페이지 변경
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 글쓰기 페이지 이동
    const toWritePage = () => {
        navigate("/map");
    };

    // 좋아요 버튼 클릭
    const likeButtonClick = async (postId) => {
        try {
            const isLiked = likedPosts[postId];
            const url = `http://${config.IP_ADD}:9090/api/likes/${postId}`;
            const method = isLiked ? "delete" : "post";

            await axios({ method, url, headers: { Authorization: `Bearer ${user.token}` } });

            // 좋아요 상태 업데이트
            setLikedPosts((prev) => ({
                ...prev,
                [postId]: !isLiked,
            }));

            // 게시물의 좋아요 수 업데이트
            setPostList((prev) =>
                prev.map((post) =>
                    post.postId === postId
                        ? { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 }
                        : post
                )
            );
        } catch (error) {
            console.error("Error updating like:", error);
            alert("좋아요 처리 중 문제가 발생했습니다.");
        }
    };

    // 게시글 상세 페이지 이동
    const handlePostClick = (id) => {
        navigate(`/postdetail/${id}`, { state: { from: `/post` } });
    };

    return (
        <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center"
 }} >
            <TopIcon text="기록일지" />
            <div className="post">
                <table>
                    <tbody>
                        <tr
                            className="post_list"
                            style={{
                                display: "flex",
                                flexWrap: "wrap", // 아이템들이 화면에 맞게 줄 바꿈
                                justifyContent: "left", // 중앙 정렬
                                gap: "39px", // 아이템들 간의 간격
                                margin: "0 auto",
                                maxWidth: "1100px", // 최대 너비 설정
                                
                            }}
                        >
                            {currentPosts.length > 0 ? (
                                currentPosts.map((post) => (
                                    <td
                                        key={post.postId}
                                        style={{
                                            width: "180px", // 각 게시물의 너비
                                            textAlign: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            onClick={() => handlePostClick(post.postId)}
                                            src={
                                                post.imageUrls && post.imageUrls.length > 0
                                                    ? `http://${config.IP_ADD}:9090${post.imageUrls[0]}`
                                                    : imageno
                                            }
                                            alt="썸네일"
                                            style={{
                                                width: "100%",
                                                height: "180px",
                                                borderRadius: "5px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start"
                                            }}
                                        >
                                            <span
                                                className="span_style"
                                                onClick={() => likeButtonClick(post.postId)}
                                                style={{
                                                    cursor: "pointer",
                                                    marginLeft: "5px",
                                                }}
                                            >
                                                <span style={{ color: "red" }}>
                                                    {likedPosts[post.postId] ? "❤️" : "🤍"}
                                                </span>
                                                <span style={{ color: "black", marginLeft: "5px" }}>
                                                    {post.likes}
                                                </span>
                                            </span>

                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-end", // 오른쪽 정렬
                                                marginRight: "10px", // 오른쪽 여백 추가
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    width: "150px",
                                                    whiteSpace: "nowrap", /* 한 줄로 제한 */
                                                    overflow: "hidden",   /* 넘치는 텍스트 숨기기 */
                                                    textOverflow: "ellipsis", /* 넘치면 '...'으로 표시 */
                                                    textAlign: "right", // 오른쪽 정렬
                                                }}
                                            >
                                                {post.postTitle}
                                            </h3>
                                            <div>
                                                작성자:{post.userNickname}
                                            </div>
                                            <div>
                                                {post.postCreatedAt}
                                            </div>
                                        </div>
                                    </td>
                                ))
                            ) : (
                                <td>게시글이 없습니다.</td>
                            )}
                        </tr>
                    </tbody>
                </table>

                {/* 글쓰기 버튼 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "20px",
                        gap: "20px",
                         // 버튼 간 간격
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/mypost/${user.id}`)}
                        sx={{ width: "10%", backgroundColor: "#4caf50", fontFamily: "'GowunDodum-Regular', sans-serif"
                         }}
                    >
                        나의 기록
                    </Button>
                    <Button
                        variant="contained"
                        onClick={toWritePage}
                        sx={{
                            width: "10%",
                            backgroundColor: "#4caf50",
                            fontFamily: "'GowunDodum-Regular', sans-serif"
                        }}
                    >
                        기록하기
                    </Button>
                </div>

                {/* 페이지네이션 */}
                <div
                    style={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "center",
                        gap: "5px",
                    }}
                >
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            style={{
                                padding: "10px 15px",
                                fontSize: "14px",
                                backgroundColor:
                                    currentPage === index + 1 ? "#007bff" : "#fff",
                                color: currentPage === index + 1 ? "#fff" : "#007bff",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {/* 검색 기능 */}
                <div style={{ marginTop: "30px", textAlign: "center" }}>
                    <input
                        type="text"
                        placeholder="게시글 제목 검색 후 엔터"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "60%",
                            padding: "10px",
                            fontSize: "16px",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            textAlign: "center",
                            marginBottom: "20px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Post;
