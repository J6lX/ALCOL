import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import HomePage from "./components/home/HomePage";
import LoginPage from "./components/accounts/LoginPage";
import RegisterPage from "./components/accounts/RegisterPage";
import ModifyPage from "./components/accounts/ModifyPage";
import ModeSelectPage from "./components/battle/ModeSelectPage";
import "./App.css";
import profileImg from "./logo.svg";
import Mypage from "./components/mypage/Mypage";
// import Mypage from "./components/mypage/Mypage.js";
import { Breadcrumb, Layout, Menu, Button, theme } from "antd";
import { render } from "@testing-library/react";
const { Header, Content, Footer } = Layout;

// items === 네비게이션 바에 넣을 항목들
const items = ["Problem", "Ranking", "Battle"].map((key) => ({
  key,
  label: `${key}`,
}));

// LoginTag === 로그인 상태 체크용 함수
function LoginTag(props) {
  // isLogin === 로그인 상태 체크
  // 비로그인 상태의 네비게이션 바를 보려면 isLoggedin의 값을 false로 설정하세요.
  const isLoggedin = false;

  // 로그인 한 경우(isLoggedin === true인 경우) 회원 정보 표시
  if (isLoggedin) {
    return (
      <>
        <img
          src={profileImg}
          alt="프사"
          style={{
            width: 50,
            height: 50,
          }}></img>
        <p>동준이다</p>
        <p
          href="#"
          style={{
            color: "#a0a0a0",
            fontSize: 15,
            marginRight: "50px",
          }}>
          로그아웃
        </p>
      </>
    );
    // 로그인 정보가 없는 경우 로그인 및 회원가입 버튼 표시
  } else {
    return (
      <>
        <Button type="primary">LOGIN</Button>
        <p>Signup</p>
      </>
    );
  }
}

function App() {
  return (
    <Layout>
      {/* 헤더 */}
      <Header className="navbar">
        <div className="logo" />
        {/* 메뉴(Problem, Ranking, Battle) */}
        <Menu
          mode="horizontal"
          defaultOpenKeys={["sub1"]}
          theme="dark"
          className="navContent"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
          items={items}
        />
        {/* 로그인 여부에 따라 프로필 또는 로그인 버튼 표시 */}
        <LoginTag />
      </Header>
      {/* 본문(임시) */}
      <Content
        style={{
          backgroundColor: "#16171B",
        }}>
        {/* 본문 자리 임시용 데이터 */}
        <h1>본문 들어갈 부분(임시)</h1>
        {/* 라우터 태그 목록 */}
        <Routes>
          <Route exact path="/" element={HomePage()} />
          <Route exact path="/login" element={LoginPage()} />
          <Route path="/mode" element={<ModeSelectPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/modify" element={<ModifyPage />} />
          <Route path="/mypage" exact={true} element={<Mypage />}></Route>

          {/* <Route exact path="/register" element={RegisterPage()} /> */}
        </Routes>
      </Content>
      {/* 푸터 */}
      <footer className="footer">
        <h2 className="J6IX">J6IX</h2>
        <p className="textDark">이용약관</p>
        <p className="textDark">개인정보 처리방침</p>
        <p className="textDark">쿠키 설정</p>
      </footer>
    </Layout>
  );
}

export default App;
