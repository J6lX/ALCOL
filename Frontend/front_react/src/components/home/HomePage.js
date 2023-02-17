import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import axios from "axios";
import video from "../../assets/homepage-main.mp4";
import rankingStar from "../../assets/ranking_image.png";
import mainSlogan from "../../assets/main_slogan.png";
import GuidePage from "./GuidePage";
import Entrance from "./Entrance";
import { Button, Row, Col } from "antd";
import "./HomePage.css";
import "animate.css";
import {
  selectedMode,
  selectedLanguage,
  matchingPlayerInfo,
  resultListResultInfo,
  sendConnect,
  sendGetProblem,
  sendBattleStart,
  isSubmitSpin,
} from "../../states/atoms";
import { useSetRecoilState } from "recoil";

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
        <img src={mainSlogan} alt="slogan" style={{ width: "30vw", marginBottom: "5%" }} />
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
              className="NanumSquare animate__animated animate__flash"
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
  const [speed, setSpeedRanking] = useState([
    { storedFileName: "" },
    { storedFileName: "" },
    { storedFileName: "" },
  ]);

  useEffect(() => {
    axios
      .get("http://i8b303.p.ssafy.io:8000/rank-service/getTop3")
      .then(function (response) {
        setSpeedRanking(response.data.bodyData.speed);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="todaysRanking speedRanking" style={{ border: "5px solid #FAC557" }}>
      <h1
        className="PyeongChangPeace textOrangeGradient"
        style={{ fontSize: "2.5vw", paddingTop: "2ch" }}>
        스피드
      </h1>
      <br />
      <br />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {speed[0] && speed[0].storedFileName ? (
          <img src={speed[0].storedFileName} alt="rank" className="Circle firstUser"></img>
        ) : (
          <img
            src="https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png"
            alt="rank"
            className="Circle firstUser"></img>
        )}
        <div
          style={{
            marginTop: "90px",
            fontFamily: "NanumSquareNeo",
            fontWeight: "bold",
            fontSize: "20px",
          }}>
          {speed[0].nickname}
        </div>

        <div className="secondthirdLayout">
          <div>
            {speed[1] && speed[1].storedFileName ? (
              <img src={speed[1].storedFileName} alt="rank" className="Circle secondUser"></img>
            ) : (
              <img
                src="https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png"
                alt="rank"
                className="Circle secondUser"></img>
            )}
            <div
              style={{
                color: "#fac557",
                fontFamily: "NanumSquareNeo",
                fontWeight: "bold",
                fontSize: "20px",
              }}>
              {speed[1].nickname}
            </div>
          </div>
          <div>
            {speed[2] && speed[2].storedFileName ? (
              <img src={speed[2].storedFileName} alt="rank" className="Circle thirdUser"></img>
            ) : (
              <img
                src="https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png"
                alt="rank"
                className="Circle thirdUser"></img>
            )}
            <div
              style={{
                color: "#fac557",
                fontFamily: "NanumSquareNeo",
                fontWeight: "bold",
                fontSize: "20px",
              }}>
              {speed[2].nickname}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EfficiencyRanking = () => {
  const [efficiency, setEfficiencyRanking] = useState([
    { storedFileName: "" },
    { storedFileName: "" },
    { storedFileName: "" },
  ]);

  useEffect(() => {
    axios
      .get("http://i8b303.p.ssafy.io:8000/rank-service/getTop3")
      .then(function (response) {
        setEfficiencyRanking(response.data.bodyData.optimization);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="todaysRanking efficiencyRanking" style={{ border: "5px solid #5CFDFD" }}>
      <h1
        className="PyeongChangPeace textSkyblueGradient"
        style={{ fontSize: "2.5vw", paddingTop: "2ch" }}>
        최적화
      </h1>
      <br />
      <br />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {efficiency[0] && efficiency[0].storedFileName ? (
          <img src={efficiency[0].storedFileName} alt="rank" className="Circle firstUser"></img>
        ) : (
          <img
            src="https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png"
            alt="rank"
            className="Circle firstUser"></img>
        )}
        <div
          style={{
            marginTop: "90px",
            fontFamily: "NanumSquareNeo",
            fontWeight: "bold",
            fontSize: "20px",
          }}>
          {efficiency[0].nickname}
        </div>
        <div className="secondthirdLayout">
          <div>
            {efficiency[1] && efficiency[1].storedFileName ? (
              <img
                src={efficiency[1].storedFileName}
                alt="rank"
                className="Circle secondUser"></img>
            ) : (
              <img
                src="https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png"
                alt="rank"
                className="Circle secondUser"></img>
            )}
            <div
              style={{
                color: "#5cfdfd",
                fontFamily: "NanumSquareNeo",
                fontWeight: "bold",
                fontSize: "20px",
              }}>
              {efficiency[1].nickname}
            </div>
          </div>
          <div>
            {efficiency[2] && efficiency[2].storedFileName ? (
              <img src={efficiency[2].storedFileName} alt="rank" className="Circle thirdUser"></img>
            ) : (
              <img
                src="https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png"
                alt="rank"
                className="Circle thirdUser"></img>
            )}
            <div
              style={{
                color: "#5cfdfd",
                fontFamily: "NanumSquareNeo",
                fontWeight: "bold",
                fontSize: "20px",
              }}>
              {efficiency[2].nickname}
            </div>
          </div>
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
          <Link to="/ranking?mode=speed&page=1">
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
  const setSelectedMode = useSetRecoilState(selectedMode);
  const setSelectedLanguage = useSetRecoilState(selectedLanguage);
  const setMatchingPlayerInfo = useSetRecoilState(matchingPlayerInfo);
  const setResultListResultInfo = useSetRecoilState(resultListResultInfo);
  const setSendConnect = useSetRecoilState(sendConnect);
  const setSendGetProblem = useSetRecoilState(sendGetProblem);
  const setSendBattleStart = useSetRecoilState(sendBattleStart);
  const setIsSubmitSpin = useSetRecoilState(isSubmitSpin);

  useEffect(() => {
    setSelectedMode("-1");
    setSelectedLanguage("-1");
    setMatchingPlayerInfo({
      userId: "",
      otherId: "",
      hostCheck: "",
    });
    setResultListResultInfo([]);
    setSendConnect("-1");
    setSendGetProblem("-1");
    setSendBattleStart("-1");
    setIsSubmitSpin(false);
  }, [
    setSelectedMode,
    setSelectedLanguage,
    setMatchingPlayerInfo,
    setResultListResultInfo,
    setSendConnect,
    setSendGetProblem,
    setSendBattleStart,
    setIsSubmitSpin,
  ]);

  return (
    <div style={{ zIndex: "-2" }}>
      <Entrance />
      <MainPage />
      <RankingPage />
      <GuidePage />
    </div>
  );
};

export default HomePage;
