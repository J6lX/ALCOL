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

function App() {
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
    height: "150px",
    textAlign: "center",
    lineHeight: "150px",
  };
  return (
    <div className="result_background">
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
        <Col sm={10} md={8} xl={3}></Col>
        <Col sm={10} md={8} xl={7} className="result_list_wrap">
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
        </Col>
        <Col sm={10} md={8} xl={10} className="result_list_wrap">
          <div className="resut_list_info_wrap">
            <div className="result_list_circle_user"></div>
            <div>내 정보</div>
            <div className="result_list_circle_enemy"></div>
            <div>상대 정보</div>
          </div>
        </Col>
        <Col sm={10} md={8} xl={3}></Col>
      </Row>
    </div>
  );
}

export default App;
