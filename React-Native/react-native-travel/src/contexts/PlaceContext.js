import React, { createContext, useState } from "react";

// PlaceContext 생성
export const PlaceContext = createContext();

// PlaceProvider 작성
export const PlaceProvider = ({ children }) => {
  const [placeList, setPlaceList] = useState([]);

  return (
    <PlaceContext.Provider value={{ placeList, setPlaceList }}>
      {children}
    </PlaceContext.Provider>
  );
};
