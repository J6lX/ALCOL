import React from "react";
import { useHistory } from "react-router-dom";
import "./ResultPage.css";
import img_victory from "../../assets/result_victory.gif";
import img_defeat from "../../assets/result_defeat.gif";
import versus from "../../assets/versus.png";
import { Col, Row } from "antd";
import confetti from "canvas-confetti";

function App({ props, battleuserinfo, showDetailResult }) {
  const userInfo = battleuserinfo;
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
    showDetailResult();
  };

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
        <Row
          className="middle_selected"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            marginBottom: "3%",
          }}>
          <Col
            span={6}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50px",
            }}>
            <p className="NanumSquare" style={{ color: "white", fontSize: "3vh" }}>
              {userInfo.user.nick}
            </p>
          </Col>
          <Col span={3} style={{ display: "flex", justifyContent: "center" }}>
            <img src={versus} alt="versus" style={{ width: "60px" }} />
          </Col>
          <Col
            span={6}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50px",
            }}>
            <p className="NanumSquare" style={{ color: "white", fontSize: "3vh" }}>
              {userInfo.other.nick}
            </p>
          </Col>
        </Row>
        <div className="result_content">
          <Row>
            <Col className="result_text" span={10}>
              배틀 결과
            </Col>
            <Col className="result_text" span={10}>
              {data.battleResult === "win" && "승리"}
              {data.battleResult === "lose" && "패배"}
              {data.battleResult === "draw" && "무승부"}              
              {data.battleResult === "draw_timeout" && "시간초과"}              
            </Col>
          </Row>
        </div>
        <div className="result_content">
          <Row>
            <Col className="result_text" span={10}>
              얻은 경험치
            </Col>
            <Col className="result_text" span={10}>
              {data.changeExp}
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
