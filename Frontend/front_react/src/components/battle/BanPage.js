import React, { useEffect } from "react";
import { Button, Col, Row, Progress } from "antd";
import $ from "jquery";
import "./BanPage.css";
import img_leftHand from "../../assets/leftHand.png";
import img_rightHand from "../../assets/rightHand.png";

function Top({ userInfo, timeOut }) {
  // const [secs, setTime] = React.useState(0);
  console.log("TopuserInfo", userInfo);
  let secs = 0;
  const tick = () => {
    if (secs < 30) {
      secs += 1;
    } else {
      timeOut("timeout");
    }
  };

  useEffect(() => {
    //1초
    const timerId = setInterval(() => {
      tick();
      console.log(secs);
    }, 999);
    return () => clearInterval(timerId);
  });

  return (
    <Row style={{ marginTop: "70px" }}>
      <Col xs={12} sm={10} md={8} xl={6}>
        <div
          className="ban_player_info"
          style={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
          <img
            src={userInfo.user.imageAddress}
            alt=""
            style={{
              width: "60px",
              height: "60px",
              marginRight: "10px",
              borderRadius: "50%",
              border: "2px solid #E51C29",
            }}
          />
          {userInfo.user.nick}
        </div>
        <img src={img_leftHand} alt="hand" className="ban_hands_left" />
      </Col>
      <Col xs={12} sm={14} md={12} xl={12} style={{ marginTop: "50px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="ban_title">금지할 문제를 선택해주세요</div>
          <div className="ban_info">선택된 문제는 이번 게임에서 출제되지 않습니다.</div>
          <div style={{ width: "25vw" }}>
            <Progress style={{ zIndex: "10" }} percent={(20 / 31) * 100} showInfo={true} />
          </div>
        </div>
      </Col>
      <Col xs={0} sm={0} md={4} xl={6}></Col>
    </Row>
  );
}

function Mid({ props, onClick }) {
  const problems = props;
  console.log("뭐야 이거", props);
  const keys = Object.keys(problems);
  console.log(keys);
  const printProblems = (number) => {
    if (keys.length !== 0) {
      const result = [];

      for (let i = 0; i < problems[keys[number]].length; i++) {
        result.push(<div key={i}> {problems[keys[number]][i]} </div>);
      }
      return result;
    }
  };

  useEffect(() => {
    $(".ban_algo_box").click(function () {
      $(".ban_algo_box").not(this).removeClass("active");
      $(this).addClass("active");
    });
  });

  return (
    <Row justify="space-between" style={{ marginTop: "50px" }} className="ban_algo_contents">
      <Col xl={4}></Col>
      <Col xl={4} className="ban_algo_box" onClick={(event) => onClick(event, "1")}>
        <div className="ban_algo_problem_title">문제 1</div>
        <div className="ban_algo_problem_category">{printProblems(0)}</div>
      </Col>
      <Col xl={4} className="ban_algo_box" onClick={(event) => onClick(event, "2")}>
        <div className="ban_algo_problem_title">문제 2</div>
        <div className="ban_algo_problem_category">{printProblems(1)}</div>
      </Col>
      <Col xl={4} className="ban_algo_box" onClick={(event) => onClick(event, "3")}>
        <div className="ban_algo_problem_title">문제 3</div>
        <div className="ban_algo_problem_category">{printProblems(2)}</div>
      </Col>
      <Col xl={4}></Col>
    </Row>
  );
}

function Bottom(userInfo) {
  return (
    <Row style={{ marginTop: "10px" }}>
      <Col xs={0} sm={0} md={4} xl={6}></Col>
      <Col xs={12} sm={14} md={12} xl={12} style={{ marginTop: "100px" }}></Col>
      <Col xs={12} sm={10} md={8} xl={6}>
        <img src={img_rightHand} alt="hand" className="ban_hands_right" />
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "70px" }}
          className="ban_player_info">
          <img
            src={userInfo.userInfo.other.imageAddress}
            alt=""
            style={{
              width: "60px",
              height: "60px",
              marginRight: "10px",
              borderRadius: "50%",
              border: "2px solid #E51C29",
            }}
          />
          {userInfo.userInfo.other.nick}
        </div>
      </Col>
    </Row>
  );
}

function App({ props, battleuserinfo, changeBanProblem }) {
  const [choose, setChoose] = React.useState("-1");
  const [loading, setLoading] = React.useState(false);
  // var playerInfo = useRecoilValue(matchingPlayerInfo);
  // console.log(playerInfo.otherId);
  const propsdata = props[0];
  const onClick = (event, category) => {
    console.log("선택한 문제는:" + category);
    setChoose(category);
  };

  const selected = () => {
    if (choose === "1") {
      changeBanProblem(keys[0]);
    } else if (choose === "2") {
      changeBanProblem(keys[1]);
    } else if (choose === "3") {
      changeBanProblem(keys[2]);
    } else {
      console.log("제대로 하세요... 쫌...");
    }
    setLoading(true);
  };

  const timeOut = (data) => {
    changeBanProblem(data);
  };
  // console.log(props);
  const [problem, setProblem] = React.useState();
  useEffect(() => {
    setProblem(propsdata);
  }, [propsdata]);
  const keys = Object.keys(propsdata);
  useEffect(() => {
    if (choose === "1") {
      console.log("선택한 문제 번호는:" + keys[0]);
      setChoose("1");
    } else if (choose === "2") {
      console.log("선택한 문제 번호는:" + keys[1]);
      setChoose("2");
    } else if (choose === "3") {
      console.log("선택한 문제 번호는:" + keys[2]);
      setChoose("3");
    }
  }, [choose, problem, keys]);

  return (
    <div className="matching_background">
      <Top userInfo={battleuserinfo} timeOut={timeOut} />
      <Mid props={propsdata} onClick={onClick} setProblem={setProblem} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Button
          loading={loading}
          className="NanumSquare"
          style={{ width: "100px", marginTop: "60px" }}
          onClick={selected}>
          확정
        </Button>
      </div>
      <Bottom userInfo={battleuserinfo} />
    </div>
  );
}

export default App;
