import React from "react";
import "./ResultListPage.css";
import { Col, Row, Divider } from "antd";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import icon_vs from "../../assets/vs.png";
import { resultListPlayerInfo, resultListModeInfo, resultListResultInfo } from "../../states/atoms";

function PlayerInfo() {
  //atoms에 저장한 playerInfo를 불러옵니다.
  const playerInfo = useRecoilValue(resultListPlayerInfo);
  console.log(playerInfo);
  return (
    <Row justify="space-between">
      <Col span={6} className="result_user_info">
        {playerInfo.player1_info}
      </Col>
      <Col span={2} className="result_user_info">
        {playerInfo.player1_level}
      </Col>
      <Col span={2} className="result_user_info">
        {playerInfo.player1_tier}
      </Col>
      <Col span={3} className="result_icon_vs">
        <img src={icon_vs} alt="vs"></img>
      </Col>
      <Col span={2} className="result_enemy_info">
        {playerInfo.player2_tier}
      </Col>
      <Col span={2} className="result_enemy_info">
        {playerInfo.player2_level}
      </Col>
      <Col span={6} className="result_enemy_info">
        {playerInfo.player2_info}
      </Col>
    </Row>
  );
}

function GameInfo() {
  //atoms에 저장한 battleModeInfo를 불러옵니다.
  const ModeInfo = useRecoilValue(resultListModeInfo);
  console.log(ModeInfo);
  const gameInfoTitle = {
    padding: "10px 0",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    textAlign: "center",
    lineHeight: "12px",
    fontWeight: "bold",
  };
  const gameInfoList = {
    padding: "8px 0",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    height: "10em",
    textAlign: "center",
    lineHeight: "10em",
  };
  return (
    <div>
      <div className="result_game_mode">스피드</div>
      <PlayerInfo />
      <Divider style={{ backgroundColor: "white" }} />
      <Row gutter={[8, 8]} style={{ marginLeft: "10px", marginRight: "10px" }}>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoTitle}>문제 난이도</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoTitle}>사용 언어</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoTitle}>평균 시도</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoTitle}>걸린 시간</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoList}>{ModeInfo.problem_difficulty}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoList}>{ModeInfo.used_language}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoList}>{ModeInfo.avg_try}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={gameInfoList}>{ModeInfo.spend_time}</div>
        </Col>
      </Row>
    </div>
  );
}

function ResultPlayerInfo() {
  return (
    <div>
      <div className="result_list_info_wrap">
        <div className="result_list_circle_user"></div>
        <div className="result_list_player_info_text">내 정보</div>
        <div className="result_list_circle_enemy"></div>
        <div className="result_list_player_info_text">상대 정보</div>
      </div>
    </div>
  );
}

function ResultInfo({ sendResult }) {
  return (
    <div style={{ clear: "both" }}>
      <Row justify="space-between">
        <Col span={2} className="result_list_time">
          12분
        </Col>
        <Col span={1} className="result_list_result"></Col>
        <Col span={20} className="result_list_info">
          <Row>
            <Col span={2}>사진</Col>
            <Col span={22}>
              {sendResult.player_info}님의 {sendResult.result}코드 제출! 코드길이:
              {sendResult.code_length} 메모리:{sendResult.memory / 1024000} 걸린시간:
              {sendResult.time}
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>
    </div>
  );
}

function ResultList() {
  //atoms에 저장한 battleResultList를 불러옵니다.
  const resultList = useRecoilValue(resultListResultInfo);
  console.log("자세히보기 정보", resultList);
  const printResults = () => {
    const result = [];
    for (let i = 0; i < resultList.length; i++) {
      result.push(<ResultInfo key={i} sendResult={resultList[i]} />);
    }
    return result;
  };
  return <div style={{ clear: "both", height: "45vh" }}>{printResults()}</div>;
}

function ResultButton() {
  //페이지 이동 관련 함수/변수
  const history = useHistory();

  function hanleHistoryMatchAgain() {
    history.push("/mode");
  }
  function hanleHistoryMain() {
    history.push("/");
  }

  return (
    <Row justify="space-between" style={{ marginTop: "30px" }}>
      <Col span={8}></Col>
      <Col span={3} className="result_button" onClick={hanleHistoryMatchAgain}>
        다시하기
      </Col>
      <Col span={3} className="result_button" onClick={hanleHistoryMain}>
        그만하기
      </Col>
      <Col span={8}></Col>
    </Row>
  );
}

function App() {
  return (
    <div className="resultList_background">
      <div
        style={{
          textAlign: "center",
          fontSize: "40px",
          fontWeight: "bold",
          color: "white",
          marginTop: "90px",
        }}>
        결과 상세정보
      </div>
      <Row justify="space-between" style={{ marginTop: "70px" }}>
        <Col sm={0} md={0} lg={0} xl={2}></Col>
        <Col
          sm={24}
          md={24}
          lg={12}
          xl={7}
          className="result_list_wrap"
          style={{ overflow: "auto" }}>
          <GameInfo />
        </Col>
        <Col
          sm={24}
          md={24}
          lg={12}
          xl={12}
          className="result_list_wrap"
          style={{ overflow: "auto" }}>
          <ResultPlayerInfo />
          <ResultList />
        </Col>
        <Col sm={0} md={0} lg={0} xl={2}></Col>
      </Row>
      <ResultButton />
    </div>
  );
}

export default App;
