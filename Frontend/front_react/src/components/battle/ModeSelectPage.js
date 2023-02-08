import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Button, Modal } from "antd";
import "./ModeSelectPage.css";
import iconSpeed from "../../assets/speed_mode_icon.png";
import iconPerformance from "../../assets/performance_mode_icon.png";
import iconJava from "../../assets/java.png";
import iconPython from "../../assets/python.png";
import iconBack from "../../assets/left-arrow.png";
import iconBackSmall from "../../assets/left-arrow-small.png";
import { useRecoilState } from "recoil";
import { selectedMode, selectedLanguage } from "../../states/atoms";

function UserInfo({ setMode, setLanguage }) {
  const history = useHistory();

  const handlePageBack = () => {
    setMode("-1");
    setLanguage("-1");
    history.push("/");
  };

  return (
    <Row justify="space-between" className="battle_user_info_row">
      <Col span={1} style={{ lineHeight: "50px" }}>
        <img
          src={iconBack}
          alt="back icon"
          style={{ width: "80%", marginTop: "5px", marginLeft: "5px" }}
          onClick={handlePageBack}></img>
      </Col>
      <Col span={17}></Col>
      <Col span={1} style={{ lineHeight: "50px" }} className="battle_user_info_contents">
        멋진 티어
      </Col>
      <Col span={1} style={{ lineHeight: "50px" }} className="battle_user_info_contents">
        멋진 티어
      </Col>
      <Col
        span={3}
        style={{
          fontFamily: "NanumSquareNeo",
          fontSize: "1.5vw",
          paddingLeft: "10px",
          lineHeight: "50px",
        }}
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
          fontFamily: "NanumSquareNeo",
          color: "white",
          fontSize: "40px",
          textAlign: "center",
          marginTop: "-10vh",
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

function SelectLanguage({ setLanguage, back }) {
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
          fontFamily: "NanumSquareNeo",
          color: "white",
          fontSize: "40px",
          textAlign: "center",
          marginTop: "-10vh",
          marginBottom: "10px",
          textShadow: "0px 0px 1rem white",
        }}>
        언어를 선택하세요
      </h1>
      <div className="battle_mode_row">
        <img
          src={iconBackSmall}
          alt="back icon"
          onClick={() => {
            back("-1");
            setLanguage("-1");
          }}
          style={{ width: "10%", height: "10%", marginLeft: "-10%", marginTop: "130px" }}></img>
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
      <div className="battle_mode_box" onClick={() => setMode(gameMode)}>
        <img src={gameModeIcon} alt="mode icon" className="img_mode" />
        <div className="text_Mode">{gameMode}</div>
        <div className="battle_info_box">
          <p
            style={{
              color: "white",
              fontSize: "10px",
              textAlign: "center",
              fontFamily: "NanumSquareNeo",
            }}>
            {gameInfo1}
          </p>
          <p
            style={{
              color: "white",
              fontSize: "10px",
              textAlign: "center",
              fontFamily: "NanumSquareNeo",
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
      style={{ fontFamily: "NanumSquareNeo", color: "white", fontSize: "80px", marginLeft: "45px" }}
      className="battle_fixed_text">
      경쟁전
    </h1>
  );
}

function HandleFinishSelectButton({ mode, language }) {
  const history = useHistory();
  const hanleHistoryMatch = () => {
    showModal();
  };
  //Modal 선택 관련
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    history.push("/match");
    setIsModalOpen(false);
  };
  const handleCancle = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="modeButton" onClick={hanleHistoryMatch}>
        매칭 시작
      </div>
      <Modal
        title="게임을 시작할까요?"
        open={isModalOpen}
        closable={false}
        width={300}
        centered
        footer={null}
        style={{ textAlign: "center" }}>
        <p style={{ textAlign: "center" }}>선택한 모드 : {mode}</p>
        <p style={{ textAlign: "center" }}>선택한 언어 : {language}</p>
        <div style={{ marginTop: "10px" }}>
          <Button onClick={handleCancle} style={{ marginRight: "10px" }}>
            다시선택
          </Button>
          <Button style={{ background: "#FEF662" }} onClick={handleOk}>
            게임시작
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function App() {
  const [mode, setMode] = useRecoilState(selectedMode);
  const [language, setLanguage] = useRecoilState(selectedLanguage);
  const history = useHistory();

  useEffect(() => {
    if (mode !== "-1") {
      console.log("모드 선택 완료! mode:" + mode);
    }
  }, [mode]);

  useEffect(() => {
    if (language !== "-1") {
      console.log("언어 선택 완료! language:" + language);
    }
  }, [language, history]);

  return (
    <div className="battle_background">
      <UserInfo setMode={setMode} setLanguage={setLanguage} />
      {mode === "-1" ? (
        <SelectMode setMode={setMode} />
      ) : (
        <SelectLanguage setLanguage={setLanguage} back={setMode} />
      )}
      {mode !== "-1" && language !== "-1" ? (
        <HandleFinishSelectButton mode={mode} language={language} />
      ) : (
        <div></div>
      )}

      <FixedText />
    </div>
  );
}

export default App;
