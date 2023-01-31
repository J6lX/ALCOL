import React from "react";
import { Col, Row } from "antd";
import "./BanPage.css";
import img_leftHand from "../../assets/leftHand.png";
import img_rightHand from "../../assets/rightHand.png";

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

function Top() {
  return (
    <Row>
      <Col xs={12} sm={10} md={8} lg={6} xl={6}>
        <div className="ban_player_info">Player1</div>
        <img src={img_leftHand} alt="hand" className="ban_hands_left" />
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
      <Col xs={0} sm={0} md={4} lg={6} xl={6}></Col>
      <Col xs={12} sm={14} md={12} lg={12} xl={12} style={{ marginTop: "100px" }}></Col>
      <Col xs={12} sm={10} md={8} lg={6} xl={6}>
        <img src={img_rightHand} alt="hand" className="ban_hands_right" />
        <div style={{ marginTop: "70px" }} className="ban_player_info">
          Player1
        </div>
      </Col>
    </Row>
  );
}

function App() {
  const [problemNums, setProblemNums] = React.useState(["1", "2", "3"]);
  const [problem1, setProblem1] = React.useState(["구현", "그래프 이론", "그래프 탐색"]);
  const [problem2, setProblem2] = React.useState(["수학", "브르투포스 알고리즘"]);
  const [problem3, setProblem3] = React.useState([
    "다이나믹 프로그래밍",
    "비트 마스킹",
    "최대 유량",
  ]);

  return (
    <div className="matching_background">
      <UserInfo />
      <Top />
      <Mid />
      <Bottom />
      <div className="banButton">취소</div>
    </div>
  );
}

export default App;
