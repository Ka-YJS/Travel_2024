import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { Button } from "@mui/material";
import TopIcon from "../TopIcon/TopIcon";
import "../css/Post.css";
import axios from "axios";
import { PlaceContext } from "../context/PlaceContext";
import { ListContext } from "../context/ListContext";
import { UserContext } from "../context/UserContext";
import logo from "../image/logo4.png";

const Post = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { postList, setPostList } = useContext(PostContext);
    const { setPlaceList } = useContext(PlaceContext);
    const { setList } = useContext(ListContext);

    const [likedPosts, setLikedPosts] = useState({});
    const [searchQuery, setSearchQuery] = useState(""); // 검색어
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [postsPerPage, setPostsPerPage] = useState(3); // 페이지당 게시물 수

    // 서버에서 게시물 가져오기
    const getPostList = async () => {
        try {
            const response = await axios.get("http://192.168.3.24:9090/api/posts", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            console.log("Fetched posts:", response.data.data);
            setPostList(response.data.data); // 데이터 설정
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

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage); // 전체 페이지 수
    const indexOfLastPost = currentPage * postsPerPage; // 현재 페이지 마지막 게시물 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 현재 페이지 첫 게시물 인덱스
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지에 표시할 게시물

    // 페이지 변경
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 글쓰기 페이지 이동
    const toWritePage = () => {
        setPlaceList([]);
        setList([]);
        navigate("/map");
    };

    // 좋아요 버튼 클릭
    const likeButtonClick = (id) => {
        setPostList((prevPosts) =>
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
        navigate(`/postdetail/${id}`);
    };

    return (
        <div>
            <div style={{ margin: "0" }}>
                <TopIcon />
            </div>
            <div className="post">
                <h1 style={{ textAlign: "center" }}>게시물 목록</h1>
                <table>
                    <tbody>
                        <tr className="post_list" style={{ marginTop: "50px" }}>
                            {currentPosts.length > 0 ? (
                                currentPosts.map((post) => (
                                    <td
                                        key={post.postId}
                                        style={{
                                            width: "200px",
                                            cursor: "pointer",
                                            textAlign: "center",
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
                                                width: "180px",
                                                height: "180px",
                                                marginRight: "60px",
                                                borderRadius: "5px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <div style={{ display: "flex" }}>
                                            <h3 style={{ margin: 0 }}>
                                                {post.postTitle}
                                                <span
                                                    className="span_style"
                                                    onClick={() => likeButtonClick(post.postId)}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "red",
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    ❤️
                                                </span>
                                                {post.like}
                                            </h3>
                                        </div>
                                        <div>{post.postCreatedAt}</div>
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
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={toWritePage}
                        sx={{ width: "15%" }}
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

export default Post;
