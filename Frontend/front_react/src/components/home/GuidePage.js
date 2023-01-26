import React from "react";
import { Button, Space, Row, Col } from "antd";
import speedIcon from "../../assets/speed_mode_icon.png";
import performanceIcon from "../../assets/performance_mode_icon.png";
import banIcon from "../../assets/X.png";
// import "./HomePage.css";
import "./GuidePage.css";

const Guide1 = () => {
  return (
    <div className="middle" style={{ height: "1200px", backgroundColor: "#14161A", padding: "7%" }}>
      <Row style={{ width: "85vw" }}>
        <Col span={12} className="right">
          <h1
            className="NanumSquare"
            style={{ marginTop: "4ch", fontSize: "2.1vw", color: "white" }}>
            스피드 모드에서는 최대한 빠르게
          </h1>
          <br />
          <h1 className="NanumSquare" style={{ fontSize: "2.1vw", color: "white" }}>
            최적화 모드에서는 최대한 효율적으로
          </h1>
          <br />
          <h1 className="NanumSquare" style={{ fontSize: "2.1vw", color: "white" }}>
            다양한 유형으로 게임을 즐겨요
          </h1>
          <br />
          <p className="NanumSquare" style={{ fontSize: "1.2vw", color: "white" }}>
            곧 다양한 언어가 추가될 거예요
          </p>
        </Col>
        <Col span={1}></Col>
        <Col span={8} style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div className="mode">
            <img src={speedIcon} alt="speedIcon" />
            <h1 className="NanumSquare" style={{ fontSize: "1.5vw", fontWeight: "bold" }}>
              스피드
            </h1>
          </div>
          <div className="mode">
            <img src={performanceIcon} alt="performanceIcon" />
            <h1 className="NanumSquare" style={{ fontSize: "1.5vw", fontWeight: "bold" }}>
              최적화
            </h1>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const Guide2 = () => {
  return (
    <div className="middle" style={{ height: "1200px", backgroundColor: "#14161A", padding: "7%" }}>
      <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
        <h1 className="NanumSquare" style={{ fontSize: "2.1vw", color: "white", marginBottom: "10px" }}>
          당신과 대결 상대는
        </h1> 
        <h1 className="NanumSquare" style={{ fontSize: "2.1vw", color: "white" }}>
          문제를 하나씩 금지할 수 있어요
        </h1> 
        <Col style={{ display: "flex", justifyContent: "space-around" }}>
          <Col span={6} className="problemBox"><img src={banIcon} alt="performanceIcon" /></Col>
          <Col span={6} className="problemBox"><img src={banIcon} alt="performanceIcon" /></Col>
          <Col span={6} className="problemBox"></Col>
        </Col>
        <h1 className="NanumSquare" style={{ fontSize: "1vw", color: "white", marginBottom: "10px" }}>
          금지되지 않은 문제 중 하나가 출제돼요
        </h1>
      </div>
    </div>
  );
};


const Guide3 = () => {
  return (
    <div className="middle" style={{ height: "1200px", backgroundColor: "#14161A", padding: "7%" }}>
      <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
        <div className="consoleBox">
          <div className="ver"></div>
          <div className="hor"></div>

        </div>
        <h1 className="NanumSquare" style={{ fontSize: "2.1vw", color: "white", marginBottom: "10px" }}>
          상대방과 실시간으로 알고리즘 실력을 겨루세요!
        </h1>
        <h1 className="NanumSquare right" style={{ fontSize: "1vw", color: "white", marginBottom: "10px", paddingRight: "16vw" }}>
          같이하면 재미가 두 배
        </h1>
      </div>
    </div>
  );
};

const Guide4 = () => {
  return (
    <div className="middle" style={{ height: "1200px", backgroundColor: "#14161A", padding: "7%" }}>
      <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
        <div className="consoleBox">
          <div className="ver"></div>
          <div className="hor"></div>
        </div>
        <h1 className="NanumSquare" style={{ fontSize: "2.1vw", color: "white", marginBottom: "10px" }}>
          상대방과 실시간으로 알고리즘 실력을 겨루세요!
        </h1>
        <h1 className="NanumSquare right" style={{ fontSize: "1vw", color: "white", marginBottom: "10px", paddingRight: "16vw" }}>
          같이하면 재미가 두 배
        </h1>
      </div>
    </div>
  );
};


const GuidePage = () => {
  return (
    <div className="fullmiddle">
      <Guide1 />
      <div style={{ width: "100vw", height: "400px", backgroundColor: "#14161A" }}></div>
      <Guide2 />
      <div style={{ width: "100vw", height: "400px", backgroundColor: "#14161A" }}></div>
      <Guide3 />
      <div style={{ width: "100vw", height: "400px", backgroundColor: "#14161A" }}></div>
      <Guide4 />
    </div>
  );
};

export default GuidePage;
