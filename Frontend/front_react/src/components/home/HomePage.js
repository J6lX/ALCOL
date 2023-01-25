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
        <h1 style={{ fontSize: "3.6vw" }}>AlCol에서</h1>
        <h1 style={{ fontSize: "3.6vw" }}>알고리즘 마스터로!</h1>
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
              style={{ fontSize: "2vw", color: "#E51C29", fontWeight: "bold" }}>
              Battle Start!
            </p>
          </b>
        </Button>
        <Button type="text" block style={{ marginTop: "5px" }}>
          <p className="NanumSquare" style={{ fontSize: "0.3vw", color: "white" }}>
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
    <div className="todaysRanking speedRanking" style={{ border: "3px solid red"}}>
      <h1 className="PyeongChangPeace" style={{ fontSize: "2.5vw", marginTop: "10px" }}>스피드</h1>
      <br />
      <br />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div className="Circle firstUser"></div>
        <div style={{ width: "40vw", display: "flex", justifyContent: "space-around" }}>
          <div className="Circle secondUser"></div>
          <div className="Circle thirdUser"></div>
        </div>
      </div>
    </div>
  );
};

const EfficiencyRanking = () => {
  return (
    <div className="todaysRanking efficiencyRanking" style={{ border: "3px solid skyblue"}}>
      <h1 className="PyeongChangPeace" style={{ fontSize: "2.5vw", marginTop: "10px" }}>최적화</h1>
      <br />
      <br />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div className="Circle firstUser"></div>
        <div style={{ width: "40vw", display: "flex", justifyContent: "space-around" }}>
          <div className="Circle secondUser"></div>
          <div className="Circle thirdUser"></div>
        </div>
      </div>
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
          justifyContent: "space-evenly",
          textAlign: "center",
          width: "85vw",
          height: "70%",
        }}>
        <Col span={12} style={{ display: "flex", justifyContent: "center" }}>
          <SpeedRanking />
        </Col>
        <Col span={0}></Col>
        <Col span={12} style={{ display: "flex", justifyContent: "center" }}>
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
