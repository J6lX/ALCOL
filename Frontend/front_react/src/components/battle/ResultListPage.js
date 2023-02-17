import React from "react";
import "./ResultListPage.css";
import { Col, Row, Divider } from "antd";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import icon_vs from "../../assets/vs.png";
import { resultListModeInfo, resultListResultInfo } from "../../states/atoms";

// 사진이 없는 경우 기본 사진을 반환하는 용도
function isNew(picture) {
  // 기존 사진이 있는 경우
  if (picture) {
    return picture;
  }
  // 기존 사진이 없는 경우
  else {
    return `https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png`;
  }
}

function PlayerInfo({ battleuserinfo, battleMode }) {
  //atoms에 저장한 playerInfo를 불러옵니다.
  // const playerInfo = useRecoilValue(resultListPlayerInfo);
  let sptier;
  if (battleuserinfo.user.speedTier[0] === "B") {
    sptier = "bronze";
  } else if (battleuserinfo.user.speedTier[0] === "S") {
    sptier = "silver";
  } else if (battleuserinfo.user.speedTier[0] === "G") {
    sptier = "gold";
  } else if (battleuserinfo.user.speedTier[0] === "P") {
    sptier = "platinum";
  } else if (battleuserinfo.user.speedTier[0] === "D") {
    sptier = "diamond";
  } else if (battleuserinfo.user.speedTier[0] === "A") {
    sptier = "alcol";
  }
  let spLV = battleuserinfo.user.speedTier[battleuserinfo.user.speedTier.length - 1];

  const speedTierAddress = require("../../assets/ALCOL_tiers/tier_" + sptier + "_" + spLV + ".png");

  let optier;
  if (battleuserinfo.user.optTier[0] === "B") {
    optier = "bronze";
  } else if (battleuserinfo.user.optTier[0] === "S") {
    optier = "silver";
  } else if (battleuserinfo.user.optTier[0] === "G") {
    optier = "gold";
  } else if (battleuserinfo.user.optTier[0] === "P") {
    optier = "platinum";
  } else if (battleuserinfo.user.optTier[0] === "D") {
    optier = "diamond";
  } else if (battleuserinfo.user.optTier[0] === "A") {
    optier = "alcol";
  }
  let opLV = battleuserinfo.user.optTier[battleuserinfo.user.optTier.length - 1];

  const optTierAddress = require("../../assets/ALCOL_tiers/tier_" + optier + "_" + opLV + ".png");

  let othersptier;
  if (battleuserinfo.other.speedTier[0] === "B") {
    othersptier = "bronze";
  } else if (battleuserinfo.other.speedTier[0] === "S") {
    othersptier = "silver";
  } else if (battleuserinfo.other.speedTier[0] === "G") {
    othersptier = "gold";
  } else if (battleuserinfo.other.speedTier[0] === "P") {
    othersptier = "platinum";
  } else if (battleuserinfo.other.speedTier[0] === "D") {
    othersptier = "diamond";
  } else if (battleuserinfo.other.speedTier[0] === "A") {
    othersptier = "alcol";
  }
  let otherspLV = battleuserinfo.other.speedTier[battleuserinfo.other.speedTier.length - 1];

  const otherSpeedTierAddress = require("../../assets/ALCOL_tiers/tier_" + othersptier + "_" + otherspLV + ".png");

  let otheroptier;
  if (battleuserinfo.other.optTier[0] === "B") {
    otheroptier = "bronze";
  } else if (battleuserinfo.other.optTier[0] === "S") {
    otheroptier = "silver";
  } else if (battleuserinfo.other.optTier[0] === "G") {
    otheroptier = "gold";
  } else if (battleuserinfo.other.optTier[0] === "P") {
    otheroptier = "platinum";
  } else if (battleuserinfo.other.optTier[0] === "D") {
    otheroptier = "diamond";
  } else if (battleuserinfo.other.optTier[0] === "A") {
    otheroptier = "alcol";
  }
  let otheropLV = battleuserinfo.other.optTier[battleuserinfo.other.optTier.length - 1];

  const otherOptTierAddress = require("../../assets/ALCOL_tiers/tier_" + otheroptier + "_" + otheropLV + ".png");


  return (
    <Row justify="space-between">
      <Col span={6} className="NanumSquare result_user_info">
        {battleuserinfo.user.nick}
      </Col>
      <Col span={2} className="NanumSquare result_user_info">
        {battleuserinfo.user.level}
      </Col>
      <Col span={2} className="NanumSquare result_user_info">
        {battleMode === "speed" && <img src={speedTierAddress} alt="tier_image1" style={{ width: "35px" }}/> }
        {battleMode === "optimization" && <img src={optTierAddress} alt="tier_image2" style={{ width: "35px" }} />}
      </Col>
        <img src={icon_vs} alt="vs" style={{ zIndex: "5"}}></img>
      <Col span={2} className="NanumSquare result_enemy_info">
        {battleMode === "speed" && <img src={otherSpeedTierAddress} alt="tier_image3" style={{ width: "35px" }} /> }
        {battleMode === "optimization" && <img src={otherOptTierAddress} alt="tier_image4" style={{ width: "35px" }} />}
      </Col>
      <Col span={2} className="NanumSquare result_enemy_info">
        {battleuserinfo.other.level}
      </Col>
      <Col span={6} className="NanumSquare result_enemy_info">
        {battleuserinfo.other.nick}
      </Col>
    </Row>
  );
}

function GameInfo({ battleuserinfo, problemInfo, battleMode, battleLanguage }) {
  //atoms에 저장한 battleModeInfo를 불러옵니다.
  const ModeInfo = useRecoilValue(resultListModeInfo);
  const resultList = useRecoilValue(resultListResultInfo);
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
  let mode = "";
  if (battleMode === "speed") {
    mode = "스피드";
  } else if (battleMode === "optimization") {
    mode = "최적화";
  }
  return (
    <div>
      <div className="result_game_mode">{mode}</div>
      <PlayerInfo battleuserinfo={battleuserinfo} battleMode={battleMode} />
      <Divider style={{ backgroundColor: "white" }} />
      <Row gutter={[8, 8]} style={{ marginLeft: "10px", marginRight: "10px" }}>
        <Col className="gutter-row" span={6}>
          <div className="NanumSquare" style={gameInfoTitle}>문제 난이도</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="NanumSquare" style={gameInfoTitle}>사용 언어</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="NanumSquare" style={gameInfoTitle}>평균 시도</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="NanumSquare" style={gameInfoTitle}>걸린 시간</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="NanumSquare" style={gameInfoList}>{problemInfo.prob_tier}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="NanumSquare" style={gameInfoList}>{battleLanguage}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="NanumSquare" style={gameInfoList}>{resultList.length/2}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="NanumSquare" style={gameInfoList}>{ModeInfo.spend_time}</div>
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
        <div className="NanumSquare result_list_player_info_text">내 정보</div>
        <div className="result_list_circle_enemy"></div>
        <div className="NanumSquare result_list_player_info_text">상대 정보</div>
      </div>
      <br />
      <br />
    </div>
  );
}

function ResultInfo({ sendResult, battleuserinfo }) {
  let result = "";
  if (sendResult.result === "accepted") {
    result = "성공적인 ";
  } else {
    result = "아쉬웠던 ";
  }
  // const userImageAddress = battleuserinfo.user.imageAddress
  // const otherImageAddress = battleuserinfo.other.imageAddress
  return (
    <div style={{ clear: "both" }}>
      <Row justify="space-between">
        { sendResult.nick === "me" && <Col span={1} className="result_list_result" style={{ borderRadius: "3px", marginLeft: "20px"}}></Col>}
        { sendResult.nick === "other" && <Col span={1} className="result_list_result_yellow" style={{ borderRadius: "3px", marginLeft: "20px"}}></Col>}
        <Col span={20} className="result_list_info" style={{ borderRadius: "3px" }}>
          <Row style={{display: "flex"}}>
          { sendResult.nick === "me" && <Col span={1}><img src={isNew(battleuserinfo.user.imageAddress)} alt="profile" style={{ borderRadius: "50%", height:"40px", marginLeft: "10px" }} /></Col> }
            { sendResult.nick === "other" && <Col span={1}><img src={isNew(battleuserinfo.other.imageAddress)} alt="profile2" style={{ borderRadius: "50%", height:"40px", marginLeft: "10px" }} /></Col> }
            { sendResult.result === "accepted" && 
              <Col span={22}>
                { sendResult.nick === "me" && <p className="NanumSquare">&nbsp;&nbsp;&nbsp;{battleuserinfo.user.nick}님의 {result}코드 제출! &nbsp;&nbsp;&nbsp; 메모리:{" "}
                {sendResult.memory / 1024000}
                {sendResult.memory} MB 실행시간:
                {sendResult.time} ms</p>}
                { sendResult.nick === "other" && <p className="NanumSquare">&nbsp;&nbsp;&nbsp;{battleuserinfo.other.nick}님의 {result}코드 제출! &nbsp;&nbsp;&nbsp; 메모리:{" "}
                {sendResult.memory / 1024000}
                {sendResult.memory} MB 실행시간:
                {sendResult.time} ms</p>}
              </Col>
            }
            { sendResult.result === "error" && 
              <Col span={22}>
                { sendResult.nick === "me" && <p className="NanumSquare">&nbsp;&nbsp;&nbsp;{battleuserinfo.user.nick}님의 {result}코드 제출! &nbsp;&nbsp;&nbsp; {sendResult.error}</p>}
                { sendResult.nick === "other" && <p className="NanumSquare">&nbsp;&nbsp;&nbsp;{battleuserinfo.other.nick}님의 {result}코드 제출! &nbsp;&nbsp;&nbsp; {sendResult.error}</p>}
              </Col>
            }
            { sendResult.result !== "error" && sendResult.result !== "accepted" && 
              <Col span={22}>
                { sendResult.nick === "me" && <p className="NanumSquare" style={{height:"30px"}}>&nbsp;&nbsp;&nbsp;{battleuserinfo.user.nick}님의 {result}코드 제출! &nbsp;&nbsp;&nbsp; 테스트케이스: {sendResult.result}</p>}
                { sendResult.nick === "other" && <p className="NanumSquare" style={{height:"30px"}}>&nbsp;&nbsp;&nbsp;{battleuserinfo.other.nick}님의 {result}코드 제출! &nbsp;&nbsp;&nbsp; 테스트케이스: {sendResult.result}</p>}
              </Col>
            }
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>
    </div>
  );
}

function ResultList({battleuserinfo}) {
  //atoms에 저장한 battleResultList를 불러옵니다.
  const resultList = useRecoilValue(resultListResultInfo);
  const printResults = () => {
    const result = [];
    for (let i = 0; i < resultList.length; i++) {
      result.push(<ResultInfo key={i} sendResult={resultList[i]} battleuserinfo={battleuserinfo} />);
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
        <p className="NanumSquare" style={{margin:"auto"}}>다시하기</p>
      </Col>
      <Col span={3} className="result_button" onClick={hanleHistoryMain}>
      <p className="NanumSquare" style={{margin:"auto"}}>그만하기</p>
      </Col>
      <Col span={8}></Col>
    </Row>
  );
}

function App({ problemInfo, battleMode, battleLanguage, battleuserinfo }) {
  return (
    <div className="resultList_background">
      <div
        className="NanumSquare"
        style={{
          textAlign: "center",
          fontSize: "40px",
          fontWeight: "bold",
          color: "white",
          marginTop: "90px",
        }}>
        배틀 상세 결과
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
          <GameInfo
            battleuserinfo={battleuserinfo}
            problemInfo={problemInfo}
            battleMode={battleMode}
            battleLanguage={battleLanguage}
          />
        </Col>
        <Col
          sm={24}
          md={24}
          lg={12}
          xl={12}
          className="result_list_wrap"
          style={{ overflow: "auto" }}>
          <ResultPlayerInfo />
          <ResultList battleuserinfo={battleuserinfo}/>
        </Col>
        <Col sm={0} md={0} lg={0} xl={2}></Col>
      </Row>
      <ResultButton />
    </div>
  );
}

export default App;
