// 헤더와 푸터를 별도의 문서(컴포넌트)로 분리
import { Link, useLocation } from "react-router-dom";
import "./HeaderFooter.css";
import alcol from "../assets/alcol_empty_white.png";

import { Layout, Button, Row, Col, Menu } from "antd";
import { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { AccessTokenInfo, LoginState, RefreshTokenInfo, UserInfoState } from "../states/LoginState";

const { Header } = Layout;

// LoginTag === 로그인 상태에 따라 헤더 우측에 표시할 데이터를 결정하는 함수
function LoginTag(props) {
  // 현재 로그인한 사용자 정보
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  const setAccessTokenData = useSetRecoilState(AccessTokenInfo);
  const setRefreshTokenData = useSetRecoilState(RefreshTokenInfo);
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);
  const photo = userInfo.profileImg;

  const logoutRequest = () => {
    setIsLoggedIn(false);
    setAccessTokenData("");
    setRefreshTokenData("");
    setUserInfo([]);

    // 메인 화면으로 리다이렉트
    window.location.reload();
  };

  // 로그인 한 경우(isLoggedin === true인 경우) 회원 정보 표시
  if (isLoggedIn) {
    return (
      <Row
        align="center"
        justify="end"
        style={{
          height: "64px",
        }}>
        <Col
          align="center"
          style={{
            height: "64px",
          }}>
          <Link to={`/mypage/${isLoggedIn}`}>
            <img
              src={photo}
              alt="profile"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "100%",
                marginTop: "8px",
              }}
            />
          </Link>
        </Col>
        <Col
          justify="center"
          style={{
            height: "64px",
            textAlign: "center",
          }}>
          <Link
            to={`/mypage/${isLoggedIn}`}
            className="NanumSquare text"
            style={{ marginLeft: "15px" }}>
            {userInfo.nickname}
          </Link>
        </Col>
        <Col
          align="center"
          style={{
            height: "64px",
          }}>
          <Link to="/" onClick={logoutRequest} className="NanumSquare textDark">
            Logout
          </Link>
        </Col>
      </Row>
    );
    // 로그인 정보가 없는 경우 로그인 및 회원가입 버튼 표시
  } else {
    return (
      <Row align="center" justify="end" style={{ height: "64px", fontFamily: "NanumSquareNeo" }}>
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
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const miniItems = [
  getItem("MENU", "sub1", null, [
    getItem(
      <Link to="/practice" className="NanumSquare textDark">
        Problem
      </Link>,
      "1"
    ),
    getItem(
      <Link to="/ranking?mode=speed&page=1" className="NanumSquare textDark">
        Ranking
      </Link>,
      "2"
    ),
    getItem(
      <Link to="/mode" className="NanumSquare textDark">
        Battle
      </Link>,
      "3"
    ),
  ]),
];

// 브라우저 창 크기 실시간으로 반영
const ResizedComponent = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

// 헤더 데이터
function HeaderData() {
  // browser = 실시간으로 브라우저 화면 크기 계산한 결과(너비, 높이)
  const browser = ResizedComponent();

  // 큰 화면에서 표시하는 데이터
  if (browser.width >= 640) {
    return (
      <Header
        style={{
          position: "fixed",
          zIndex: "1000",
          backgroundColor: "#161718",
          width: "100vw",
          height: "auto",
        }}>
        <Row gutter={16} justify="space-between" align="middle">
          {/* 로고 표시 구역 */}
          <Col span={3} justify="center" align="end">
            <Link to="/">
              <img
                src={alcol}
                alt="logo"
                className="logo"
                style={{
                  transform: "translate(0%, 35%)",
                }}
              />
            </Link>
          </Col>

          <Col lg={3}></Col>

          {/* 메뉴(Problem, Ranking, Battle) */}
          <Col xs={4} md={6} lg={11} xl={12} justify="center" align="middle">
            <Link to="/practice" className="NanumSquare textDark menus">
              Problem
            </Link>
            <Link to="/ranking?mode=speed&page=1" className="NanumSquare textDark menus">
              Ranking
            </Link>
            <Link to="/mode" className="NanumSquare textDark menus">
              Battle
            </Link>
          </Col>

          {/* 로그인 여부에 따라 프로필 또는 로그인 버튼 표시 */}
          <Col xs={8} lg={6} justify="end">
            <LoginTag />
          </Col>
        </Row>
      </Header>
    );
  }
  // 작은 화면에서 표시하는 데이터
  else {
    return (
      <Header
        style={{
          position: "fixed",
          zIndex: "10",
          backgroundColor: "#17181c",
          width: "100%",
          height: "auto",
        }}>
        <Row align="middle">
          {/* 로고 표시 구역 */}
          <Col span={5} align="center">
            <Link to="/">
              <img
                src={alcol}
                alt="logo"
                className="logo"
                style={{
                  width: "100%",
                  transform: "translate(0, 25%)",
                }}
              />
            </Link>
          </Col>

          {/* 작은 화면용 메뉴(collapse) */}
          <Col span={8} align="middle">
            <Menu
              mode="inline"
              items={miniItems}
              theme={{
                token: {
                  colorPrimary: "#FAC557",
                },
              }}
              className="NanumSquare"
              style={{
                backgroundColor: "#16171b",
                color: "white",
              }}
            />
          </Col>
          {/* 로그인 여부에 따라 프로필 또는 로그인 버튼 표시 */}
          <Col xs={11} justify="center">
            <LoginTag />
          </Col>
        </Row>
      </Header>
    );
  }
}

// 헤더를 표시해야 하는 URL에서만 헤더 데이터 반환
function AppHeader() {
  const locationNow = useLocation(); // 현재 접속 중인 URL 확인

  // 배틀 페이지에서는 헤더/푸터 제외하고 표시
  if (
    locationNow.pathname !== "/match" &&
    locationNow.pathname !== "/ban" &&
    locationNow.pathname !== "/mode" &&
    locationNow.pathname !== "/solve" &&
    locationNow.pathname !== "/solveprac" &&
    locationNow.pathname !== "/battle" &&
    locationNow.pathname !== "/solveprac"
  )
    return <HeaderData />;
}

export default AppHeader;
