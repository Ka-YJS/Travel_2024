import React, { createContext, useState } from "react";

// ImageContext 생성
export const ImageContext = createContext();

// ImageProvider 작성
export const ImageProvider = ({ children }) => {
  const [copyImage, setCopyImage] = useState([]);

  return (
    <ImageContext.Provider value={{ copyImage, setCopyImage }}>
      {children}
    </ImageContext.Provider>
  );
};
