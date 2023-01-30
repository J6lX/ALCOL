import React from "react";
import { Col, Row } from "antd";
import "./ModeSelectPage.css";
import iconSpeed from "../../assets/speed_mode_icon.png";
import iconPerformance from "../../assets/performance_mode_icon.png";
import iconJava from "../../assets/java.png";
import iconPython from "../../assets/python.png";

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

function SelectMode({ setMode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}>
      <h1
        style={{
          color: "white",
          fontSize: "40px",
          textAlign: "center",
          marginBottom: "10px",
          textShadow: "0px 0px 1rem white",
        }}>
        모드를 선택하세요
      </h1>
      <div className="battle_mode_row">
        <SelectBox
          gameMode={"스피드"}
          gameModeIcon={iconSpeed}
          gameInfo1={"최대한 빠르게"}
          gameInfo2={"정답을 맞추세요!"}
          avgTime={"5"}
          setMode={setMode}
        />
        <SelectBox
          gameMode={"최적화"}
          gameModeIcon={iconPerformance}
          gameInfo1={"최대한 좋은 성능의"}
          gameInfo2={"코드를 짜세요!"}
          avgTime={"5"}
          setMode={setMode}
        />
      </div>
    </div>
  );
}

function SelectLanguage({ setLanguage }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}>
      <h1
        style={{
          color: "white",
          fontSize: "40px",
          textAlign: "center",
          marginBottom: "10px",
          textShadow: "0px 0px 1rem white",
        }}>
        언어를 선택하세요
      </h1>
      <div className="battle_mode_row">
        <SelectBox
          gameMode={"자바"}
          gameModeIcon={iconJava}
          gameInfo1={"자바를 사용해서"}
          gameInfo2={"문제를 풉니다"}
          avgTime={"5"}
          setMode={setLanguage}
        />
        <SelectBox
          gameMode={"파이썬"}
          gameModeIcon={iconPython}
          gameInfo1={"파이썬을 사용해서"}
          gameInfo2={"문제를 풉니다"}
          avgTime={"5"}
          setMode={setLanguage}
        />
      </div>
    </div>
  );
}

function SelectBox({ gameMode, gameModeIcon, gameInfo1, gameInfo2, avgTime, setMode }) {
  return (
    <div>
      <div className="battle_mode_box" onClick={() => setMode("gameMode")}>
        <img src={gameModeIcon} alt="mode icon" className="img_mode" />
        <div className="text_Mode">{gameMode}</div>
        <div className="battle_info_box">
          <p
            style={{
              color: "white",
              fontSize: "10px",
              textAlign: "center",
            }}>
            {gameInfo1}
          </p>
          <p
            style={{
              color: "white",
              fontSize: "10px",
              textAlign: "center",
            }}>
            {gameInfo2}
          </p>
        </div>
        <div style={{ textAlign: "center", fontSize: "40px", color: "white" }}> .</div>
      </div>
      <div className="battle_avg_time_box"> 평균 대기 시간:&lt;{avgTime}분</div>
    </div>
  );
}

function FixedText() {
  return (
    <h1
      style={{ color: "white", fontSize: "80px", marginLeft: "30px" }}
      className="battle_fixed_text">
      경쟁전
    </h1>
  );
}

function App() {
  const [mode, setMode] = React.useState("-1");
  // const [language, setLanguage] = React.useState("-1");
  return (
    <div className="battle_background">
      <UserInfo />
      {mode === "-1" ? <SelectMode setMode={setMode} /> : <SelectLanguage />}
      <FixedText />
    </div>
  );
}

export default App;
