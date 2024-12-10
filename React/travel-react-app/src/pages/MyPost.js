import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { UserContext } from "../context/UserContext";
import TopIcon from "../TopIcon/TopIcon";
import '../css/Post.css';

const MyPost = () => {
    const navigate = useNavigate();
    const { postList } = useContext(PostContext); // 전체 게시물 데이터
    const { user } = useContext(UserContext); // 현재 로그인한 사용자 데이터
    const [searchQuery, setSearchQuery] = useState(""); // 검색어
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const postsPerPage = 9; // 페이지당 표시할 게시물 수

    const loggedInUserId = user.userId; // 현재 로그인한 사용자 ID

    // 내가 작성한 게시글 필터링
    const myPosts = postList.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // 검색 필터링
    const filteredPosts = myPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 페이지네이션 계산
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage); // 전체 페이지 수

    // 페이지 이동
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 게시물 상세 페이지로 이동
    const handlePostClick = (id) => {
        navigate(`/postdetail/${id}`);
    };

    return (
    <div>
        <div style={{margin:"0"}}>
            <TopIcon/>
        </div>
        <div className="post">
            <h1 style={{ textAlign: "center" }} >My Post</h1>
            
            {/* 게시물 목록 */}
            <div className="post_list" style={{marginTop: "50px"}}>
                {currentPosts.map((post) => (
                    <div className="my_post"
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
                                borderRadius: "5px",
                                objectFit: "cover",
                            }}
                        />
                        <p>{post.title}</p>
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
    </div>
    );
};

export default MyPost;
