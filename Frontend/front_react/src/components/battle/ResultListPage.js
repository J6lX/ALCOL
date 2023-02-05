import React from "react";
import "./ResultListPage.css";
import { Col, Row, Divider } from "antd";
import icon_vs from "../../assets/vs.png";

function PlayerInfo() {
  return (
    <Row justify="space-between">
      <Col span={6} className="result_user_info">
        꺽여가는 마음
      </Col>
      <Col span={2} className="result_user_info">
        티어
      </Col>
      <Col span={2} className="result_user_info">
        티어
      </Col>
      <Col span={3} className="result_icon_vs">
        <img src={icon_vs} alt="vs"></img>
      </Col>
      <Col span={2} className="result_enemy_info">
        티어
      </Col>
      <Col span={2} className="result_enemy_info">
        티어
      </Col>
      <Col span={6} className="result_enemy_info">
        멋진 닉네임
      </Col>
    </Row>
  );
}

function GameInfo() {
  const gameInfoTitle = {
    padding: "8px 0",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    textAlign: "center",
    lineHeight: "16px",
    fontWeight: "bold",
  };
  const gameInfoList = {
    padding: "8px 0",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    height: "10em",
    textAlign: "center",
    lineHeight: "10em",
  };
  return (
    <div>
      <div className="result_game_mode">스피드</div>
      <PlayerInfo />
      <Divider style={{ backgroundColor: "white" }} />
      <Row gutter={[8, 8]} style={{ marginLeft: "10px", marginRight: "10px" }}>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoTitle}>문제 난이도</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoTitle}>사용 언어</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoTitle}>평균 시도</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoTitle}>걸린 시간</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoList}>col-6</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoList}>col-6</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoList}>col-6</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoList}>col-6</div>
        </Col>
      </Row>
    </div>
  );
}

function ResultPlayerInfo() {
  return (
    <div>
      <div className="result_list_info_wrap">
        <div className="result_list_circle_user"></div>
        <div className="result_list_player_info_text">내 정보</div>
        <div className="result_list_circle_enemy"></div>
        <div className="result_list_player_info_text">상대 정보</div>
      </div>
    </div>
  );
}

function ResultInfo({ message }) {
  return (
    <div style={{ clear: "both" }}>
      <Row justify="space-between">
        <Col span={2} className="result_list_time">
          12분
        </Col>
        <Col span={1} className="result_list_result"></Col>
        <Col span={20} className="result_list_info">
          <Row>
            <Col span={2}>사진</Col>
            <Col span={22}>{message}</Col>
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>
    </div>
  );
}

function ResultList() {
  return (
    <div style={{ clear: "both", height: "45vh", overflow: "auto" }}>
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
      <ResultInfo message="꺾여가는 마음의 정답 코드 제출! 코드 길이 : 3000 메모리 300 실행시간 : 300" />
    </div>
  );
}

function ResultButton() {
  return (
    <Row justify="space-between" style={{ marginTop: "30px" }}>
      <Col span={8}></Col>
      <Col span={3} className="result_button">
        자세히보기
      </Col>
      <Col span={3} className="result_button">
        다시하기
      </Col>
      <Col span={8}></Col>
    </Row>
  );
}

function App() {
  return (
    <div className="resultList_background">
      <div
        style={{
          textAlign: "center",
          fontSize: "40px",
          fontWeight: "bold",
          color: "white",
          marginTop: "50px",
        }}>
        결과 상세정보
      </div>
      <Row justify="space-between" style={{ marginTop: "70px" }}>
        <Col sm={0} md={0} lg={0} xl={2}></Col>
        <Col sm={24} md={24} lg={12} xl={7} className="result_list_wrap">
          <GameInfo />
        </Col>
        <Col sm={24} md={24} lg={12} xl={12} className="result_list_wrap">
          <ResultPlayerInfo />
          <ResultList />
        </Col>
        <Col sm={0} md={0} lg={0} xl={2}></Col>
      </Row>
      <ResultButton />
    </div>
  );
}

export default App;
