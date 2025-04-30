import React, { createContext, useState } from "react";

// ListContext 생성
export const ListContext = createContext();

// ListProvider 작성
export const ListProvider = ({ children }) => {
  const [list, setList] = useState([]);

  return (
    <ListContext.Provider value={{ list, setList }}>
      {children}
    </ListContext.Provider>
  );
};
