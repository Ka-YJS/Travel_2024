import React, { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { UserContext } from "../context/UserContext";
import { PlaceContext } from "../context/PlaceContext";


const Write = ({List}) => {
    const {placeList, setPlaceList} = useContext(PlaceContext)
    const { user } = useContext(UserContext)
    const { postList, setPostList } = useContext(PostContext);
    
    const navigate = useNavigate();
    console.log("List: "+List)

    
   
    // 새로운 게시글의 제목과 내용 상태
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");

    console.log(List)
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
                placeList: List,
                content: postContent,
                thumbnail: "https://via.placeholder.com/150", // 기본 썸네일
                like: 0, // 초기 좋아요 수
            };
            setPostList([...postList, newPost]); // 상태 업데이트
            setPlaceList([])
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
        const confirmText = window.confirm("글 작성을 취소하시겠습니까?");
        if (confirmText == true) {
            alert("글 작성이 취소되었습니다.")
            navigate("/post")
        }else{
            alert("글 작성을 계속하세요")
        }
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
            <div style={{ marginBottom: "20px" }}>
                <TextField
                InputProps={{
                    readOnly: true
                }}
                    lable= "작성자"
                    fullWidth
                    variant="outlined"
                    value={user[0]?.userNickname}
/>

            </div>

            {/* 안내 메시지 */}
            <div>
                <p>사진, 동영상, 글씨포인트 등 API 추가 예정</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <TextField
                    inputProps={{
                        readOnly: true
                    }}
                    fullWidth
                    variant="outlined"
                    label="여행지"
                    value={List}
                    multiline
                    rows={4}
                />
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
