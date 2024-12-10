import React, { useContext } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { UserContext } from "../context/UserContext";
import { PlaceContext } from "../context/PlaceContext";
import { ListContext } from "../context/ListContext";
import { ImageContext } from "../context/ImageContext";
import TopIcon from "../TopIcon/TopIcon"

const PostDetail = () => {
    const { postList, setPostList } = useContext(PostContext); // 게시글 데이터
    const {placeList, setPlaceList} = useContext(PlaceContext);
    const { user } = useContext(UserContext); // 사용자 데이터
    const {list} = useContext(ListContext);
    const {copyImage} = useContext(ImageContext);

    const { id } = useParams(); // URL에서 게시글 ID 추출
    const postId = Number(id) - 1; // 배열 인덱스 계산
    const navigate = useNavigate();
    
    // 게시글이 존재하지 않을 경우 처리
    if (!postList[postId]) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <h2>잘못된 경로입니다.</h2>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/Post")}
                >
                    게시글 목록으로 이동
                </Button>
            </div>
        );
    }

    const post = postList[postId]; // 현재 게시글 데이터

    // 목록 버튼 클릭
    const listButtonClick = () => {
        navigate("/Post");
    };

    // 수정 버튼 클릭
    const toPostEdit = () => {
        navigate(`/postedit/${id}`);
    };

    return (
        <div>
            <div style={{}}>
               <TopIcon /> 
            </div>
            <h1
                style={{
                    marginBottom: "20px",
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                게시글 보기
            </h1>
            <div style={{position:"relative", zIndex:"-1"}}>
                <div>
                    <TextField style={{ marginBottom: "20px" }}
                        InputProps={{
                            readOnly: true,
                        }}
                        value={post.title}
                        fullWidth
                        variant="outlined"
                        label="제목"
                        placeholder="제목"
                    />
                </div>

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

                <div style={{ marginBottom: "20px" }}>
                    <TextField
                        inputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        variant="outlined"
                        label="여행지"
                        value={post.placeList?.join(", ") || "등록된 여행지가 없습니다."}
                        multiline
                        rows={2}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <TextField
                        InputProps={{
                            readOnly: true,
                        }}
                        value={post.content}
                        fullWidth
                        variant="outlined"
                        label="내용"
                        placeholder="내용"
                        multiline
                        rows={8}
                    />
                </div>
                <div style={{
                    display:"grid",
                    gridTemplateColumns:"repeat(3, 1fr)",
                    gap: "10px",
                    marginTop: "20px"
                    }}>
                {copyImage.map((image, id) => (
                    <div key={id} style={{
                        display:"flex", 
                        justifyContent:"center",
                        alignItems:"center",
                        border: "1px solid #ddd", // 테두리 추가 (선택 사항)
                        borderRadius: "5px", // 모서리 둥글게
                        overflow: "hidden", // 이미지가 영역을 벗어나지 않도록 처리
                        backgroundColor: "#f9f9f9", // 배경색 추가 (선택 사항)
                        }}>
                        <img src={image} alt={`${image}-${id}`}
                            style={{
                                height:"20vh",
                                width: "20vw",
                                padding: 0,
                                margin: 0,
                            }}
                        />
                    </div>
                ))}
                </div>
            </div>

            {/* 버튼 영역 */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={listButtonClick}
                    style={{ width: "10%" }}
                >
                    목록
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={toPostEdit}
                    style={{ width: "10%" }}
                >
                    수정
                </Button>
            </div>
        </div>
    );
};

export default PostDetail;
