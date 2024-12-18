import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import HomeScreen from "./pages/HomeScreen";
import MainScreen from "./pages/MainScreen";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import PostDetail from "./pages/PostDetail";
import Post from "./pages/Post";
import Map from "./pages/Map";
import MyPage from "./pages/MyPage";
import { PostContext } from "./context/PostContext";
import { UserContext } from "./context/UserContext";
import { PlaceContext } from "./context/PlaceContext";
import img1 from "./image/bhc.jpg";
import MapEdit from "./pages/MapEdit";
import { ListContext } from "./context/ListContext";
import { ImageContext } from "./context/ImageContext";
import { CopyListContext } from "./context/CopyListContext";
import Logo from './pages/Logo';

// OAuth 콜백을 처리하는 컴포넌트
const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  
    useEffect(() => {
      // 구글 로그인 후 리다이렉트된 URL에서 credential 파라미터 추출
      const urlParams = new URLSearchParams(window.location.search);
      const credential = urlParams.get('credential');
      
      if (credential) {
        console.log("Credential received:", credential);
        
        axios.post("http://localhost:9090/travel/oauth2/google/callback", 
          { credential: credential },  // credential을 body에 포함
          {
            headers: {
              'Content-Type': 'application/json'
            }
            // Authorization 헤더 제거 (아직 token이 없으므로)
          }
        )
        .then(response => {
          const token = response.data;  // 백엔드에서 반환된 토큰
          localStorage.setItem("token", token);
          return axios.get("/api/user", {  // 사용자 정보 요청
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        })
        .then(userResponse => {
          localStorage.setItem("user", JSON.stringify(userResponse.data));
          window.location.href = "/main";
        })
        .catch(error => {
          console.error("Error during authentication:", error);
          window.location.href = "/login";
        });
      }
    }, []);

    return <div>구글 로그인 처리 중...</div>;
  };

function App() {
  const [placeList, setPlaceList] = useState([]);
  const [list, setList] = useState([]);
  const [copyList, setCopyList] = useState([]);
  const [copyImage, setCopyImage] = useState([]);
  const [postList, setPostList] = useState([
    {
      title: "",
      content: "",
      placeList: [],
      like: 0,
      thumbnail: `${img1}`,
    },
  ]);
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <PostContext.Provider value={{ postList, setPostList }}>
        <PlaceContext.Provider value={{ placeList, setPlaceList }}>
          <ListContext.Provider value={{ list, setList }}>
            <ImageContext.Provider value={{ copyImage, setCopyImage }}>
              <CopyListContext.Provider value={{ copyList, setCopyList }}>
                <div className="AppWrapper">
                  <Router>
                    <Logo />
                    <Routes>
                      <Route path="/" element={<HomeScreen />} />
                      <Route path="/main" element={<MainScreen />} />
                      <Route path="/login" element={<Login />} />
                      <Route 
                        path="/travel/oauth2/google/callback" 
                        element={<OAuth2RedirectHandler />}
                      />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="postdetail/:id" element={<PostDetail />} />
                      <Route path="post" element={<Post />} />
                      <Route path="postEdit/:id" element={<MapEdit />} />
                      <Route path="map" element={<Map />} />
                      <Route path="/mypage/*" element={<MyPage />} />
                    </Routes>
                  </Router>
                </div>
              </CopyListContext.Provider>
            </ImageContext.Provider>
          </ListContext.Provider>
        </PlaceContext.Provider>
      </PostContext.Provider>
    </UserContext.Provider>
  );
}

export default App;