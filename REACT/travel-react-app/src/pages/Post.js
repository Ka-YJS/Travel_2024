import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { Button } from "@mui/material";
import { PlaceContext } from "../context/PlaceContext";
import { ListContext } from "../context/ListContext";
import { CopyListContext } from "../context/CopyListContext";
import TopIcon from "../TopIcon/TopIcon";
import "../css/Post.css";

const Post = () => {
    const navigate = useNavigate();

    const { placeList, setPlaceList } = useContext(PlaceContext);
    const { list, setList } = useContext(ListContext);
    const { copyList, setCopyList } = useContext(CopyListContext);
    const { postList, setPostList } = useContext(PostContext);

    const [posts, setPosts] = useState(postList); // 전체 게시물
    const [likedPosts, setLikedPosts] = useState({});
    const [searchQuery, setSearchQuery] = useState(""); // 검색어
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const postsPerPage = 3; // 페이지당 표시할 게시물 수

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const likeButtonClick = (id) => {
        setPosts((prevPosts) =>
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

    const handleWriteButton = () => {
        setPlaceList([]);
        setList([]);
        navigate("/map");
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePostClick = (id) => {
        navigate(`/postdetail/${id}`);
    };

    return (
        <div>
        <div style={{margin:"0"}}>
            <TopIcon/>
        </div>
        <div className="post">
            <h1 style={{ textAlign: "center" }}>게시물 목록</h1>

            {/* 게시물 목록 */}
            <div className="post_list" style={{ marginTop: "50px" }}>
                {currentPosts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            width: "200px",
                            cursor: "pointer",
                            textAlign: "center",
                        }}
                    >
                        <img
                            onClick={() => handlePostClick(post.id)}
                            src={post.thumbnail}
                            alt="썸네일"
                            style={{
                                width: "180px",
                                height: "180px",
                                marginRight: "60px",
                                borderRadius: "5px",
                                objectFit: "cover",
                            }}
                        />
                        <p>{post.title}</p>
                        <div style={{ display: "flex" }}>
                            <h3 style={{ margin: 0 }}>
                                {post.title}
                                <span
                                    className="span_style"
                                    onClick={() => likeButtonClick(post.id)}
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
                        
                    </div>
                ))}
            </div>
            <div
            style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/map")} // 글쓰기 페이지로 이동
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
                            backgroundColor: currentPage === index + 1 ? "#007bff" : "#fff",
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
            <div style={{ marginTop: "30px", textAlign:"center"}}>
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
                        textAlign:"center"
                    }}
                />
            </div>

            </div>

            {/* 글쓰기 버튼, 페이지네이션, 검색 등 */}
            {/* 여기에 기존 코드 그대로 작성 */}
        </div>
    );
};

export default Post;
