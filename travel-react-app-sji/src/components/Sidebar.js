import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Side = styled.div`
  display: flex;
  border-right: 1px solid #e0e0e0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20%;
`;

const Profile = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 100%;
`;

const Menu = styled.div`
  margin-top: 30px;
  width: 200px;
  display: flex;
  flex-direction: column;
`;

function Sidebar() {
  const menus = [
    { name: "개인정보", path: "/mypage/personalInfo" },
    { name: "내게시글", path: "/mypage/mypost" },
  ];
  return (
    <Side>
      <Menu>
        {menus.map((menu, index) => {
          return (
            <NavLink
              to={menu.path}
              key={index}
              style={{ color: "gray", textDecoration: "none", padding: "10px" }}
              activeStyle={{ color: "black" }}
            >
              {menu.name}
            </NavLink>
          );
        })}
      </Menu>
    </Side>
  );
}

export default Sidebar;
