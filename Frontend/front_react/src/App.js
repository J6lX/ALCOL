import React from "react";
import { Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";

import HomePage from "./components/home/HomePage";
import LoginPage from "./components/accounts/LoginPage";
import RegisterPage from "./components/accounts/RegisterPage";
import ModifyPage from "./components/accounts/ModifyPage";
import ModeSelectPage from "./components/battle/ModeSelectPage";
import MatchingPage from "./components/battle/MatchingPage";
import BanPage from "./components/battle/BanPage";
import ReadyPage from "./components/battle/ReadyPage";
import ContinuousBattlePage from "./components/battle/ContinuousBattlePage";
import ResultPage from "./components/battle/ResultPage";
import ResultListPage from "./components/battle/ResultListPage";
import SolvingPage from "./components/battle/SolvingPage";
import PracticeSolvingPage from "./components/battle/PracticeSolvingPage";
import "./App.css";
import Mypage from "./components/mypage/Mypage";
import NotFound404 from "./components/NotFound404";
import Ranking from "./components/mypage/Ranking";
import LastSeason from "./components/mypage/LastSeason";
import PracticePage from "./components/battle/PracticePage";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

import { Layout } from "antd";
// // import { render } from "@testing-library/react";

const { Content } = Layout;

function App() {
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
            <Route exact path="/login" component={LoginPage} />

            {/* 모드 선택 페이지 */}
            <Route path="/mode" component={ModeSelectPage} />

            {/* 매칭 페이지 */}
            <Route path="/match" component={MatchingPage} />

            {/* 밴픽 페이지 */}
            <Route path="/ban" component={BanPage} />

            {/* 매칭 후 소켓 연결 대기 페이지 */}
            <Route path="/ready" component={ReadyPage} />

            {/* 배틀 페이지 */}
            <Route path="/battle" component={ContinuousBattlePage} />

            {/* 랭킹 조회 페이지 */}
            <Route path="/ranking" component={Ranking} />

            {/* 회원가입 페이지 */}
            <Route path="/register" exact={true} component={RegisterPage} />

            {/* 회원정보 수정 페이지 */}
            <Route path="/modify" exact={true} component={ModifyPage} />

            {/* 배틀 문제 푸는 페이지 */}
            <Route path="/solve" exact={true} component={SolvingPage} />

            {/* 배틀 결과 페이지 */}
            <Route path="/result" exact={true} component={ResultPage} />

            {/* 배틀 상세 결과 페이지 */}
            <Route path="/resultList" exact={true} component={ResultListPage} />

            {/* 문제 페이지(연습모드 진입) */}
            <Route path="/practice" component={PracticePage} />

            {/* 혼자 문제 푸는 페이지 */}
            <Route path="/solveprac" exact={true} component={PracticeSolvingPage} />

            {/* 마이페이지(사용자 정보 열람 페이지) */}
            <Route path="/mypage/:username" exact={true} component={Mypage} />

            {/* 지난 시즌 정보 조회 페이지 */}
            <Route path="/season/:username" exact={true} component={LastSeason} />

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
