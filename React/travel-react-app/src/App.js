import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screen/HomeScreen";
import MainScreen from "./screen/MainScreen";
import Login from "./Strat/Login";
import Signup from "./Strat/SignUp";
import PostDetail from "./pages/PostDetail";
import PostEdit from "./pages/PostEdit";
import Post from "./pages/Post";
import Map from "./pages/Map";
import Mypage from "./components/Mypage"; // Mypage 추가
import { PostContext } from "./context/PostContext";
import img1 from "./image/bhc.jpg";
import styled from "styled-components";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

function App() {
  const [postList, setPostList] = useState([
    {
      title: "zz",
      content: "zz",
      like: 0,
      thumbnail: `${img1}`,
    },
  ]);

  return (
    <PostContext.Provider value={{ postList, setPostList }}>
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
            <Route path="/mypage/*" element={<Mypage />} /> {/* Mypage 경로 추가 */}
          </Routes>
        </Router>
      </AppWrapper>
    </PostContext.Provider>
  );
}

export default App;
