import React from "react";
import { Link, Route, Routes } from "react-router-dom";

import HomePage from "./components/home/HomePage";
import LoginPage from "./components/accounts/LoginPage";
import RegisterPage from "./components/accounts/RegisterPage";
import ModifyPage from "./components/accounts/ModifyPage";
import ModeSelectPage from "./components/battle/ModeSelectPage";
import MatchingPage from "./components/battle/MatchingPage";
import BanPage from "./components/battle/BanPage";
import ResultPage from "./components/battle/ResultPage";
import "./App.css";
import Mypage from "./components/mypage/Mypage";
import NotFound404 from "./components/NotFound404";
import Ranking from "./components/mypage/Ranking";
import LastSeason from "./components/mypage/LastSeason";

import alcol from "../src/assets/alcol_empty_white.png";

import { Layout, Button, Row, Col, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
// import { render } from "@testing-library/react";
const { Header, Content } = Layout;

// LoginTag === 로그인 상태에 따라 헤더 우측에 표시할 데이터를 결정하는 함수
function LoginTag(props) {
  // isLoggedIn === 로그인 상태 체크
  const isLoggedIn = true;

  // 로그인 한 경우(isLoggedin === true인 경우) 회원 정보 표시
  if (isLoggedIn) {
    return (
      <Row
        align="center"
        style={{
          height: "64px",
        }}>
        <Col
          align="center"
          style={{
            height: "64px",
          }}>
          <Link to="/mypage/tester">
            <Avatar size={44} icon={<UserOutlined />} />
          </Link>
        </Col>
        <Col
          justify="center"
          style={{
            height: "64px",
            textAlign: "center",
          }}>
          <Link to="/mypage/tester" className="text">
            TEST
          </Link>
        </Col>
        <Col
          align="center"
          style={{
            height: "64px",
          }}>
          <Link className="textDark">Logout</Link>
        </Col>
      </Row>
    );
    // 로그인 정보가 없는 경우 로그인 및 회원가입 버튼 표시
  } else {
    return (
      <Row style={{ height: "64px" }}>
        <Col>
          <Link to="/login">
            <Button className="loginButton">LOGIN</Button>
          </Link>
        </Col>
        <Col align="top" style={{ height: "64px" }}>
          <Link to="/register">
            <Button className="signUpButton">Signup</Button>
          </Link>
        </Col>
      </Row>
    );
  }
}

function App() {
  return (
    <Layout>
      {/* 헤더(상단 네비게이션 바) */}
      <Header
        style={{
          backgroundColor: "#17181c",
        }}>
        <Row gutter={16} justify="space-between">
          {/* 로고 표시 구역 */}
          <Col span={4} align="center">
            <Link to="/">
              <img src={alcol} alt="logo" className="logo" />
            </Link>
          </Col>

          {/* 메뉴(Problem, Ranking, Battle) */}
          <Col xs={0} md={6} lg={11} xl={12} justify="center" align="middle">
            <Link to="/problem" className="textDark menus">
              Problem
            </Link>
            <Link to="/ranking" className="textDark menus">
              Ranking
            </Link>
            <Link to="/battle" className="textDark menus">
              Battle
            </Link>
          </Col>

          {/* 로그인 여부에 따라 프로필 또는 로그인 버튼 표시 */}
          <Col xs={8} lg={4} justify="center">
            <LoginTag />
          </Col>
        </Row>
      </Header>
      {/* 본문(임시) */}
      <hr style={{ width: "100%", background: "#e9e9e9" }}></hr>
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

          {/* 결과 페이지 */}
          <Route path="/result" element={<ResultPage />} />

          {/* 문제 페이지(연습모드 진입) */}

          {/* 랭킹 조회 페이지 */}
          <Route path="/ranking" element={<Ranking />} />

          {/* 회원가입 페이지 */}
          <Route path="/register" exact={true} element={<RegisterPage />} />

          {/* 회원정보 수정 페이지 */}
          <Route path="/modify" exact={true} element={<ModifyPage />} />

          {/* 마이페이지(사용자 정보 열람 페이지) */}
          <Route path="/mypage/:username" exact={true} element={<Mypage />} />

          {/* 지난 시즌 정보 조회 페이지 */}
          <Route path="/season/:username" exact={true} element={<LastSeason />} />

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
