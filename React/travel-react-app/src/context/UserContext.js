import {createContext, useState} from "react";
import defaultImage from '../image/defaultImage.png';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [profileImage, setProfileImage] = useState(defaultImage);
  
    return (
      <UserContext.Provider value={{ user, setUser,profileImage,setProfileImage }}>
        {children}
      </UserContext.Provider>
    );
  };