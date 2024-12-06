import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screen/HomeScreen";
import MainScreen from "./screen/MainScreen";
import Login from "./Strat/Login";
import Signup from "./Strat/SignUp";
import PostDetail from "./pages/PostDetail";
import PostEdit from "./pages/PostEdit";
import Post from "./pages/Post";
import Map from "./pages/Map";
import MyPage from "./components/MyPage"; // Mypage 추가
import { PostContext } from "./context/PostContext";
import { UserContext } from "./context/UserContext";
import {PlaceContext} from "./context/PlaceContext";
import { isWriteContext } from "./context/isWriteContext";
import img1 from "./image/bhc.jpg";
import styled from "styled-components";
import defaultImage from './image/defaultImage.png'

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

  


function App() {
  const [placeList, setPlaceList] = useState([]);

  const [postList, setPostList] = useState([
    {
      title: "",
      content: "",
      placeList:[],
      like: 0,
      thumbnail: `${img1}`,
    },
  ]);

  const [user, setUser] = useState(() => {
    // 새로고침 시 로컬 스토리지에서 사용자 정보 복원
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [isWrite, setIsWrite] = useState(true)

  useEffect(() => {
    // user 상태가 변경될 때 로컬 스토리지에 저장
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{user,setUser ,profileImage, setProfileImage }}>
      <PostContext.Provider value={{ postList, setPostList }}>
          <PlaceContext.Provider value={{placeList, setPlaceList}}>
            <isWriteContext.Provider value={{isWrite, setIsWrite}}>
              <AppWrapper>
                <Router>
                  <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/main" element={<MainScreen />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="postdetail/:id" element={<PostDetail />} />
                    <Route path="post" element={<Post />} />
                    <Route path="postedit/:id" element={<PostEdit />} />
                    <Route path="map" element={<Map />} />
                    <Route path="/mypage/*" element={<MyPage />} /> {/* Mypage 경로 추가 */}
                  </Routes>
                </Router>
              </AppWrapper>
          </isWriteContext.Provider>
        </PlaceContext.Provider>
      </PostContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
