// 헤더와 푸터를 별도의 문서(컴포넌트)로 분리
import { Link, useLocation } from "react-router-dom";
import "./HeaderFooter.css";
import alcol from "../assets/alcol_empty_white.png";

import { Layout, Button, Row, Col, Avatar, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

// LoginTag === 로그인 상태에 따라 헤더 우측에 표시할 데이터를 결정하는 함수
function LoginTag(props) {
  // isLoggedIn === 로그인 상태 체크(임시 변수)
  const isLoggedIn = true;
  // 로그인 페이지에서 세션에 인증 정보를 저장한 후sessionStorage 또는 localStorage에서 사용자 인증 여부 가져오기
  console.log(sessionStorage);
  console.log(localStorage);

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
          <Link to="/" className="textDark">
            Logout
          </Link>
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

// 작은 화면에 표시할 메뉴
function getItem(label, key) {
  return {
    key,
    label,
  };
}
const miniItems = [
  getItem("Navigation One", "sub1", [
    getItem("Option 1", "1"),
    getItem("Option 2", "2"),
    getItem("Option 3", "3"),
    getItem("Option 4", "4"),
  ]),
];

// App.js에 반환할 값
function AppHeader() {
  const locationNow = useLocation(); // 현재 접속 중인 URL 확인

  // 배틀 페이지에서는 헤더/푸터 제외하고 표시
  if (
    locationNow.pathname !== "/match" &&
    locationNow.pathname !== "/ban" &&
    locationNow.pathname !== "/mode" &&
    locationNow.pathname !== "/solve" &&
    locationNow.pathname !== "/solveprac" &&
    locationNow.pathname !== "/battle"
  )
    return (
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

          {/* 작은 화면용 메뉴(collapse) */}
          <Col xs={12} md={0} align="middle">
            <Menu items={miniItems} />
          </Col>

          {/* 로그인 여부에 따라 프로필 또는 로그인 버튼 표시 */}
          <Col xs={8} lg={4} justify="center">
            <LoginTag />
          </Col>
        </Row>
      </Header>
    );
}

export default AppHeader;
