import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { Button } from "@mui/material";
import { PlaceContext } from "../context/PlaceContext";
import { isWriteContext } from "../context/isWriteContext";


const Post = () => {
    const navigate = useNavigate();


    // 게시물 데이터 (더미 데이터)
    const { setIsWrite} = useContext(isWriteContext)
    const {postList, setPostList} = useContext(PostContext);
    const {placeList,setPlaceList} = useContext(PlaceContext)
    const [posts, setPosts] = useState(postList); // 전체 게시물

    console.log(postList)
    const [searchQuery, setSearchQuery] = useState(""); // 검색어

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const postsPerPage = 9; // 페이지당 표시할 게시물 수

    // 페이지네이션 계산
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    // 검색 필터링
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지에 표시할 게시물

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage); // 전체 페이지 수

    // 좋아요 버튼 근데 페이지 바뀌면 초기화됨 prev 활용하면 될듯?
    const likeButtonClick = (id) =>{
        const updatedPosts = posts.map((post) =>
            post.id === id ? { ...post, like: post.like + 1 } : post
        
        );
        setPosts(updatedPosts);
        
    }

    const handleWriteButton = () =>{
        setPlaceList([]);
        setIsWrite(true)
        navigate("/map")
    }
    // 페이지 이동
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 게시물 상세 페이지로 이동
    const handlePostClick = (id) => {
        navigate(`/postdetail/${id}`);
    };
    
    

    return (
        <div
            style={{
                Width: "800px",
                height: "600px",
                margin: "50px auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h1 style={{ textAlign: "center", fontWeight: "bold" }}>게시물 목록</h1>

            {/* 게시물 목록 */}
            <div style={{ marginTop:"50px", display:'flex' }}>
                {filteredPosts.map((post) => (
                    
                    <div
                        key={post.id}
                        style={{
                            alignItems: "center",
                            marginBottom: "15px",
                            cursor: "pointer",
                        }}
                        
                    >
                        <div>
                        <img
                        onClick={() => handlePostClick(post.id)}
                            src={post.thumbnail}
                            alt="썸네일"
                            style={{
                                width: "180px",
                                height: "180px",
                                marginRight: "60px",
                                borderRadius: "5px",
                            }}
                        >
                            {/* <Link to={`/postDetail/${post.id}`}></Link> */}
                        </img>
                        </div>
                        <div style={{display:"flex"}}>
                            <h3 style={{ margin: 0 }}>{post.title} <span
                                    onClick={() => likeButtonClick(post.id)}
                                    style={{
                                        cursor: "pointer",
                                        color: "red",
                                        marginRight: "10px",
                                    }}
                                >
                                    ❤️
                                </span>
                                {post.like}</h3>
                        </div>
                
            </div>
                ))} 
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
            <div style={{ marginTop: "30px" }}>
                <input
                    type="text"
                    placeholder="게시글 제목 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "16px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                />
            </div>
            <div style={{ display: 1, justifyContent: "space-between" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleWriteButton}
                    sx={{ width: "48%" }}
                >
                    글쓰기
                </Button>
            </div>
        </div>
    );
};

export default Post;