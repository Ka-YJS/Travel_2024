import React, { createContext, useContext, useState } from "react";
import axios from "axios"; // axios 임포트
import { UserContext } from "./UserContext";

// PostContext 생성
export const PostContext = createContext();

// PostProvider 작성
export const PostProvider = ({ children }) => {
  const [postList, setPostList] = useState([]);
  const {user} = useContext(UserContext);

// 게시글 삭제 함수
const deletePost = async (id) => {
  console.log(user)
  try {
    // axios를 사용하여 백엔드에 DELETE 요청을 보냄
    const response = await axios.delete(`http://192.168.3.25:9090/api/postDelete/${id}`, { 
      headers: { 
        'Authorization': `Bearer ${user.token}`
      }
    });
    
    if (response.status === 200) {
      // 성공적으로 삭제된 경우, 로컬 postList에서 삭제된 게시물 제거
      setPostList((prevPostList) => prevPostList.filter((post) => post.postId !== id));
    } else {
      throw new Error("삭제 실패");
    }
  } catch (error) {
    console.error("게시물 삭제 오류:", error);
  }

};

return (
  <PostContext.Provider value={{ postList, setPostList, deletePost }}>
    {children}
  </PostContext.Provider>
);
};