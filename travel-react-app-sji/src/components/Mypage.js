import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import PersonalInfo from "./PersonalInfo";
import MyPost from "./MyPost";
import styled from "styled-components";

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const Mypage = () => {
  return (
    <ContentWrapper>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="personalInfo" element={<PersonalInfo />} />
          <Route path="mypost" element={<MyPost />} />
        </Routes>
      </div>
    </ContentWrapper>
  );
};

export default Mypage;
