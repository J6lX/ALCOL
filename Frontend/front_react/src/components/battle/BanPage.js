import React, { useEffect } from "react";
import { Button, Col, Row, Progress } from "antd";
import $ from "jquery";
import "./BanPage.css";
import img_leftHand from "../../assets/leftHand.png";
import img_rightHand from "../../assets/rightHand.png";
// import CountDownTimer from "./CountDownTimer";
import { useRecoilValue } from "recoil";
import { matchingPlayerInfo } from "../../states/atoms";
import { LoginState } from "../../states/LoginState";
import iconTierBronze from "../../assets/ALCOL tiers/tier_bronze_0.png";
import axios from "axios";

function UserInfo() {
  const [nickname, setNickname] = React.useState("a");
  const [speedTier, setSpeedTier] = React.useState("a");
  const [optTier, setOptTier] = React.useState("a");
  const [othernickname, setOtherNickname] = React.useState("b");
  const [otherspeedTier, setOtherSpeedTier] = React.useState("b");
  const [otheroptTier, setOtherOptTier] = React.useState("b");
  var userId = useRecoilValue(LoginState);
  const playerInfo = useRecoilValue(matchingPlayerInfo);
  let otherId = playerInfo.otherId;
  useEffect(() => {}, [nickname, speedTier, optTier]);
  useEffect(() => {}, [othernickname, otherspeedTier, otheroptTier]);

  useEffect(() => {
    axios
      .post("http://i8b303.p.ssafy.io:8000/user-service/getUserInfo", {
        user_id: userId,
      })
      .then(function (response) {
        setNickname(response.data.nickname);
        setSpeedTier(response.data.speedTier);
        setOptTier(response.data.optimizationTier);
      })
      .catch((error) => {
        let customCode = error.response.data.custom_code;
        if (
          customCode === "100" ||
          customCode === "101" ||
          customCode === "102" ||
          customCode === "103" ||
          customCode === "104" ||
          customCode === "105"
        ) {
          // 로그인 실패 시 표시하는 내용
          alert(error.response.data.description);
        }
      });
    axios
      .post("http://i8b303.p.ssafy.io:8000/user-service/getUserInfo", {
        user_id: otherId,
      })
      .then(function (response) {
        setOtherNickname(response.data.nickname);
        setOtherSpeedTier(response.data.speedTier);
        setOtherOptTier(response.data.optimizationTier);
      })
      .catch((error) => {
        let customCode = error.response.data.custom_code;
        if (
          customCode === "100" ||
          customCode === "101" ||
          customCode === "102" ||
          customCode === "103" ||
          customCode === "104" ||
          customCode === "105"
        ) {
          // 로그인 실패 시 표시하는 내용
          alert(error.response.data.description);
        }
      });
  }, [userId, otherId]);
  return (
    <Row justify="end" className="battle_user_info_row">
      <Col
        span={1}
        style={{ fontSize: "1vw", lineHeight: "50px" }}
        className="battle_user_info_contents">
        <img src={iconTierBronze} alt="tier" className="icon_tier"></img>
      </Col>
      <Col
        span={1}
        style={{ fontSize: "1vw", lineHeight: "50px" }}
        className="battle_user_info_contents">
        <img src={iconTierBronze} alt="tier" className="icon_tier"></img>
      </Col>
      <Col
        span={3}
        style={{ fontSize: "1.5vw", paddingLeft: "10px", lineHeight: "50px" }}
        className="battle_user_info_contents">
        {nickname}
      </Col>
    </Row>
  );
}

function Top({ timeOut }) {
  const [secs, setTime] = React.useState(0);

  const tick = () => {
    if (secs < 180) {
      setTime(secs + 1);
    } else {
      timeOut("timeout");
    }
  };

  useEffect(() => {
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="ban_title">금지할 문제를 선택해주세요</div>
          <div className="ban_info">선택된 문제는 이번 게임에서 출제되지 않습니다.</div>
          <div style={{ width: "25vw" }}>
            <Progress
              style={{ zIndex: "10" }}
              percent={(secs / 181) * 100}
              showInfo={false}
              strokeColor={{
                "0%": "#5CFDFD",
                "100%": "#FEF15D",
              }}
            />
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
    const result = [];

    for (let i = 0; i < problems[keys[number]].length; i++) {
      result.push(<div key={i}> {problems[keys[number]][i]} </div>);
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
        <div className="ban_algo_problem_title">문제 1</div>
        <div className="ban_algo_problem_category">{printProblems(0)}</div>
      </Col>
      <Col sm={7} md={7} xl={4} className="ban_algo_box" onClick={(event) => onClick(event, "2")}>
        <div className="ban_algo_problem_title">문제 2</div>
        <div className="ban_algo_problem_category">{printProblems(1)}</div>
      </Col>
      <Col sm={7} md={7} xl={4} className="ban_algo_box" onClick={(event) => onClick(event, "3")}>
        <div className="ban_algo_problem_title">문제 3</div>
        <div className="ban_algo_problem_category">{printProblems(2)}</div>
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
  // var playerInfo = useRecoilValue(matchingPlayerInfo);
  // console.log(playerInfo.otherId);
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
  };

  const timeOut = (data) => {
    changeBanProblem(data);
  };
  // console.log(props);
  const [problem, setProblem] = React.useState();
  useEffect(() => {
    setProblem(props);
  }, [props]);
  const keys = Object.keys(props);
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
      <UserInfo />
      <Top timeOut={timeOut} />
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
