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
import logo from "../image/logo4.png"

const Post = () => {
    const navigate = useNavigate();
    const {user} = useContext(UserContext)
    const { postList, setPostList } = useContext(PostContext);
    const {setPlaceList} = useContext(PlaceContext)
    const {setList} = useContext(ListContext)


    const [likedPosts, setLikedPosts] = useState({});
    const [searchQuery, setSearchQuery] = useState(""); // 검색어
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1);

    const initialPostsPerPage = parseInt(localStorage.getItem("postsPerPage")) || 3;
    const [postsPerPage, setPostsPerPage] = useState(initialPostsPerPage);// 페이지당 표시할 게시물 수

    const getPostList = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api/posts", {
                headers: { 
                    'Authorization': `Bearer ${user.token}`
                },
            });
            console.log("Fetched posts:", response.data.data);
            setPostList(response.data.data); // 데이터 구조에 따라 적절히 수정
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        getPostList();
        console.log(postList)
    }, []);


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const filteredPosts = Array.isArray(postList)
        ? postList.filter((post) =>
            searchQuery === "" || post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    console.log(currentPosts)
    console.log(currentPosts[0].postId)
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePostsPerPage = (e) => {
        setPostsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };


    const toWritePage = () => {
        setPlaceList([])
        setList([])
        navigate("/map")
    }
    

    useEffect(() => {
        setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
        setCurrentPage(1);
    }, [filteredPosts, postsPerPage]);

    const likeButtonClick = (id) => {
        setPostList((prevPosts) =>
            prevPosts.map((post) =>
                post.id === id
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

    const handlePostClick = (id) => {
        console.log(id)
        navigate(`/postdetail/${id}`);
    };

    return (
        <div>
            <div style={{margin:"0"}}>
                <TopIcon/>
            </div>
            <div className="post">
                <h1 style={{ textAlign: "center" }}>게시물 목록</h1>
                <table>
                    <tbody>
                {/* 게시물 목록 */}
                <tr className="post_list" style={{ marginTop: "50px" }}>
                    {postList.length > 0 ? (
                        currentPosts.map((post) => (
                            <td
                                key={post.id}
                                style={{
                                    width: "200px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                }}
                            >
                                <img
                                    onClick={() => handlePostClick(post.postId)}
                                    src={
                                        post.imageUrls && post.imageUrls.length > 0 ? 
                                        `http://localhost:9090${post.imageUrls[0]}` : 
                                        logo
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
                                
                                
                                    <div>
                                        {post.postCreatedAt}
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

                {/* 게시물 수 설정 */}
                {/* <div className="board-posts-per-page">
                    <label>
                        게시물 수:{" "}
                        <select value={postsPerPage} onChange={handlePostsPerPage}>
                            <option value={3}>3개</option>
                            <option value={5}>5개</option>
                            <option value={10}>10개</option>
                        </select>
                    </label>
                </div> */}

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
                                color:
                                    currentPage === index + 1 ? "#fff" : "#007bff",
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
