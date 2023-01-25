import React from "react";
import video from "../../assets/homepage-main.mp4";
import rankingStar from "../../assets/ranking_image.png";
import { Button, Space, Col } from "antd";
import "./HomePage.css";

const MainPage = () => {
  return (
    <div className="fullmiddle">
      <video loop autoPlay muted className="bgvideo">
        <source src={video} type="video/mp4" />
      </video>
      <div className="mainh1">
        <h1 style={{ fontSize: "56px" }}>AlCol에서</h1>
        <h1 style={{ fontSize: "56px" }}>알고리즘 마스터로!</h1>
      </div>
      <div
        className="battleStart"
        style={{ height: "10%", border: "5px solid #FDE14B", borderRadius: "20px" }}>
        <Button
          style={{
            width: "100%",
            height: "100%",
            border: "5px solid #440000",
            borderRadius: "16px",
          }}>
          <b>
            <p
              className="NanumSquare"
              style={{ fontSize: "32px", color: "#E51C29", fontWeight: "bold" }}>
              Battle Start!
            </p>
          </b>
        </Button>
        <Button type="text" block style={{ marginTop: "5px" }}>
          <p className="NanumSquare" style={{ fontSize: "16px", color: "white" }}>
            배틀 방법이 궁금하신가요?
          </p>
        </Button>
      </div>
      <div className="gradientBox"></div>
    </div>
  );
};

const SpeedRanking = () => {
  return (
    <div>
      <h1 style={{ color: "white" }}>스피드 랭킹 자리</h1>
    </div>
  );
};

const EfficiencyRanking = () => {
  return (
    <div>
      <h1 style={{ color: "white" }}>최적화 랭킹 자리</h1>
    </div>
  );
};

const RankingPage = () => {
  return (
    <div className="fullmiddle" style={{ height: "800px", backgroundColor: "#14161A" }}>
      <br />
      <br />
      <br />
      <br />
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={rankingStar} alt="star" style={{ width: "15%" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            marginLeft: "20px",
          }}>
          <h1 className="NanumSquare" style={{ color: "white" }}>
            Today's
          </h1>
          <h1 className="NanumSquare" style={{ fontSize: "48px", color: "white" }}>
            <b>Ranking</b>
          </h1>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          width: "80vw",
          height: "70%",
        }}>
        <Col span={12}>
          <SpeedRanking />
        </Col>
        <Col span={12}>
          <EfficiencyRanking />
        </Col>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div>
      <MainPage />
      <RankingPage />
    </div>
  );
};

export default HomePage;
