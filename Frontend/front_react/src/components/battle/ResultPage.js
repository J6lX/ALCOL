import React from "react";
import "./ResultPage.css";
import img_victory from "../../assets/result_victory.png";
import { Col, Row } from "antd";

function App() {
  return (
    <div className="result_background">
      <img src={img_victory} alt="result" className="result_title" />
      <div className="result_box">
        <div className="result_content">결과1</div>
        <div className="result_content">결과2</div>
        <div className="result_content">결과3</div>
      </div>
      <div>
        <Row justify="space-between" style={{ marginTop: "30px" }}>
          <Col span={8}></Col>
          <Col span={2} className="result_button">
            자세히보기
          </Col>
          <Col span={2} className="result_button">
            다시하기
          </Col>
          <Col span={2} className="result_button">
            그만하기
          </Col>
          <Col span={8}></Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
