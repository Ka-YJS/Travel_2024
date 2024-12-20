import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './User/SignUp';
import Login from './User/Login';
import MainScreen from './pages/MainScreen';

function AppRouter() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/travel/oauth2/google/callback" element={<Login />} />
                    {/* <Route path="/main" element={<MainScreen />} />  메인 페이지 라우트도 필요 */}
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default AppRouter;