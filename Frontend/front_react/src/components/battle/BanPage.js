import React from "react";
import { Col, Row } from "antd";
import "./BanPage.css";

function UserInfo() {
  return (
    <Row justify="end" className="battle_user_info_row">
      <Col span={1} style={{ lineHeight: "50px" }} className="battle_user_info_contents">
        멋진 티어
      </Col>
      <Col span={1} style={{ lineHeight: "50px" }} className="battle_user_info_contents">
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

function App() {
  return (
    <div className="matching_background">
      <UserInfo />
      <div className="ban_title">금지할 문제를 선택해주세요</div>
      <div className="ban_info">
        선택된 문제는 이번 게임에서 출제되지 않습니다. 만약 같은 문제를 금지했다면 남은 문제 중
        랜덤하게 출제됩니다.
      </div>
      <div></div>
      <div className="matchingButton">취소</div>
    </div>
  );
}

export default App;
