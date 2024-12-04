import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 예: 토큰 삭제
        localStorage.removeItem('authToken');
        
        // 필요한 추가 로그아웃 로직
        console.log('User logged out successfully.');
        
        // 로그인 페이지로 이동
        navigate('/login');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>Logout</h1>
            <p>로그아웃을 하시겠습니까?</p>
            <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Logout
            </button>
        </div>
    );
};

export default Logout;
