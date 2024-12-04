import React, { useContext } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { PlaceContext } from "../context/PlaceContext";
import { ListContext } from "../context/ListContext";

const PostEdit = () => {
    const { id } = useParams();
    const { postList, setPostList } = useContext(PostContext);
    const { placeList } = useContext(PlaceContext);
    const { list } = useContext(ListContext);
    const postId = id - 1; // 배열 인덱스 계산
    const navigate = useNavigate();

    // 게시글 데이터 확인
    if (!postList[postId]) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <h2>잘못된 경로입니다.</h2>
                <Button variant="contained" color="primary" onClick={() => navigate("/post")}>
                    게시글 목록으로 이동
                </Button>
            </div>
        );
    }

    // 제목 변경
    const handleTitleChange = (e) => {
        const copyPostList = [...postList];
        copyPostList[postId].title = e.target.value.trim(); // 공백 제거
        setPostList(copyPostList);
    };

    // 내용 변경
    const handleContentChange = (e) => {
        const copyPostList = [...postList];
        copyPostList[postId].content = e.target.value.trim(); // 공백 제거
        setPostList(copyPostList);
    };


    // 저장 버튼 클릭
    const handleSave = () => {
        const { title, content } = postList[postId];
        console.log("list: "+ list + "placeList: " +  placeList)
        if (!title || !content ) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
            }
        
            const updatedPost = {
                ...postList[postId],
                placeList: [...list], // ListContext에서 추가된 장소를 저장
            };
        
            const updatedPostList = [...postList];
            updatedPostList[postId] = updatedPost; // 게시글 업데이트
            setPostList(updatedPostList); // 상태 업데이트
        
            alert("글이 저장되었습니다!");
            navigate(`/PostDetail/${id}`);
        };
            

    // 취소 버튼 클릭
    const handleCancel = () => {
        const confirmText = window.confirm("글 작성을 취소하시겠습니까?");
        if (confirmText) {
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
                수정하기
            </h1>

            {/* 텍스트 입력 영역 */}

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
                <p>사진, 동영상, 글씨포인트 등 추가 예정</p>
                <div style={{ marginBottom: "20px" }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="여행지"
                        value={ list.join(", ") }
                        multiline
                        rows={2}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
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

export default PostEdit;
