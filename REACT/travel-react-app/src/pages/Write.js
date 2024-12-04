import React, { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { UserContext } from "../context/UserContext";
import { PlaceContext } from "../context/PlaceContext";
import { ListContext } from "../context/ListContext";

const Write = () => {
    const { placeList } = useContext(PlaceContext);
    const { user } = useContext(UserContext);
    const { postList, setPostList } = useContext(PostContext);
    const { list } = useContext(ListContext);
    const navigate = useNavigate();

    // 상태 변수
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지
    const [previewPhoto, setPreviewPhoto] = useState(""); // 미리보기 이미지 URL
    const [showImages, setShowImages] = useState([]);


    // // 이미지 업로드 핸들러
    // const handleAddImage = (e) => {
    //     const imageList = e.target.files;
    //     let imageUrlList = [...showImages];

    //     for(i>0; i < imageList.length ; i++)
    // }




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
            const newPost = {
                id: postList.length + 1,
                title: postTitle,
                placeList: list,
                content: postContent,
                thumbnail: previewPhoto || "https://via.placeholder.com/150", // 썸네일로 업로드된 첫 번째 이미지 사용
                like: 0,
            };
            setPostList([...postList, newPost]);
            alert("글이 저장되었습니다!");
            navigate("/PostDetail/" + newPost.id);
        } else {
            alert("제목과 내용을 모두 입력해주세요.");
        }
    };

    // 취소 버튼 핸들러
    const handleCancel = () => {
        setPostTitle("");
        setPostContent("");
        if (window.confirm("글 작성을 취소하시겠습니까?")) {
            alert("글 작성이 취소되었습니다.");
            navigate("/post");
        }
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

            {/* 작성자 표시 */}
            <div style={{ marginBottom: "20px" }}>
                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    label="작성자"
                    fullWidth
                    variant="outlined"
                    value={user[0]?.nickname || "알 수 없는 사용자"}
                />
            </div>

            {/* 여행지 표시 */}
            <div style={{ marginBottom: "20px" }}>
                <TextField
                    inputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                    variant="outlined"
                    label="여행지"
                    value={list.join(", ")}
                    multiline
                    rows={2}
                />
            </div>

            {/* 이미지 업로드 */}
            <div style={{ marginBottom: "20px" }}>
                
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
