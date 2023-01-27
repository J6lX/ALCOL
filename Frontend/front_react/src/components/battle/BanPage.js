import React from "react";
import { Col, Row } from "antd";
import "./BanPage.css";

function UserInfo() {
  return (
    <Row justify="end" className="battle_user_info_row">
      <Col
        span={1}
        style={{ fontSize: "1vw", lineHeight: "50px" }}
        className="battle_user_info_contents">
        멋진 티어
      </Col>
      <Col
        span={1}
        style={{ fontSize: "1vw", lineHeight: "50px" }}
        className="battle_user_info_contents">
        멋진 티어
      </Col>
      <Col
        span={3}
        style={{ fontSize: "1.5vw", paddingLeft: "10px", lineHeight: "50px" }}
        className="battle_user_info_contents">
        멋진 닉네임
      </Col>
    </Row>
  );
}

function PlayerInfo() {
  return <div className="ban_player_info">Player1</div>;
}

function Top() {
  return (
    <Row>
      <Col xs={12} sm={10} md={8} lg={6} xl={6}>
        <PlayerInfo />
      </Col>
      <Col xs={12} sm={14} md={12} lg={12} xl={12} style={{ marginTop: "50px" }}>
        <div className="ban_title">금지할 문제를 선택해주세요</div>
        <div className="ban_info">
          선택된 문제는 이번 게임에서 출제되지 않습니다. 만약 같은 문제를 금지했다면 남은 문제 중
          랜덤하게 출제됩니다.
        </div>
      </Col>
      <Col xs={0} sm={0} md={4} lg={6} xl={6}></Col>
    </Row>
  );
}

function Mid() {
  return (
    <Row justify="space-between" style={{ marginTop: "80px" }} className="ban_algo_contents">
      <Col xs={0} sm={0} md={0} lg={4} xl={4}></Col>
      <Col xs={7} sm={7} md={7} lg={4} xl={4} className="ban_algo_box"></Col>
      <Col xs={7} sm={7} md={7} lg={4} xl={4} className="ban_algo_box"></Col>
      <Col xs={7} sm={7} md={7} lg={4} xl={4} className="ban_algo_box"></Col>
      <Col xs={0} sm={0} md={0} lg={4} xl={4}></Col>
    </Row>
  );
}

function Bottom() {
  return (
    <Row style={{ marginTop: "60px" }}>
      <Col xs={0} sm={0} md={4} lg={7} xl={7}></Col>
      <Col xs={12} sm={14} md={12} lg={10} xl={10} style={{ marginTop: "100px" }}></Col>
      <Col xs={12} sm={10} md={8} lg={7} xl={7}>
        <PlayerInfo />
      </Col>
    </Row>
  );
}

function App() {
  return (
    <div className="matching_background">
      <UserInfo />
      <Top />
      <Mid />
      <Bottom />
      <div className="matchingButton">취소</div>
    </div>
  );
}

export default App;
