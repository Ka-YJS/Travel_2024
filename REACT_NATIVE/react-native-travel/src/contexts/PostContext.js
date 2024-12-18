import React, { createContext, useState } from "react";

// PostContext 생성
export const PostContext = createContext();

// PostProvider 작성
export const PostProvider = ({ children }) => {
  const [postList, setPostList] = useState([]);

  return (
    <PostContext.Provider value={{ postList, setPostList }}>
      {children}
    </PostContext.Provider>
  );
};
