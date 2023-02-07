import React from "react";
import { Col, Row } from "antd";
// import $ from "jquery";
import "./SelectedProblemPage.css";
// import img_leftHand from "../../assets/leftHand.png";
// import img_rightHand from "../../assets/rightHand.png";
import CountDownTimer from "./CountDownTimer";

function Top() {
  return (
    <Row>
      <Col xs={12} sm={10} md={8} xl={6}>
        <div className="ban_player_info">Player1</div>
        {/* <img src={img_leftHand} alt="hand" className="ban_hands_left" /> */}
      </Col>
      <Col xs={12} sm={14} md={12} xl={12} style={{ marginTop: "50px" }}>
        <div className="ban_title">금지할 문제를 선택해주세요</div>
        <div className="ban_info">
          선택된 문제는 이번 게임에서 출제되지 않습니다. 만약 같은 문제를 금지했다면 남은 문제 중
          랜덤하게 출제됩니다.
        </div>
        <div>
          <CountDownTimer className="timer" />
        </div>
      </Col>
      <Col xs={0} sm={0} md={4} xl={6}></Col>
    </Row>
  );
}

function Mid({ props, problems }) {
  const printProblems = (problems) => {
    const result = [];

    for (let i = 0; i < problems.length; i++) {
      result.push(<div key={i}> {problems[i]} </div>);
    }
    return result;
  };
  const box1 = document.querySelector("#algo_box1")
  const box2 = document.querySelector("#algo_box2")
  const box3 = document.querySelector("#algo_box3")
  if (props === "1") {
    box2.className = "ban_algo_box active"
    box3.className = "ban_algo_box active"
  } else if (props === "2") {
    box1.className = "ban_algo_box active"
    box3.className = "ban_algo_box active"
  } else if (props === "3") {
    box1.className = "ban_algo_box active"
    box2.className = "ban_algo_box active"
  }
  return (
    <Row justify="space-between" style={{ marginTop: "80px" }} className="ban_algo_contents">
      <Col sm={0} md={0} xl={4}></Col>
      <Col sm={7} md={7} xl={4} id="algo_box1" className="ban_algo_box">
        <div className="ban_algo_problem_title">알고리즘 유형</div>
        <div className="ban_algo_problem_category">
          {printProblems(problems[0].problem_category)}
        </div>
      </Col>
      <Col sm={7} md={7} xl={4} id="algo_box2" className="ban_algo_box">
        <div className="ban_algo_problem_title">알고리즘 유형</div>
        <div className="ban_algo_problem_category">
          {printProblems(problems[1].problem_category)}
        </div>
      </Col>
      <Col sm={7} md={7} xl={4} id="algo_box3" className="ban_algo_box">
        <div className="ban_algo_problem_title">알고리즘 유형</div>
        <div className="ban_algo_problem_category">
          {printProblems(problems[2].problem_category)}
        </div>
      </Col>
      <Col sm={0} md={0} xl={4}></Col>
    </Row>
  );
}

function Bottom() {
  return (
    <Row style={{ marginTop: "60px" }}>
      <Col xs={0} sm={0} md={4} xl={6}></Col>
      <Col xs={12} sm={14} md={12} xl={12} style={{ marginTop: "100px" }}></Col>
      <Col xs={12} sm={10} md={8} xl={6}>
        {/* <img src={img_rightHand} alt="hand" className="ban_hands_right" /> */}
        <div style={{ marginTop: "70px" }} className="ban_player_info">
          Player1
        </div>
      </Col>
    </Row>
  );
}

const SelectedProblemPage = (props) => {
  const [problem, setProblem] = React.useState([
    {
      problem_no: 1001,
      problem_category: ["구현", "그래프 이론", "그래프 탐색"],
    },
    {
      problem_no: 1002,
      problem_category: ["수학", "브르투포스 알고리즘"],
    },
    {
      problem_no: 1003,
      problem_category: ["다이나믹 프로그래밍", "비트 마스킹", "최대 유량"],
    },
  ]);
  return (
    <div className="backgroundimg">
      <Top />
      <Mid props={props} problems={problem} />
      <Bottom />
    </div>
  );
};

export default SelectedProblemPage;
