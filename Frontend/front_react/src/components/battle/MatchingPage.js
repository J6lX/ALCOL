import React from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Button, Modal } from "antd";
import "./MatchingPage.css";
import { useRecoilState } from "recoil";
import { selectedMode, selectedLanguage } from "../../states/atoms";

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

function App() {
  //websocket 관련 전체 코드는 여기...
  //https://github.com/Garden1298/ZoomClone/blob/master/src/public/js/app.js
  //프론트에서 소켓을 받기 위해 backend로 연결할때 필요한 코드
  const socket = new WebSocket(`ws://${window.location.host}`);
  const [state, setState] = React.useState("상대를 찾는중..");

  function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
  }

  //socket이 connection을 open했을때 발생
  socket.addEventListener("open", () => {
    console.log("---서버와 연결 됨---");
    //서버로 뭔가를 보내기
    const input = "서버로 메세지를 보냅니다";
    socket.send(makeMessage("new_Message", input));
  });

  //message를 받을 때 발생
  socket.addEventListener("message", (message) => {
    console.log("서버로 부터 받은 메세지 : " + message.data);
    if (message.data === "success") {
      console.log("매칭되었습니다!");
      setState("매칭 완료.. 상대를 기다리는 중..");
    }
  });

  //서버가 오프라인일때 발생하는 코드
  socket.addEventListener("close", () => {
    console.log("---서버와 연결 끊김---");
  });

  //Modal 선택 관련
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancle = () => {
    setMode("-1");
    setLanguage("-1");
    history.push("/");
    setIsModalOpen(false);
  };

  //페이지 이동 관련
  const history = useHistory();

  function hanleHistoryMatchCancle() {
    showModal();
  }

  //mode 선택 관련
  const [mode, setMode] = useRecoilState(selectedMode);
  const [language, setLanguage] = useRecoilState(selectedLanguage);

  console.log("매칭페이지");
  console.log(mode);
  console.log(language);

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
        {state}
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
      <div className="matchingButton" onClick={hanleHistoryMatchCancle}>
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
