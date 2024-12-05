import React from "react";

const MyPageButton = () => {
  return (
    <div style={styles.sidebar}>
      <button style={styles.button}>개인정보</button>
      <button style={styles.button}>일정</button>
      <button style={styles.button}>앨범</button>
    </div>
  );
};

const styles = {
  sidebar: {
    display: "flex",
    flexDirection: "column", // 세로 정렬
    alignItems: "center", // 가로 중앙 정렬
    justifyContent: "center", // 세로 중앙 정렬
    position: "absolute", // 페이지 내에서 위치를 고정
    top: "50%", // 페이지 중앙으로
    left: "0", // 왼쪽 정렬
    transform: "translateY(-50%)", // 정확한 수직 중앙 정렬
    width: "400px", // 사이드바 너비
    height: "100%", // 높이 100%로 고정
    backgroundColor: "#f8f9fa", // 연한 배경색
    borderRight: "1px solid #ddd", // 오른쪽 경계선
  },
  button: {
    width: "100%", // 버튼 너비를 100%로 설정
    padding: "10px 20px", // 패딩
    margin: "10px 0", // 버튼 간 간격
    backgroundColor: "#007bff", // 버튼 색상
    color: "white", // 텍스트 색상
    border: "none", // 기본 테두리 제거
    borderRadius: "5px", // 둥근 모서리
    cursor: "pointer", // 마우스 포인터
    textAlign: "center", // 텍스트 정렬
  },
};

export default MyPageButton;
