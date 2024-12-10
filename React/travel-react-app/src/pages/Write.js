import React, { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { UserContext } from "../context/UserContext";
import { PlaceContext } from "../context/PlaceContext";
import { ListContext } from "../context/ListContext";
import { Delete } from "@mui/icons-material";
import { ImageContext } from "../context/ImageContext";
import { CopyListContext } from "../context/CopyListContext";
import '../css/Map.css';  // Map.css 파일을 import

const Write = () => {
    const { placeList, setPlaceList } = useContext(PlaceContext);
    const { user } = useContext(UserContext);
    const { postList, setPostList } = useContext(PostContext);
    const {copyList,setCopyList} = useContext(CopyListContext);
    const { list, setList } = useContext(ListContext);
    const {copyImage, setCopyImage} = useContext(ImageContext);
    const navigate = useNavigate();

    // 상태 변수
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [previewPhoto, setPreviewPhoto] = useState(""); // 미리보기 이미지 URL
    const [showImages, setShowImages] = useState([]);


    // 이미지 업로드 핸들러
    const handleAddImage = (e) => {
        const imageList = e.target.files;
        let imageUrlList = [...showImages];
        
        for(let i = 0; i < imageList.length ; i++){
            const currentImageUrl = URL.createObjectURL(imageList[i]);
            imageUrlList.push(currentImageUrl);
        }
        if (imageUrlList.length > 10) {
            imageUrlList = imageUrlList.slice(0, 10);
        }
        setShowImages(imageUrlList);
        setPreviewPhoto(imageUrlList[0])
        setCopyImage(imageUrlList);
        console.log(copyImage)
    }
    const handleDeleteImage = (id) => {
        setShowImages(showImages.filter((_, index)=>index !== id));
    }

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
                placeList: placeList,
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
        setCopyList(placeList);
  
        console.log(`copyList: ${copyList}\n placeList: ${placeList} \n list: ${list}`)
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
        <div className="write">
            <div className="write_h1">
                <h1>글쓰기</h1>
            </div>

            {/* 제목 입력 */}
            <div>
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
            <div>
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
            <div>
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

            {/* 내용 입력 */}
            <div>
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

            {/* 이미지 업로드 */}
            <div className="photo_style">
                <label htmlFor="input-file" className="input-file-label">
                    <input type="file" accept=".png, .jpg, .jpeg, .gif" id="input-file" multiple onChange={handleAddImage} />
                    <span>사진추가</span>
                </label>

                {/* 저장해둔 이미지들을 순회하면서 화면에 이미지 출력 */}
                <div className="image-grid">
                    {showImages.map((image, id) => (
                        <div key={id}>
                            <img src={image} alt={`${image}-${id}`} />
                            <Delete onClick={() => handleDeleteImage(id)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* 버튼들 */}
            <div className="write-buttons">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    저장
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                >
                    취소
                </Button>
            </div>
        </div>
    );
};

export default Write;
