import React, { useState, useContext, useEffect} from 'react';
import { UserContext } from "../context/UserContext";
import axios from 'axios';

const UploadProfileImage = () => {  // 컴포넌트 이름을 대문자로 시작
  const [file, setFile] = useState(null);  // 업로드할 파일 상태
  const [error, setError] = useState(null);  // 에러 상태
  const { user,setUser } = useContext(UserContext);

  // 파일 선택 처리
  const handleFileChanges = (e) => {
    setFile(e.target.files[0]);
  };

  // 파일 업로드 처리
  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);
    if (!file) {
      setError('파일을 선택해 주세요.');
      return;
    }

    // FormData 객체를 사용해 파일과 기타 데이터를 전송
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 백엔드에 프로필 사진을 업로드
      const response = await axios.patch(`http://localhost:9090/travel/userProfileImageEdit/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 성공적으로 업로드되면 사용자 정보 업데이트
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('파일 업로드 실패:', err);
      setError('파일 업로드에 실패했습니다.');
    }
  };

  useEffect(()=>{},[user])

  return (
    <div>
      <h2>프로필 사진 수정</h2>

      {user && (
        <div>
          <h3>업데이트된 사용자 정보</h3>
          <p>이름: {user.userName}</p>
          <p>프로필 이미지: <img src={user.userProfileImage} alt="Profile" width="100" /></p>
        </div>
      )}

      <div>
        <input type="file" onChange={handleFileChange} />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UploadProfileImage;