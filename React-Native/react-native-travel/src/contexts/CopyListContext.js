import React, { createContext, useState } from "react";

// Context 생성
export const CopyListContext = createContext();

// Provider 컴포넌트 작성
export const CopyListProvider = ({ children }) => {
  // 초기 상태 정의
  const [copyList, setCopyList] = useState([]);

  return (
    <CopyListContext.Provider value={{ copyList, setCopyList }}>
      {children}
    </CopyListContext.Provider>
  );
};
