import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import HomePage from "./components/home/HomePage";
import LoginPage from "./components/accounts/LoginPage";
import RegisterPage from "./components/accounts/RegisterPage";
import ModifyPage from "./components/accounts/ModifyPage";
import ModeSelectPage from "./components/battle/ModeSelectPage";
import MatchingPage from "./components/battle/MatchingPage";
import BanPage from "./components/battle/BanPage";
import "./App.css";
import Mypage from "./components/mypage/Mypage";
// import Mypage from "./components/mypage/Mypage.js";
import NotFound404 from "./components/NotFound404";

import { Layout, Menu, Button, Row, Col, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { render } from "@testing-library/react";
const { Header, Content } = Layout;

// items === 네비게이션 바에 넣을 항목들
const items = ["Problem", "Ranking", "Battle"].map((key) => ({
  key,
  label: `${key}`,
}));

// LoginTag === 로그인 상태에 따라 헤더 우측에 표시할 데이터를 결정하는 함수
function LoginTag(props) {
  // isLoggedIn === 로그인 상태 체크
  const isLoggedIn = false;

  // 로그인 한 경우(isLoggedin === true인 경우) 회원 정보 표시
  if (isLoggedIn) {
    return (
      <Space align="center" wrap>
        <Avatar size={44} icon={<UserOutlined />} />
        <p className="text">동준이다</p>
        <p
          href="#"
          style={{
            color: "#a0a0a0",
            fontSize: 15,
            marginRight: "50px",
          }}>
          Logout
        </p>
      </Space>
    );
    // 로그인 정보가 없는 경우 로그인 및 회원가입 버튼 표시
  } else {
    return (
      <Space align="center">
        <Button type="link" className="signUpButton">
          LOGIN
        </Button>
        <p className="text">Signup</p>
      </Space>
    );
  }
}

function App() {
  return (
    <Layout>
      {/* 헤더(상단 네비게이션 바) */}
      <Header>
        <Row gutter={16} align="top" justify="space-between">
          {/* 로고 표시 구역 */}
          <Col sm={4} justify="center">
            <div className="logo" />
          </Col>

          {/* 메뉴(Problem, Ranking, Battle) */}
          <Col xs={0} sm={6} md={8} lg={11} xl={12}>
            <Menu
              mode="horizontal"
              defaultOpenKeys={["sub1"]}
              theme="dark"
              className="navContent"
              style={{
                position: "sticky",
                display: "flex",
                justifyContent: "center",
              }}
              items={items}
            />
          </Col>

          {/* 로그인 여부에 따라 프로필 또는 로그인 버튼 표시 */}
          <Col
            style={{
              justifyContent: "center",
            }}>
            <LoginTag />
          </Col>
        </Row>
      </Header>
      {/* 본문(임시) */}
      <Content
        style={{
          backgroundColor: "#16171B",
        }}>
        {/* 라우터 태그 목록 */}
        <Routes>
          {/* 메인 페이지 */}
          <Route exact path="/" element={HomePage()} />

          {/* 로그인 페이지 */}
          <Route exact path="/login" element={LoginPage()} />

          {/* 모드 선택 페이지 */}
          <Route path="/mode" element={<ModeSelectPage />} />

          {/* 매칭 페이지 */}
          <Route path="/match" element={<MatchingPage />} />

          {/* 밴픽 페이지 */}
          <Route path="/ban" element={<BanPage />} />

          {/* 회원가입 페이지 */}
          <Route path="/register" exact={true} element={<RegisterPage />} />

          {/* 회원정보 수정 페이지 */}
          <Route path="/modify" exact={true} element={<ModifyPage />} />

          {/* 마이페이지(사용자 정보 열람 페이지) */}
          <Route path="/:username" exact={true} element={<Mypage />} />

          {/* 404 페이지 */}
          <Route path="*" element={<NotFound404 />} />
          {/* <Route exact path="/register" element={RegisterPage()} /> */}
        </Routes>
      </Content>
      {/* 푸터 */}
      <footer className="footer">
        <h2 className="J6IX">J6IX</h2>
        <h3 className="textDark">SSAFY 공통 프로젝트</h3>
        <p className="textDark">이용약관</p>
        <p className="textDark">개인정보 처리방침</p>
        <p className="textDark">쿠키 설정</p>
        <p></p>
      </footer>
    </Layout>
  );
}

export default App;
