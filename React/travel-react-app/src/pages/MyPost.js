import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TopIcon from "../TopIcon/TopIcon";
import "../css/Post.css";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import logo from "../image/logo4.png";

const MyPost = () => {
    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    
    const [myPostList, setMyPostList] = useState([]);
    const [likedPosts, setLikedPosts] = useState({});
    const [searchQuery, setSearchQuery] = useState(""); // 검색어
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postsPerPage, setPostsPerPage] = useState(10); // 페이지당 게시물 수

    // 서버에서 게시물 가져오기
    const getMyPostList = async () => {
        try {
            const response = await axios.get(`http://192.168.3.24:9090/api/myPosts/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            console.log("Fetched posts:", response.data.data);
            setMyPostList(response.data.data); // 데이터 설정
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // 컴포넌트 마운트 시 게시물 가져오기
    useEffect(() => {
        getMyPostList();
    }, []);

    // 검색 및 필터링
    const filteredPosts = Array.isArray(myPostList)
        ? myPostList.filter((post) =>
            searchQuery === "" ||
            (post.postTitle && post.postTitle.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : [];
    
    // 게시물 순서를 역순으로 변경
    const reversedPosts = [...filteredPosts].reverse();    

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
    const likeButtonClick = (id) => {
        setMyPostList((prevPosts) =>
            prevPosts.map((post) =>
                post.postId === id
                    ? {
                          ...post,
                          like: likedPosts[id] ? post.like - 1 : post.like + 1,
                      }
                    : post
            )
        );

        setLikedPosts((prevLikedPosts) => ({
            ...prevLikedPosts,
            [id]: !prevLikedPosts[id], // 좋아요 상태 반전
        }));
    };

    // 게시글 상세 페이지 이동
    const handlePostClick = (id) => {
        navigate(`/postdetail/${id}`, { state: { from: `/mypost/${user.id}` } });
    };

    return (
        <div>
            <TopIcon text="MY POST"/>
            <div className="post">
                <table>
                    <tbody>
                        <tr 
                            className="post_list" 
                            style={{ 
                                display: "flex",
                                flexWrap: "wrap", // 아이템들이 화면에 맞게 줄 바꿈
                                justifyContent: "center", // 중앙 정렬
                                gap: "20px", // 아이템들 간의 간격
                                margin: "0 auto",
                                maxWidth: "1000px", // 최대 너비 설정
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
                                                    ? `http://192.168.3.24:9090${post.imageUrls[0]}`
                                                    : logo
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
                                                    color: "red",
                                                    marginLeft: "5px",
                                                }}
                                            >
                                                ❤️
                                            </span>
                                            {post.like}                                            
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
                                                    width:"150px",
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
                        gap: "20px", // 버튼 간 간격
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={()=>navigate("/post")}
                        sx={{ width: "10%" }}
                    >
                        Post
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={toWritePage}
                        sx={{ width: "10%" }}
                    >
                        글쓰기
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
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyPost;
