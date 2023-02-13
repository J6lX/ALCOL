import React from "react";
import { useHistory } from "react-router-dom";
import "./ResultPage.css";
import img_victory from "../../assets/result_victory.gif";
import img_defeat from "../../assets/result_defeat.gif";
import { Col, Row } from "antd";
import confetti from "canvas-confetti";

function App({props, showDetailResult}) {
  console.log("이게 배틀 종료 데이터", props);
  const data = props;
  const printResult = () => {
    var img = "";
    if (data.battleResult === "win") {
      img = <img src={img_victory} alt="result" className="result_title" />;
      var defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      };

      function shoot() {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ["star"],
        });

        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ["circle"],
        });
      }

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    } else {
      img = <img src={img_defeat} alt="result" className="result_title" />;
    }
    return img;
  };

  const showDetail = () => {
    showDetailResult()
  }

  //페이지 이동 관련 함수/변수
  const history = useHistory();

  function hanleHistoryMatchAgain() {
    history.push("/mode");
  }
  // function hanleHistoryResultList() {
  //   history.push("/resultList");
  // }
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
              아직 안 받음
            </Col>
          </Row>
        </div>
        <div className="result_content">
          <Row>
            <Col className="result_text" span={10}>
              얻은 경험치
            </Col>
            <Col className="result_text" span={10}>
              이것도 아직임
            </Col>
          </Row>
        </div>
        <div className="result_content">
          <Row>
            <Col className="result_text" span={10}>
              얻은 점수
            </Col>
            <Col className="result_text" span={10}>
              {data.changeMmr}
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <Row justify="space-between" style={{ marginTop: "30px" }}>
          <Col span={8}></Col>
          <Col span={2} className="result_button" onClick={showDetail}>
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
