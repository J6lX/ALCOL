import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";

import HomePage from "./components/home/HomePage";
import LoginPage from "./components/accounts/LoginPage";
import RegisterPage from "./components/accounts/RegisterPage";
import ModifyPage from "./components/accounts/ModifyPage";
import ModeSelectPage from "./components/battle/ModeSelectPage";
import MatchingPage from "./components/battle/MatchingPage";
import BanPage from "./components/battle/BanPage";
import ReadyPage from "./components/battle/ReadyPage";
import SelectedProblemPage from "./components/battle/SelectedProblemPage";
import ContinuousBattlePage from "./components/battle/ContinuousBattlePage";
import ResultPage from "./components/battle/ResultPage";
import ResultListPage from "./components/battle/ResultListPage";
import SolvingPage from "./components/battle/SolvingPage";
import SolvingOptPage from "./components/battle/SolvingOptPage";
import PracticeSolvingPage from "./components/battle/PracticeSolvingPage";
import "./App.css";
import Mypage from "./components/mypage/Mypage";
import NotFound404 from "./components/NotFound404";
import Ranking from "./components/mypage/Ranking";
import PracticePage from "./components/battle/PracticePage";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

import { Layout } from "antd";
import { AccessTokenInfo, LoginState, RefreshTokenInfo } from "./states/LoginState";
import PrivateRoute from "./PrivateRoute";

// // import { render } from "@testing-library/react";

const { Content } = Layout;

// 로그인 상태 확인
export function LoginInfo() {
  const userData = useRecoilValue(LoginState);
  const AccToken = useRecoilValue(AccessTokenInfo);
  const RefToken = useRecoilValue(RefreshTokenInfo);

  return {
    UserName: userData,
    AccessToken: AccToken,
    RefreshToken: RefToken,
  };
}

function App() {
  // 인증(로그인) 상태 확인
  const isAuthenticated = useRecoilValue(LoginState);

  return (
    <RecoilRoot>
      <Layout>
        <AppHeader />

        <Content
          style={{
            backgroundColor: "#16171B",
          }}>
          {/* 라우터 태그 목록 */}
          <Switch>
            {/* 메인 페이지 */}
            <Route exact path="/" component={HomePage} />

            {/* 로그인 페이지 */}
            <Route exact path="/login">
              {isAuthenticated ? <Redirect to="/" /> : <Route component={LoginPage} />}
            </Route>
            {/* 로그아웃 페이지(로그아웃 기능 구현용) */}

            {/* 모드 선택 페이지 */}
            <PrivateRoute path="/mode" component={ModeSelectPage} />

            {/* 매칭 페이지 */}
            <PrivateRoute path="/match" component={MatchingPage} />

            {/* 밴픽 페이지 */}
            <PrivateRoute path="/ban" component={BanPage} />

            {/* 매칭 후 소켓 연결 대기 페이지 */}
            <PrivateRoute path="/ready" component={ReadyPage} />

            {/* 배틀 페이지 */}
            <PrivateRoute path="/battle" component={ContinuousBattlePage} />

            {/* 선택된 배틀 정보들 요약해주는 페이지 */}
            <Route path="/testselect" component={SelectedProblemPage} />

            {/* 랭킹 조회 페이지 */}
            <Route path="/ranking" component={Ranking} />

            {/* 회원가입 페이지 */}
            <Route exact path="/register">
              {isAuthenticated ? <Redirect to="/" /> : <Route component={RegisterPage} />}
            </Route>

            {/* 회원정보 수정 페이지 */}
            <Route path="/modify" exact={true} component={ModifyPage} />

            {/* 배틀 문제 푸는 페이지 */}
            {/* <PrivateRoute path="/solveTest" exact={true} component={SolvingTest} /> */}

            {/* 배틀 문제 푸는 페이지 */}
            <PrivateRoute path="/solve" exact={true} component={SolvingPage} />

            {/* 최적화전 배틀 문제 푸는 페이지 */}
            <PrivateRoute path="/solveopt" exact={true} component={SolvingOptPage} />

            {/* 배틀 결과 페이지 */}
            <PrivateRoute path="/result" exact={true} component={ResultPage} />

            {/* 배틀 상세 결과 페이지 */}
            <PrivateRoute path="/resultList" exact={true} component={ResultListPage} />

            {/* 문제 페이지(연습문제 열람) */}
            <Route path="/practice" component={PracticePage} />

            {/* 혼자 문제 푸는 페이지(연습모드 진입) */}
            <PrivateRoute
              path="/solveprac/:problemno"
              exact={true}
              component={PracticeSolvingPage}
            />

            {/* 마이페이지(사용자 정보 열람 페이지) */}
            <PrivateRoute path="/mypage/:username" exact={true} component={Mypage} />

            {/* 404 페이지 */}
            <Route component={NotFound404} />
            {/* <Route exact path="/register" element={RegisterPage()} /> */}
          </Switch>
        </Content>
        <AppFooter />
      </Layout>
    </RecoilRoot>
  );
}

export default App;
