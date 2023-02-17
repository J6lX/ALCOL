import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Button, Modal } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedMode, selectedLanguage, matchingPlayerInfo } from "../../states/atoms";
import { LoginState } from "../../states/LoginState";
// import iconTierBronze from "../../assets/ALCOL_tiers/tier_bronze_0.png";
import "./MatchingPage.css";
import axios from "axios";

let socket = null;

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

function UserInfo() {
  const [nickname, setNickname] = React.useState("a");
  const [speedTier, setSpeedTier] = React.useState("a");
  const [speedTierAddress, setSpeedTierAddress] = React.useState("a");
  const [optTier, setOptTier] = React.useState("a");
  const [optTierAddress, setOptTierAddress] = React.useState("a");
  const [imageAddress, setImageAddress] = React.useState("a");
  var userId = useRecoilValue(LoginState);
  useEffect(() => {}, [nickname, speedTier, optTier]);

  axios
    .post("http://i8b303.p.ssafy.io:8000/user-service/getUserInfo", {
      user_id: userId,
    })
    .then(function (response) {
      setNickname(response.data.nickname);
      setSpeedTier(response.data.speed_tier);
      setOptTier(response.data.optimization_tier);
      setImageAddress(isNew(response.data.stored_file_name));
      setTimeout(() => {}, 500);
      let sptier;
      if (response.data.speed_tier[0] === "B") {
        sptier = "bronze";
      } else if (response.data.speed_tier[0] === "S") {
        sptier = "silver";
      } else if (response.data.speed_tier[0] === "G") {
        sptier = "gold";
      } else if (response.data.speed_tier[0] === "P") {
        sptier = "platinum";
      } else if (response.data.speed_tier[0] === "D") {
        sptier = "diamond";
      } else if (response.data.speed_tier[0] === "A") {
        sptier = "alcol";
      }
      let spLV = response.data.speed_tier[response.data.speed_tier.length - 1];

      setSpeedTierAddress(require("../../assets/ALCOL_tiers/tier_" + sptier + "_" + spLV + ".png"));

      let optier;
      if (response.data.optimization_tier[0] === "B") {
        optier = "bronze";
      } else if (response.data.optimization_tier[0] === "S") {
        optier = "silver";
      } else if (response.data.optimization_tier[0] === "G") {
        optier = "gold";
      } else if (response.data.optimization_tier[0] === "P") {
        optier = "platinum";
      } else if (response.data.optimization_tier[0] === "D") {
        optier = "diamond";
      } else if (response.data.optimization_tier[0] === "A") {
        optier = "alcol";
      }
      let opLV = response.data.optimization_tier[response.data.optimization_tier.length - 1];

      setOptTierAddress(require("../../assets/ALCOL_tiers/tier_" + optier + "_" + opLV + ".png"));
    })
    .catch((error) => {
      console.log("error", error);
    });
  return (
    <Row justify="end" className="battle_user_info_row">
      <Col
        span={3}
        style={{
          display: "flex",
          alignItems: "center",
          fontFamily: "NanumSquareNeo",
          fontSize: "1.5vw",
          paddingLeft: "10px",
          lineHeight: "50px",
        }}
        className="battle_user_info_contents">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img
            src={imageAddress}
            alt=""
            style={{ width: "40px", height: "40px", marginRight: "10px", borderRadius: "50%" }}
          />
        </div>
        {nickname}
      </Col>
      <Col span={1} style={{ lineHeight: "50px" }} className="battle_user_info_contents">
        <img src={speedTierAddress} alt="tier" className="icon_tier"></img>
      </Col>
      <Col span={1} style={{ lineHeight: "50px" }} className="battle_user_info_contents">
        <img src={optTierAddress} alt="tier" className="icon_tier"></img>
      </Col>
    </Row>
  );
}

function App() {
  //mode 선택 관련
  const [userSelectedMode, setuserSelectedMode] = useRecoilState(selectedMode);
  const [userSelectLanguage, setuserSelectLanguage] = useRecoilState(selectedLanguage);
  //matching 관련
  var userId = useRecoilValue(LoginState);
  const [playerInfo, setPlayerInfo] = useRecoilState(matchingPlayerInfo);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const history = useHistory();

  var obj;

  if (playerInfo.otherId === "") {
    //프론트에서 소켓을 받기 위해 backend로 연결할때 필요한 코드
    // useEffect(()=>{const socket = new WebSocket(`ws://i8b303.p.ssafy.io:9111/websocket`)}, [])
    socket = new WebSocket(`ws://i8b303.p.ssafy.io:8000/match-service`);

    socket.addEventListener("open", () => {
      const mode = userSelectedMode;
      const mmr = "1200";
      const id = userId;
      const language = userSelectLanguage;
      const type = "1";
      const data = JSON.stringify({
        method: "init",
        // 'name': name,
        type: type,
        Mode: mode,
        MMR: mmr,
        id: id,
        Language: language,
      });
      socket.send(data);
    });
    //message를 받을 때 발생
    socket.addEventListener("message", (message) => {
      obj = JSON.parse(message.data);

      if (
        obj !== null &&
        playerInfo.otherId === "" &&
        playerInfo.userId === "" &&
        playerInfo.hostCheck === ""
      ) {
        onHandlePlayerGet();
      }
    });

    function onHandlePlayerGet() {
      setPlayerInfo(obj);
      setTimeout(() => {
        socket.close();
        history.push("/battle");
      }, 2000);
    }

    //서버가 오프라인일때 발생하는 코드
    socket.addEventListener("close", () => {
      // socket.send(JSON.stringify("끊어주세요"));
    });
  }

  //Modal 선택 관련
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancle = () => {
    //초기화
    // socket.close();
    socket.send(
      JSON.stringify({
        method: "matchCancel",
        userId: userId,
      })
    );
    setuserSelectedMode("-1");
    setuserSelectLanguage("-1");
    setPlayerInfo({ userId: "", otherId: "", hostCheck: "" });
    history.push("/");
    setIsModalOpen(false);
  };

  function handleHistoryMatchCancel() {
    showModal();
  }
  return (
    <div className="matching_background">
      <UserInfo />
      <div
        style={{
          color: "white",
          fontFamily: "NanumSquareNeo",
          fontWeight: "lighter",
          textAlign: "center",
          marginTop: "25vh",
        }}>
        상대를 찾는중...
        <div className="wrapper" style={{ marginTop: "-30px" }}>
          <svg
            className="hourglass"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 206"
            preserveAspectRatio="none">
            <path
              className="middle"
              d="M120 0H0v206h120V0zM77.1 133.2C87.5 140.9 92 145 92 152.6V178H28v-25.4c0-7.6 4.5-11.7 14.9-19.4 6-4.5 13-9.6 17.1-17 4.1 7.4 11.1 12.6 17.1 17zM60 89.7c-4.1-7.3-11.1-12.5-17.1-17C32.5 65.1 28 61 28 53.4V28h64v25.4c0 7.6-4.5 11.7-14.9 19.4-6 4.4-13 9.6-17.1 16.9z"
            />
            <path
              className="outer"
              d="M93.7 95.3c10.5-7.7 26.3-19.4 26.3-41.9V0H0v53.4c0 22.5 15.8 34.2 26.3 41.9 3 2.2 7.9 5.8 9 7.7-1.1 1.9-6 5.5-9 7.7C15.8 118.4 0 130.1 0 152.6V206h120v-53.4c0-22.5-15.8-34.2-26.3-41.9-3-2.2-7.9-5.8-9-7.7 1.1-2 6-5.5 9-7.7zM70.6 103c0 18 35.4 21.8 35.4 49.6V192H14v-39.4c0-27.9 35.4-31.6 35.4-49.6S14 81.2 14 53.4V14h92v39.4C106 81.2 70.6 85 70.6 103z"
            />
          </svg>
        </div>
      </div>
      <div className="matching_helper">
        <div style={{ color: "white", fontFamily: "NanumSquareNeo" }}>그거 아셨나요?</div>
        <div style={{ color: "white", fontFamily: "NanumSquareNeo", fontWeight: "lighter" }}>
          배틀에서는 공평성을 위해 코드를 복사 붙여넣기 할 수 없어요... 자신의 코드가 필요하시다면
          배틀이 끝나고 나서 자신의 코드를 복사해갈 수 있어요!
        </div>
      </div>
      <div className="matchingButton" onClick={handleHistoryMatchCancel}>
        취소
      </div>
      <Modal
        title="😂"
        open={isModalOpen}
        closable={false}
        width={300}
        centered
        footer={null}
        style={{ textAlign: "center" }}>
        <p style={{ textAlign: "center" }}>상대방을 열심히 찾는 중입니다</p>
        <p style={{ textAlign: "center" }}>매칭을 정말 취소할까요..?</p>
        <div style={{ marginTop: "10px" }}>
          <Button onClick={handleCancle} style={{ marginRight: "10px" }}>
            취소할게요
          </Button>
          <Button style={{ background: "#FEF662" }} onClick={handleOk}>
            아니요
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
