import React from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import video from "../../assets/homepage-main.mp4";
import rankingStar from "../../assets/ranking_image.png";
import mainSlogan from "../../assets/main_slogan.png";
import GuidePage from "./GuidePage";
import { Button, Row, Col } from "antd";
import "./HomePage.css";
import "animate.css";

const MainPage = () => {
  const changeColor = (event) => {
    event.target.style.color = "#FEF15D";
  };

  const returnColor = (event) => {
    event.target.style.color = "white";
  };

  return (
    <div id="MainPage" className="fullmiddle">
      <video src={video} loop autoPlay muted className="bgvideo" style={{ zIndex: "1" }}></video>
      <div className="gradientBox" style={{ zIndex: "2" }}></div>
      <div className="mainh1" style={{ zIndex: "2" }}>
        <img className="animate__animated animate__bounce" src={mainSlogan} alt="slogan" style={{ width: "30vw", marginBottom: "5%" }} />
      </div>
      <div
        className="battleStart"
        style={{ height: "10%", border: "5px solid #FDE14B", borderRadius: "1vw", zIndex: "2" }}>
        <Link to="/mode">
          <Button
            style={{
              width: "100%",
              height: "100%",
              border: "5px solid #440000",
              borderRadius: "0.7vw",
            }}>
            <p
              className="NanumSquare"
              style={{ fontSize: "1.8vw", color: "#E51C29", fontWeight: "bold", margin: "auto" }}>
              Battle Start!
            </p>
          </Button>
        </Link>
        <ScrollLink to="Guide1" spy={true} smooth={true}>
          <Button type="text" block style={{ marginTop: "5px" }}>
            <p
              className="NanumSquare"
              onMouseEnter={changeColor}
              onMouseLeave={returnColor}
              style={{ fontSize: "1vw", color: "white" }}>
              배틀 방법이 궁금하신가요?
            </p>
          </Button>
        </ScrollLink>
      </div>
    </div>
  );
};

const SpeedRanking = () => {
  return (
    <div className="todaysRanking speedRanking animate__animated animate__fadeInLeft" style={{ border: "5px solid #FAC557" }}>
      <h1
        className="PyeongChangPeace textOrangeGradient"
        style={{ fontSize: "2.5vw", paddingTop: "2ch" }}>
        스피드
      </h1>
      <br />
      <br />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="Circle firstUser"></div>
        <div className="secondthirdLayout">
          <div className="Circle secondUser"></div>
          <div className="Circle thirdUser"></div>
        </div>
      </div>
    </div>
  );
};

const EfficiencyRanking = () => {
  return (
    <div className="todaysRanking efficiencyRanking animate__animated animate__fadeInRight" style={{ border: "5px solid #5CFDFD" }}>
      <h1
        className="PyeongChangPeace textSkyblueGradient"
        style={{ fontSize: "2.5vw", paddingTop: "2ch" }}>
        최적화
      </h1>
      <br />
      <br />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="Circle firstUser"></div>
        <div className="secondthirdLayout">
          <div className="Circle secondUser"></div>
          <div className="Circle thirdUser"></div>
        </div>
      </div>
    </div>
  );
};

const RankingPage = () => {
  return (
    <div className="fullmiddle" style={{ height: "100%", backgroundColor: "#16171B" }}>
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
          <p className="NanumSquare" style={{ fontSize: "1.5vw", color: "white" }}>
            Today's
          </p>
          <Link to="/ranking">
            <p
              className="NanumSquare"
              style={{ fontSize: "3vw", fontWeight: "bold", color: "white" }}>
              Ranking
            </p>
          </Link>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          textAlign: "center",
          width: "85vw",
        }}>
        <Row>
          <Col lg={11} md={24} xs={24} style={{ display: "flex", justifyContent: "center" }}>
            <SpeedRanking />
          </Col>
          <Col lg={2} md={0} xs={0}></Col>
          <Col lg={11} md={24} xs={24} style={{ display: "flex", justifyContent: "center" }}>
            <EfficiencyRanking />
          </Col>
        </Row>
      </div>
      <div style={{ width: "100vw", height: "200px", backgroundColor: "#14161A" }}></div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div style={{ zIndex: "-2" }}>
      <MainPage />
      <RankingPage />
      <GuidePage />
    </div>
  );
};

export default HomePage;
