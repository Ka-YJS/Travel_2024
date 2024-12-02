import React, { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";

const Write = () => {
    const { postList, setPostList } = useContext(PostContext);
    const navigate = useNavigate();

    // 새로운 게시글의 제목과 내용 상태
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");

    // 제목 변경 핸들러
    const handleTitleChange = (e) => {
        setPostTitle(e.target.value);
    };

    // 내용 변경 핸들러
    const handleContentChange = (e) => {
        setPostContent(e.target.value);
    };

    // 저장 버튼 핸들러
    const handleSave = () => {
        if (postTitle && postContent) {
            // 새 게시글 추가
            const newPost = {
                id: postList.length + 1, // 고유 ID 생성
                title: postTitle,
                content: postContent,
                thumbnail: "https://via.placeholder.com/150", // 기본 썸네일
                like: 0, // 초기 좋아요 수
            };
            setPostList([...postList, newPost]); // 상태 업데이트
            alert("글이 저장되었습니다!");
            navigate("/PostDetail/" + newPost.id); // 상세 페이지로 이동
        } else {
            alert("제목과 내용을 모두 입력해주세요.");
        }
    };

    // 취소 버튼 핸들러
    const handleCancel = () => {
        setPostTitle("");
        setPostContent("");
        alert("글 작성이 취소되었습니다.");
        navigate("/Post");
    };

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "50px auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h1
                style={{
                    marginBottom: "20px",
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                글쓰기
            </h1>

            {/* 제목 입력 */}
            <div style={{ marginBottom: "20px" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="제목"
                    value={postTitle}
                    onChange={handleTitleChange}
                    placeholder="제목을 입력하세요."
                />
            </div>

            {/* 안내 메시지 */}
            <div>
                <p>사진, 동영상, 글씨포인트 등 API 추가 예정</p>
            </div>

            {/* 내용 입력 */}
            <div style={{ marginBottom: "20px" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="내용"
                    value={postContent}
                    onChange={handleContentChange}
                    placeholder="내용을 입력하세요."
                    multiline
                    rows={8}
                />
            </div>

            {/* 버튼들 */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    style={{ width: "48%" }}
                >
                    저장
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                    style={{ width: "48%" }}
                >
                    취소
                </Button>
            </div>
        </div>
    );
};

export default Write;
