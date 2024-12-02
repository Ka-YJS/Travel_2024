import React, { useContext, useState } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../context/PostContext";

const PostDetail = () => {

    const {id} = useParams();
    const postId = id -1;
    console.log(id)
    const navigate = useNavigate();
    const {postList} = useContext(PostContext);
    const [posts,setPosts] = useState({...postList});

    
    console.log(posts)
    console.log(posts[1].id)
    const listButtonClick = () => {
        navigate("/Post");
    }
    const toPostEdit = () => {
        navigate(`/postedit/${id}`);
    }
    return (
        <div>
            <h1 
                variant="h5" 
                style={{ marginBottom: "20px", fontWeight: "bold", textAlign: "center" }}
            >
                게시글 보기
            </h1>
            <div>
                {posts[postId].id == id ? 
                <><div style={{ marginBottom: "20px" }}>
                        <TextField
                            InputProps={{
                                readOnly: true
                            }}
                            value={postList[postId].title}
                            
                            fullWidth
                            variant="outlined"
                            label="제목"
                            placeholder="제목." />
                    </div><div style={{ marginBottom: "20px" }}>
                            <TextField
                                InputProps={{
                                    readOnly: true
                                }}
                                value={postList[postId].content}
                                fullWidth
                                variant="outlined"
                                label="내용"
                                placeholder="내용"
                                multiline
                                rows={8} />
                        </div></>
                 : alert("잘못된 경로입니다")}
            </div>
                
            

            <div style={{ display: "flex", justifyContent: "end" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={listButtonClick}
                    style={{ width: "10%", alignItems:''}}
                >
                    목록
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={toPostEdit}
                    style={{ width: "10%", alignItems: 'center', justifyContent: 'center' }}
                >
                    수정
                </Button>
            </div>
        </div>
    );
};

export default PostDetail;