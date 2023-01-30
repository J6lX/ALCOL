import React from "react";
import "./SolvingPage.css";
// import { Row, Col } from "antd";

const BattleNav = () => {
  return (
    <div className="BattleNav">
      <p style={{ color: "black" }}>로고</p>
      <p style={{ color: "black" }}>배틀 유형</p>
      <p style={{ color: "black" }}>사용자 닉네임</p>
      <p style={{ color: "black" }}>상대방 닉네임</p>
      <p style={{ color: "black" }}>남은 시간</p>
    </div>
  );
};

const Problem = () => {
  return (
    <div style={{ border: "2px solid red" }}>
      <div style={{ width: "29vw", height: "7ch", border: "2px solid red" }}>
        <p style={{ color: "white" }}>문제 제목</p>
      </div>
      <div
        style={{
          width: "29vw",
          height: "84ch",
          border: "2px solid red",
          overflowY: "scroll",
        }}>
        <p style={{ color: "white" }}>문제 내용</p>
      </div>
    </div>
  );
};

const CodingPlace = () => {
  return (
    <div>
      <div style={{ width: "70vw", height: "7ch", border: "2px solid red" }}>
        <p style={{ color: "white" }}>코딩할 언어: python</p>
      </div>
    </div>
  );
};

const ButtonsLayer = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <p style={{ color: "white" }}>결과창</p>
      <div>
        <button>제출</button>
        <button>항복</button>
      </div>
    </div>
  );
};

const Console = () => {
  return (
    <div>
      <div></div>
    </div>
  );
};

const SolvingPage = () => {
  return (
    <div>
      <div>
        <BattleNav />
        <div style={{ display: "flex" }}>
          <div style={{ width: "29vw", height: "92vh", border: "2px solid red" }}>
            <Problem />
          </div>
          <div>
            <div style={{ width: "70vw", height: "53vh", border: "2px solid red" }}>
              <CodingPlace />
            </div>
            <div style={{ width: "70vw", height: "6vh", border: "2px solid red" }}>
              <ButtonsLayer />
            </div>
            <div style={{ width: "70vw", height: "33vh", border: "2px solid red" }}>
              <Console />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvingPage;
