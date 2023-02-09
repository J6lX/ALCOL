import React, { useEffect } from "react";
import { Col, Row } from "antd";
// import $ from "jquery";
import "./SelectedProblemPage.css";
// import img_leftHand from "../../assets/leftHand.png";
// import img_rightHand from "../../assets/rightHand.png";

function Top() {
  return (
    <Row>
      <Col xs={12} sm={14} md={12} xl={12} style={{ marginTop: "50px" }}>
        <div className="ban_title">문제 유형이 선택되었습니다.</div>
        <div className="ban_info">곧 입장합니다! 배틀을 준비하세요!</div>
      </Col>
      <Col xs={0} sm={0} md={4} xl={6}></Col>
    </Row>
  );
}

function Mid({ props, problem }) {
  const printProblems = (problem) => {
    const result = [];

    for (let i = 0; i < problem.length; i++) {
      result.push(<div key={i}> {problem[i]} </div>);
    }
    return result;
  };

  return (
    <Row justify="space-between" style={{ marginTop: "80px" }} className="ban_algo_contents">
      <Col sm={0} md={0} xl={4}></Col>
      <Col sm={7} md={7} xl={4} id="algo_box1" className="ban_algo_box">
        <div className="ban_algo_problem_title">알고리즘 유형</div>
        <div className="ban_algo_problem_category">
          {printProblems(props.problems[0].problem_category)}
        </div>
      </Col>
      <Col sm={7} md={7} xl={4} id="algo_box2" className="ban_algo_box">
        <div className="ban_algo_problem_title">알고리즘 유형</div>
        <div className="ban_algo_problem_category">
          {printProblems(props.problems[1].problem_category)}
        </div>
      </Col>
      <Col sm={7} md={7} xl={4} id="algo_box3" className="ban_algo_box">
        <div className="ban_algo_problem_title">알고리즘 유형</div>
        <div className="ban_algo_problem_category">
          {printProblems(props.problems[2].problem_category)}
        </div>
      </Col>
      <Col sm={0} md={0} xl={4}></Col>
    </Row>
  );
}

function Bottom() {
  return <Row style={{ marginTop: "60px" }}></Row>;
}

const SelectedProblemPage = (props) => {
  const [problem, setProblem] = React.useState([]);
  console.log("이건?", props);
  useEffect(() => {
    setProblem({
      problem_no: 1002,
      problem_category: ["수학", "브르투포스 알고리즘"],
    });
  }, []);

  return (
    <div className="backgroundimg">
      <Top />
      <Mid props={props} problem={problem} />
      <Bottom />
    </div>
  );
};

export default SelectedProblemPage;
