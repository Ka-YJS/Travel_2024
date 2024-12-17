import React, { useContext, useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ListContext } from "../context/ListContext";
import { UserContext } from "../context/UserContext";
import TopIcon from "../TopIcon/TopIcon";

const PostEdit = () => {
    const { user } = useContext(UserContext);
    const { list, setList } = useContext(ListContext);
    const [placeList, setPlaceList] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]); 
    const [previewUrls, setPreviewUrls] = useState([]); 
    const [existingImageUrls, setExistingImageUrls] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams(); // URL에서 게시글 ID 가져오기

    // 게시글 데이터 불러오기
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/api/posts/postDetail/${id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                
                const postData = response.data.data[0];
                setPostTitle(postData.postTitle);
                setPostContent(postData.postContent);
                setExistingImageUrls(postData.imageUrls || []);
                
                // 여행지 리스트 설정
                if (postData.placeList) {
                    setPlaceList(postData.placeList);
                    console.log(postData.placeList)
                    
                }
            } catch (error) {
                console.error("게시글 정보 불러오기 실패:", error);
                alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchPostDetails();
    }, [id, user.token, setList]);

    // 파일 추가 핸들러
    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        
        // 10개 이미지 제한 (기존 이미지 + 새 이미지)
        if (existingImageUrls.length + selectedFiles.length + files.length > 10) {
            alert("최대 10개의 이미지만 업로드 가능합니다.");
            return;
        }

        // 파일 정보와 미리보기 URL 설정
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviews]);
    };

    // 이미지 삭제 핸들러
    const handleDeleteImage = (index, isExisting = false) => {
        if (isExisting) {
            // 기존 이미지 삭제
            setExistingImageUrls((prevUrls) => 
                prevUrls.filter((_, idx) => idx !== index)
            );
        } else {
            // 새로 추가된 이미지 삭제
            setSelectedFiles((prevFiles) => 
                prevFiles.filter((_, idx) => idx !== index)
            );
            setPreviewUrls((prevUrls) => 
                prevUrls.filter((_, idx) => idx !== index)
            );
        }
    };

    // 저장 버튼 핸들러
    const handleSave = async () => {
        if (!postTitle || !postContent) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        // 허용된 파일 확장자 검사
        const allowedExtensions = ["png", "jpg", "jpeg", "gif"];
        const invalidFiles = selectedFiles.filter(
            (file) => !allowedExtensions.includes(file.name.split('.').pop().toLowerCase())
        );

        if (invalidFiles.length > 0) {
            alert("허용되지 않은 파일 형식이 포함되어 있습니다.");
            return;
        }

        // FormData 생성 및 전송
        const formData = new FormData();
        formData.append("postTitle", postTitle);
        formData.append("postContent", postContent);
        formData.append("userNickName", user.userNickName);
        formData.append("placeList", list?.join(", ") || ""); // 빈 문자열로 기본값 설정
        
        formData.append("existingImageUrls", JSON.stringify(existingImageUrls));


        // 새 파일 추가
        selectedFiles.forEach((file) => formData.append("files", file));

        // FormData 디버깅
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await axios.put(`http://localhost:9090/api/posts/postEdit/${id}`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${user.token}`
                },
            });

            alert("글이 수정되었습니다!");
            navigate(`/PostDetail/${id}`);
        } catch (error) {
            console.error("Error updating post:", error.response?.data || error.message);
            alert(
                `수정 중 오류가 발생했습니다: ${
            error.response?.data?.message || "서버와의 통신에 실패했습니다."
        }`
    )
    };
}

    return (
        <div className="post-edit">
            <div>
                <TopIcon />
            </div>
            <h1>글 수정</h1>

            {/* 제목 입력 */}
            <TextField
                fullWidth
                variant="outlined"
                label="제목"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="제목을 입력하세요."
                style={{ marginBottom: "20px" }}
            />

            {/* 작성자 표시 */}
            <TextField
                InputProps={{ readOnly: true }}
                label="작성자"
                fullWidth
                variant="outlined"
                value={user.userNickName || "알 수 없는 사용자"}
                style={{ marginBottom: "20px" }}
            />

            {/* 여행지 표시 */}
            <TextField
                inputProps={{ readOnly: true }}
                fullWidth
                variant="outlined"
                label="여행지"
                value={list.join(", ")}
                multiline
                rows={2}
                style={{ marginBottom: "20px" }}
            />

            {/* 내용 입력 */}
            <TextField
                fullWidth
                variant="outlined"
                label="내용"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="내용을 입력하세요."
                multiline
                rows={8}
                style={{ marginBottom: "20px" }}
            />

            {/* 이미지 업로드 */}
            <div className="photo_style">
                <label htmlFor="input-file" className="input-file-label">
                    <input
                        type="file"
                        accept=".png, .jpg, .jpeg, .gif"
                        id="input-file"
                        multiple
                        onChange={handleAddImages}
                    />
                    <span>사진 추가</span>
                </label>

                {/* 기존 이미지 미리보기 */}
                <div className="image-grid">
                    {existingImageUrls.map((url, index) => (
                        <div key={`existing-${index}`} style={{ position: "relative" }}>
                            <img 
                                src={url} 
                                alt={`existing-${index}`} 
                                style={{ width: "150px", height: "150px", objectFit: "cover" }} 
                            />
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={() => handleDeleteImage(index, true)}
                            >
                                삭제
                            </Button>
                        </div>
                    ))}

                    {/* 새로 추가된 이미지 미리보기 */}
                    {previewUrls.map((url, index) => (
                        <div key={`new-${index}`} style={{ position: "relative" }}>
                            <img 
                                src={url} 
                                alt={`preview-${index}`} 
                                style={{ width: "150px", height: "150px", objectFit: "cover" }} 
                            />
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={() => handleDeleteImage(index)}
                            >
                                삭제
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 버튼 */}
            <div className="edit-buttons">
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave} 
                    style={{ marginRight: "10px" }}
                >
                    수정
                </Button>
                <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => navigate(`/PostDetail/${id}`)}
                >
                    취소
                </Button>
            </div>
        </div>
    );
};

export default PostEdit;