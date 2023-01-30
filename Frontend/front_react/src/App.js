import React from "react";
import { BrowserRouter as Router, Link, Route, Switch, useLocation } from "react-router-dom";

import HomePage from "./components/home/HomePage";
import LoginPage from "./components/accounts/LoginPage";
import RegisterPage from "./components/accounts/RegisterPage";
import ModifyPage from "./components/accounts/ModifyPage";
import ModeSelectPage from "./components/battle/ModeSelectPage";
import MatchingPage from "./components/battle/MatchingPage";
import BanPage from "./components/battle/BanPage";
import ResultPage from "./components/battle/ResultPage";
import ResultListPage from "./components/battle/ResultListPage";
import "./App.css";
import Mypage from "./components/mypage/Mypage";
import NotFound404 from "./components/NotFound404";
import Ranking from "./components/mypage/Ranking";
import LastSeason from "./components/mypage/LastSeason";
import PracticePage from "./components/battle/PracticePage";

import alcol from "../src/assets/alcol_empty_white.png";

import { Layout, Button, Row, Col, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
// // import { render } from "@testing-library/react";

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
  // locationNow === 현재 라우터 URL
  const locationNow = useLocation();

  // 배틀 페이지에서는 헤더와 푸터 숨기기
  if (
    locationNow.pathname === "/match" ||
    locationNow.pathname === "/ban" ||
    locationNow.pathname === "/mode" ||
    locationNow.pathname === "/result"
  )
    return (
      <Layout>
        <Content
          style={{
            backgroundColor: "#16171B",
          }}>
          {/* 라우터 태그 목록 */}
          <Router>
            <Switch>
              {/* 메인 페이지 */}
              <Route exact path="/" component={HomePage} />

              {/* 로그인 페이지 */}
              <Route exact path="/login" component={LoginPage} />

              {/* 모드 선택 페이지 */}
              <Route path="/mode" component={ModeSelectPage} />

              {/* 매칭 페이지 */}
              <Route path="/match" component={MatchingPage} />

              {/* 밴픽 페이지 */}
              <Route path="/ban" component={BanPage} />

              {/* 결과 페이지 */}
              <Route path="/result" component={ResultPage} />

              {/* 문제 페이지(연습모드 진입) */}
              <Route path="/practice" component={PracticePage} />

              {/* 랭킹 조회 페이지 */}
              <Route path="/ranking" component={Ranking} />

              {/* 회원가입 페이지 */}
              <Route path="/register" exact={true} component={RegisterPage} />

              {/* 회원정보 수정 페이지 */}
              <Route path="/modify" exact={true} component={ModifyPage} />

              {/* 마이페이지(사용자 정보 열람 페이지) */}
              <Route path="/mypage/:username" exact={true} component={Mypage} />

              {/* 지난 시즌 정보 조회 페이지 */}
              <Route path="/season/:username" exact={true} component={LastSeason} />

              {/* 404 페이지 */}
              <Route component={NotFound404} />
              {/* <Route exact path="/register" element={RegisterPage()} /> */}
            </Switch>
          </Router>
        </Content>
      </Layout>
    );

  // 그 이외의 경우에는 헤더 표시
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
            <Link to="/practice" className="textDark menus">
              Problem
            </Link>
            <Link to="/ranking" className="textDark menus">
              Ranking
            </Link>
            <Link to="/mode" className="textDark menus">
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
        <Router>
          <Switch>
            {/* 메인 페이지 */}
            <Route exact path="/" component={HomePage} />
        <Router>
          <Switch>
            {/* 메인 페이지 */}
            <Route exact path="/" component={HomePage} />

            {/* 로그인 페이지 */}
            <Route exact path="/login" component={LoginPage} />
            {/* 로그인 페이지 */}
            <Route exact path="/login" component={LoginPage} />

            {/* 모드 선택 페이지 */}
            <Route path="/mode" component={ModeSelectPage} />
            {/* 모드 선택 페이지 */}
            <Route path="/mode" component={ModeSelectPage} />

            {/* 매칭 페이지 */}
            <Route path="/match" component={MatchingPage} />
            {/* 매칭 페이지 */}
            <Route path="/match" component={MatchingPage} />

            {/* 밴픽 페이지 */}
            <Route path="/ban" component={BanPage} />

            {/* 결과 페이지 */}
            <Route path="/result" component={ResultPage} />

            {/* 문제 페이지(연습모드 진입) */}
            <Route path="/practice" component={PracticePage} />

            {/* 랭킹 조회 페이지 */}
            <Route path="/ranking" component={Ranking} />
            {/* 랭킹 조회 페이지 */}
            <Route path="/ranking" component={Ranking} />

            {/* 회원가입 페이지 */}
            <Route path="/register" exact={true} component={RegisterPage} />
            {/* 회원가입 페이지 */}
            <Route path="/register" exact={true} component={RegisterPage} />

            {/* 회원정보 수정 페이지 */}
            <Route path="/modify" exact={true} component={ModifyPage} />
            {/* 회원정보 수정 페이지 */}
            <Route path="/modify" exact={true} component={ModifyPage} />

            {/* 마이페이지(사용자 정보 열람 페이지) */}
            <Route path="/mypage/:username" exact={true} component={Mypage} />
            {/* 마이페이지(사용자 정보 열람 페이지) */}
            <Route path="/mypage/:username" exact={true} component={Mypage} />

            {/* 지난 시즌 정보 조회 페이지 */}
            <Route path="/season/:username" exact={true} component={LastSeason} />
            {/* 지난 시즌 정보 조회 페이지 */}
            <Route path="/season/:username" exact={true} component={LastSeason} />

            {/* 404 페이지 */}
            <Route component={NotFound404} />
            {/* <Route exact path="/register" element={RegisterPage()} /> */}
          </Switch>
        </Router>
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
