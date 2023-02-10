import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Button, Modal } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedMode, selectedLanguage, matchingPlayerInfo } from "../../states/atoms";
import { LoginState } from "../../states/LoginState";
import iconTierBronze from "../../assets/ALCOL tiers/tier_bronze_0.png";
import "./MatchingPage.css";
import axios from "axios";

function UserInfo() {
  const [nickname, setNickname] = React.useState("a");
  const [speedTier, setSpeedTier] = React.useState("a");
  const [optTier, setOptTier] = React.useState("a");
  var userId = useRecoilValue(LoginState);
  useEffect(() => {}, [nickname, speedTier, optTier]);

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
  return (
    <Row justify="end" className="battle_user_info_row">
      <Col span={1} style={{ lineHeight: "50px" }} className="battle_user_info_contents">
        <img src={iconTierBronze} alt="tier" className="icon_tier"></img>
      </Col>
      <Col span={1} style={{ lineHeight: "50px" }} className="battle_user_info_contents">
        <img src={iconTierBronze} alt="tier" className="icon_tier"></img>
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
        {nickname}
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
    
    
    // useEffect(() => {
    //   if (playerInfo.otherId !== "") {
    //     console.log("나는 useEffect playerInfo를 바꿔요");
    //     console.log(playerInfo);
    //     console.log(playerInfo.otherId);
    //   }
    // }, [playerInfo]);

    console.log("<< 매칭페이지 >>");
    console.log(userSelectedMode);
    console.log(userSelectLanguage);



    var obj;
    
    if (playerInfo.otherId === ""){
      //프론트에서 소켓을 받기 위해 backend로 연결할때 필요한 코드
      // useEffect(()=>{const socket = new WebSocket(`ws://i8b303.p.ssafy.io:9111/websocket`)}, [])
      const socket = new WebSocket(`ws://i8b303.p.ssafy.io:9111/websocket`)
      console.log("소켓 만들어짐?", socket)

      socket.addEventListener("open", () => {
          console.log("---서버와 연결 됨---");
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
      console.log("서버로 부터 메세지를 받았습니다", message.data);
      obj = JSON.parse(message.data);

      if (obj !== null && playerInfo.otherId === "" && playerInfo.userId === "" && playerInfo.hostCheck === "") {
        onHandlePlayerGet();
      }
    });

    function onHandlePlayerGet() {
      setPlayerInfo(obj)
      setTimeout(() => {
        socket.send(JSON.stringify("끊어주세요"));
        socket.close()
        console.log("플레이어 정보를 저장했다");
        console.log(playerInfo);
        history.push("/battle");}, 
        2000)
    };

    //서버가 오프라인일때 발생하는 코드
    socket.addEventListener("close", () => {
      console.log("---서버와 연결 끊김---");
      socket.send(JSON.stringify("끊어주세요"));
    });
    };
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
          이것저것..이것저것..이것저것..이것저것..이것저것..이것저것..이것저것..이것저것..이것저것..이것저것..
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
