import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "./ResultPage.css";
import img_victory from "../../assets/result_victory.gif";
import img_defeat from "../../assets/result_defeat.gif";
import { Col, Row } from "antd";
import confetti from "canvas-confetti";

function App() {
  // eslint-disable-next-line
  const [result, setResult] = React.useState({
    battle_result: "win",
    get_exp: "300",
    get_mmr: "25",
  });

  const printResult = () => {
    var img = "";
    if (result.battle_result === "win") {
      img = <img src={img_victory} alt="result" className="result_title" />;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      img = <img src={img_defeat} alt="result" className="result_title" />;
    }
    return img;
  };

  //페이지 이동 관련 함수/변수
  const history = useHistory();

  function hanleHistoryMatchAgain() {
    history.push("/mode");
  }
  function hanleHistoryResultList() {
    history.push("/resultList");
  }
  function hanleHistoryMain() {
    history.push("/");
  }

  return (
    <div className="result_background">
      {/* <img src={img_victory} alt="result" className="result_title" /> */}
      {printResult()}
      <div className="result_box">
        <div className="result_content">
          <Row>
            <Col className="result_text" span={10}>
              걸린 시간
            </Col>
            <Col className="result_text" span={10}>
              {result.battle_result}
            </Col>
          </Row>
        </div>
        <div className="result_content">
          <Row>
            <Col className="result_text" span={10}>
              얻은 경험치
            </Col>
            <Col className="result_text" span={10}>
              {result.get_exp}
            </Col>
          </Row>
        </div>
        <div className="result_content">
          <Row>
            <Col className="result_text" span={10}>
              얻은 점수
            </Col>
            <Col className="result_text" span={10}>
              {result.get_mmr}
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <Row justify="space-between" style={{ marginTop: "30px" }}>
          <Col span={8}></Col>
          <Col span={2} className="result_button" onClick={hanleHistoryResultList}>
            자세히보기
          </Col>
          <Col span={2} className="result_button" onClick={hanleHistoryMatchAgain}>
            다시하기
          </Col>
          <Col span={2} className="result_button" onClick={hanleHistoryMain}>
            그만하기
          </Col>
          <Col span={8}></Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
