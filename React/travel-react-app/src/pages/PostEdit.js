import React, { useContext, useState } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../context/PostContext";

const PostEdit = () => {
    const {id} = useParams();

    const {postList, setPostList} = useContext(PostContext);
    console.log(postList[0])
    const postId = id - 1
    const navigate = useNavigate()

    const [photo, setPhoto] = useState("")
    const [titleEdit, setTitleEdit] = useState("");
    const [contentEdit, setContentEdit] = useState("");
    
    

    

    const handleTitleChange = (e) => {
        const copyPostList = [...postList];
        copyPostList[postId].title = e.target.value;
        setPostList(copyPostList);
    };
    const handleContentChange = (e) => {
        const copyPostList = [...postList];
        copyPostList[postId].content = e.target.value;
        setContentEdit(copyPostList);
    };

    const handleSave = () => {
        
        if (postList[postId].title && postList[postId].content) {
            console.log("저장 완료:");
            alert("글이 저장되었습니다!");
            navigate(`/PostDetail/${id}`)
        } else {
            alert("제목과 내용을 모두 입력해주세요.");
        }
    };

    const handleCancel = () => {
        const confirmText = window.confirm("글 작성을 취소하시겠습니까?");
        if (confirmText == true) {
            alert("글 작성이 취소되었습니다.")
            navigate("/post")
        }else{
            alert("글 작성을 계속하세요")
        }
    };

    return (
        <div 
            sx={{
                maxWidth: "600px",
                margin: "50px auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
            }}
        >
            <h1 
                variant="h5" 
                style={{ marginBottom: "20px", fontWeight: "bold", textAlign: "center" }}
            >
                글쓰기
            </h1>

            <div style={{ marginBottom: "20px" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="제목"
                    value={postList[postId].title}
                    onChange={handleTitleChange}
                    placeholder="제목을 입력하세요."
                />
            </div>
            <div>
                <p>사진, 동영상, 글씨포인트 등 api 추가예정</p>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="내용"
                    value={postList[postId].content}
                    onChange={handleContentChange}
                    placeholder="내용을 입력하세요."
                    multiline
                    rows={8}
                />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ width: "48%" }}
                >
                    저장
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                    sx={{ width: "48%" }}
                >
                    취소
                </Button>
            </div>
        </div>
    );
};

export default PostEdit;