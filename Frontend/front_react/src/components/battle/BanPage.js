import React, { useEffect } from "react";
import { Button, Col, Row, Progress } from "antd";
import $ from "jquery";
import "./BanPage.css";
import img_leftHand from "../../assets/leftHand.png";
import img_rightHand from "../../assets/rightHand.png";
import CountDownTimer from "./CountDownTimer";

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
  const [secs, setTime] = React.useState(100);

  const tick = () => {
    setTime(secs - 1);
  };

  React.useEffect(() => {
    //1초
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return (
    <Row>
      <Col xs={12} sm={10} md={8} xl={6}>
        <div className="ban_player_info">Player1</div>
        <img src={img_leftHand} alt="hand" className="ban_hands_left" />
      </Col>
      <Col xs={12} sm={14} md={12} xl={12} style={{ marginTop: "50px" }}>
        <div className="ban_title">금지할 문제를 선택해주세요</div>
        <div className="ban_info">
          선택된 문제는 이번 게임에서 출제되지 않습니다. 만약 같은 문제를 금지했다면 남은 문제 중
          랜덤하게 출제됩니다.
        </div>
        <div>
          <CountDownTimer className="timer" />
          <Progress percent={secs / 300} showInfo={false} />
        </div>
      </Col>
      <Col xs={0} sm={0} md={4} xl={6}></Col>
    </Row>
  );
}

function Mid({ props, onClick }) {
  const problems = props;
  console.log("뭐야 이거", props);
  const printProblems = (problems) => {
    const result = [];

    for (let i = 0; i < problems.length; i++) {
      result.push(<div key={i}> {problems[i]} </div>);
    }
    return result;
  };

  useEffect(() => {
    $(".ban_algo_box").click(function () {
      $(".ban_algo_box").not(this).removeClass("active");
      $(this).addClass("active");
    });
  });

  return (
    <Row justify="space-between" style={{ marginTop: "50px" }} className="ban_algo_contents">
      <Col sm={0} md={0} xl={4}></Col>
      <Col sm={7} md={7} xl={4} className="ban_algo_box" onClick={(event) => onClick(event, "1")}>
        <div className="ban_algo_problem_title">알고리즘 유형</div>
        <div className="ban_algo_problem_category">
          {printProblems(problems[0].problem_category)}
        </div>
      </Col>
      <Col sm={7} md={7} xl={4} className="ban_algo_box" onClick={(event) => onClick(event, "2")}>
        <div className="ban_algo_problem_title">알고리즘 유형</div>
        <div className="ban_algo_problem_category">
          {printProblems(problems[1].problem_category)}
        </div>
      </Col>
      <Col sm={7} md={7} xl={4} className="ban_algo_box" onClick={(event) => onClick(event, "3")}>
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
    <Row style={{ marginTop: "10px" }}>
      <Col xs={0} sm={0} md={4} xl={6}></Col>
      <Col xs={12} sm={14} md={12} xl={12} style={{ marginTop: "100px" }}></Col>
      <Col xs={12} sm={10} md={8} xl={6}>
        <img src={img_rightHand} alt="hand" className="ban_hands_right" />
        <div style={{ marginTop: "70px" }} className="ban_player_info">
          Player1
        </div>
      </Col>
    </Row>
  );
}

function App({ props, changeBanProblem }) {
  const [choose, setChoose] = React.useState("-1");
  const onClick = (event, category) => {
    console.log("선택한 문제는:" + category);
    setChoose(category);
  };

  const selected = () => {
    changeBanProblem(choose);
  };
  console.log(props);
  const [problem, setProblem] = React.useState();
  useEffect(() => {
    setProblem(props);
  }, [props]);
  useEffect(() => {
    if (choose === "1") {
      console.log("선택한 문제 번호는:" + problem[0].problem_no);
      setChoose("1");
    } else if (choose === "2") {
      console.log("선택한 문제 번호는:" + problem[1].problem_no);
      setChoose("2");
    } else if (choose === "3") {
      console.log("선택한 문제 번호는:" + problem[2].problem_no);
      setChoose("3");
    }
  }, [choose, problem]);

  return (
    <div className="matching_background">
      <UserInfo />
      <Top />
      <Mid props={props} onClick={onClick} setProblem={setProblem} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Button
          className="NanumSquare"
          style={{ width: "100px", marginTop: "10px" }}
          onClick={selected}>
          확정
        </Button>
      </div>
      <Bottom />
    </div>
  );
}

export default App;
