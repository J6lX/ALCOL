import React from "react";
import { Button, Space, Row, Col } from "antd";
import speedIcon from "../../assets/speed_mode_icon.png";
import performanceIcon from "../../assets/performance_mode_icon.png";
import banIcon from "../../assets/X.png";
// import "./HomePage.css";
import "./GuidePage.css";

const Guide1 = () => {
  return (
    <div className="middle" style={{ height: "1200px", backgroundColor: "#14161A" }}>
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
    <div className="middle" style={{ height: "1200px", backgroundColor: "#14161A" }}>
      <Row style={{ width: "85vw" }}>
        <Col span={12} className="right">
          <h1
            className="NanumSquare"
            style={{ marginTop: "4ch", fontSize: "2.3vw", color: "white" }}>
            스피드 모드에서는 최대한 빠르게
          </h1>
          <br />
          <h1 className="NanumSquare" style={{ fontSize: "2.3vw", color: "white" }}>
            최적화 모드에서는 최대한 효율적으로
          </h1>
          <br />
          <h1 className="NanumSquare" style={{ fontSize: "2.3vw", color: "white" }}>
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

const GuidePage = () => {
  return (
    <div className="fullmiddle">
      <Guide1 />
      <Guide2 />
    </div>
  );
};

export default GuidePage;
