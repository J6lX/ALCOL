import React from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Row, Col } from "antd";
import speedIcon from "../../assets/speed_mode_icon.png";
import performanceIcon from "../../assets/performance_mode_icon.png";
import banIcon from "../../assets/X.png";
import rankingsIcon from "../../assets/rankings_black.png";
import rankingIcon from "../../assets/ranking_black.png";
import "./GuidePage.css";

const changeColor = (event) => {
  event.target.style.color = "#FEF15D";
};

const returnColor = (event) => {
  event.target.style.color = "white";
};

const Guide1 = () => {
  return (
    <div id="Guide1" className="middle" style={{ backgroundColor: "#16171B", padding: "7%" }}>
      <Row style={{ width: "85vw" }}>
        <Col span={12}>
          <div className="right">
            <h1
              className="NanumSquare"
              style={{
                marginTop: "4ch",
                marginRight: "0.5ch",
                fontSize: "2.1vw",
                color: "#FAC557",
              }}>
              스피드
            </h1>
            <h1
              className="NanumSquare"
              style={{ marginTop: "4ch", fontSize: "2.1vw", color: "white" }}>
              모드에서는 최대한 빠르게
            </h1>
          </div>
          <br />
          <div className="right">
            <h1
              className="NanumSquare"
              style={{ marginRight: "0.5ch", fontSize: "2.1vw", color: "#FAC557" }}>
              최적화
            </h1>
            <h1 className="NanumSquare" style={{ fontSize: "2.1vw", color: "white" }}>
              모드에서는 최대한 효율적으로
            </h1>
          </div>
          <br />
          <div className="right">
            <h1 className="NanumSquare" style={{ fontSize: "2.1vw", color: "white" }}>
              다양한 유형으로 게임을 즐겨요
            </h1>
          </div>
          <br />
          <div className="right">
            <p className="NanumSquare" style={{ fontSize: "1.2vw", color: "white" }}>
              곧 다양한 언어가 추가될 거예요
            </p>
          </div>
        </Col>
        <Col span={1}></Col>
        <Col span={8} style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div className="mode">
            <img src={speedIcon} alt="speedIcon" />
            <h1
              className="NanumSquare"
              style={{ fontSize: "1.5vw", color: "black", fontWeight: "bold" }}>
              스피드
            </h1>
          </div>
          <div className="mode">
            <img src={performanceIcon} alt="performanceIcon" />
            <h1
              className="NanumSquare"
              style={{ fontSize: "1.5vw", color: "black", fontWeight: "bold" }}>
              최적화
            </h1>
          </div>
        </Col>
      </Row>
      <ScrollLink
        className="NanumSquare"
        to="Guide2"
        spy={true}
        smooth={true}
        onMouseEnter={changeColor}
        onMouseLeave={returnColor}
        style={{ color: "white", marginTop: "13vw" }}>
        다음
      </ScrollLink>
    </div>
  );
};

const Guide2 = () => {
  return (
    <div id="Guide2" className="middle" style={{ backgroundColor: "#16171B", padding: "7%" }}>
      <div className="usernameBox" style={{ left: "0%", top: "0%", justifyContent: "right" }}>
        <h1
          className="NanumSquare"
          style={{
            fontSize: "1.8vw",
            fontWeight: "bold",
            color: "#16171B",
            marginRight: "20px",
            marginTop: "6%",
          }}>
          당신
        </h1>
      </div>
      <div className="usernameBox" style={{ right: "0%", bottom: "0%", justifyContent: "left" }}>
        <h1
          className="NanumSquare"
          style={{
            fontSize: "1.8vw",
            fontWeight: "bold",
            color: "#16171B",
            marginLeft: "20px",
            marginTop: "6%",
          }}>
          상대방
        </h1>
      </div>
      <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
        <h1
          className="NanumSquare"
          style={{ fontSize: "2.1vw", color: "white", marginBottom: "10px" }}>
          당신과 대결 상대는
        </h1>
        <h1 className="NanumSquare" style={{ fontSize: "2.1vw", color: "white" }}>
          문제를 하나씩 금지할 수 있어요
        </h1>
        <Col style={{ display: "flex", justifyContent: "space-around" }}>
          <Col span={6} className="problemBox">
            <img src={banIcon} alt="performanceIcon" />
          </Col>
          <Col span={6} className="problemBox">
            <img src={banIcon} alt="performanceIcon" />
          </Col>
          <Col span={6} className="problemBox"></Col>
        </Col>
        <h1
          className="NanumSquare"
          style={{ fontSize: "1vw", color: "white", marginBottom: "10px" }}>
          금지되지 않은 문제 중 하나가 출제돼요
        </h1>
      </div>
      <ScrollLink
        className="NanumSquare"
        to="Guide3"
        spy={true}
        smooth={true}
        onMouseEnter={changeColor}
        onMouseLeave={returnColor}
        style={{ color: "white", marginTop: "5vw" }}>
        다음
      </ScrollLink>
    </div>
  );
};

const Guide3 = () => {
  return (
    <div id="Guide3" className="middle" style={{ backgroundColor: "#16171B", padding: "4%" }}>
      <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
        <div className="consoleBox">
          <div className="ver"></div>
          <div className="hor"></div>
        </div>
        <br />
        <h1
          className="NanumSquare"
          style={{ fontSize: "2.1vw", color: "white", marginBottom: "10px" }}>
          상대방과 실시간으로 알고리즘 실력을 겨루세요!
        </h1>
        <h1
          className="NanumSquare right"
          style={{ fontSize: "1vw", color: "white", marginBottom: "10px", paddingRight: "5vw" }}>
          같이하면 재미가 두 배
        </h1>
      </div>
      <ScrollLink
        className="NanumSquare"
        to="Guide4"
        spy={true}
        smooth={true}
        onMouseEnter={changeColor}
        onMouseLeave={returnColor}
        style={{ color: "white", marginTop: "1vw" }}>
        다음
      </ScrollLink>
    </div>
  );
};

const Guide4 = () => {
  return (
    <div id="Guide4" className="middle" style={{ backgroundColor: "#16171B", padding: "7%" }}>
      <div className="grayBackground">
        <Col span={1}></Col>
        <Col
          span={5}
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
          }}>
          <div className="rankIconBox" style={{ marginBottom: "1vw" }}>
            <img style={{ width: "70%", height: "70%" }} src={rankingsIcon} alt="rankings" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}>
            <h1
              className="NanumSquare"
              style={{
                fontSize: "1.7vw",
                color: "white",
                marginTop: "10px",
                marginBottom: "0.5vw",
              }}>
              게임 플레이를 통해
            </h1>
            <div style={{ display: "flex" }}>
              <h1
                className="NanumSquare"
                style={{ fontSize: "1.7vw", color: "#FAC557", marginBottom: "2vw" }}>
                랭커
              </h1>
              <h1
                className="NanumSquare"
                style={{ fontSize: "1.7vw", color: "white", marginBottom: "2vw" }}>
                에 도전하세요!
              </h1>
            </div>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1vw", color: "white", marginBottom: "1vw" }}>
              성장의 재미를 위해
            </h1>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1vw", color: "white", marginBottom: "10px" }}>
              랭킹은 3개월마다 초기화 돼요.
            </h1>
          </div>
        </Col>
        <Col span={1}></Col>
        <Col
          span={5}
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
          }}>
          <div className="rankIconBox" style={{ marginBottom: "1vw" }}>
            <img style={{ width: "70%", height: "70%" }} src={rankingIcon} alt="ranking" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}>
            <h1
              className="NanumSquare"
              style={{
                fontSize: "1.7vw",
                color: "white",
                marginBottom: "0.5vw",
                marginTop: "10px",
              }}>
              상대방과의 결투로
            </h1>
            <div style={{ display: "flex" }}>
              <h1
                className="NanumSquare"
                style={{ fontSize: "1.7vw", color: "#FAC557", marginBottom: "2vw" }}>
                높은 티어
              </h1>
              <h1
                className="NanumSquare"
                style={{ fontSize: "1.7vw", color: "white", marginBottom: "2vw" }}>
                에 도전하세요!
              </h1>
            </div>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1vw", color: "white", marginBottom: "1vw" }}>
              이번 시즌의 챔피언은
            </h1>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1vw", color: "white", marginBottom: "10px" }}>
              누가 될까요?
            </h1>
          </div>
        </Col>
      </div>
      <ScrollLink
        className="NanumSquare"
        to="Guide5"
        spy={true}
        smooth={true}
        onMouseEnter={changeColor}
        onMouseLeave={returnColor}
        style={{ color: "white", marginTop: "1vw" }}>
        다음
      </ScrollLink>
    </div>
  );
};

const Guide5 = () => {
  return (
    <div id="Guide5" className="middle" style={{ backgroundColor: "#16171B", padding: "7%" }}>
      <Row style={{ width: "85vw" }}>
        <Col span={2}></Col>
        <Col
          span={8}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <div className="friendBox">
            <Col span={1}></Col>
            <Col span={8}>
              <div className="profileCircle"></div>
            </Col>
            <Col span={15}>
              <div className="profileName"></div>
              <h1
                className="NanumSquare"
                style={{
                  fontSize: "1.1vw",
                  fontWeight: "bold",
                  color: "#16171B",
                  marginTop: "10px",
                }}>
                따라잡기까지 30점
              </h1>
            </Col>
          </div>
          <div className="friendBox" style={{ marginLeft: "10vw" }}>
            <Col span={1}></Col>
            <Col span={8}>
              <div className="profileCircle"></div>
            </Col>
            <Col span={15}>
              <div className="profileName"></div>
              <h1
                className="NanumSquare"
                style={{
                  fontSize: "1.1vw",
                  fontWeight: "bold",
                  color: "#16171B",
                  marginTop: "10px",
                }}>
                당신의 친구들 중 2위입니다
              </h1>
            </Col>
          </div>
          <div className="friendBox">
            <Col span={1}></Col>
            <Col span={8}>
              <div className="profileCircle"></div>
            </Col>
            <Col span={15}>
              <div className="profileName"></div>
              <h1
                className="NanumSquare"
                style={{
                  fontSize: "1.1vw",
                  fontWeight: "bold",
                  color: "#16171B",
                  marginTop: "10px",
                }}>
                따라잡히기까지 15점
              </h1>
            </Col>
          </div>
        </Col>
        <Col span={2}></Col>
        <Col
          span={9}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "20px",
          }}>
          <h1
            className="NanumSquare"
            style={{ fontSize: "2.7vw", color: "white", marginBottom: "10px" }}>
            친구들 사이에서
          </h1>
          <h1
            className="NanumSquare"
            style={{ fontSize: "2.7vw", color: "white", marginBottom: "10px" }}>
            자신의 알고리즘 레벨이
          </h1>
          <h1 className="NanumSquare" style={{ fontSize: "2.7vw", color: "white" }}>
            어디쯤인지 확인해보아요
          </h1>
        </Col>
      </Row>
      <ScrollLink
        className="NanumSquare"
        to="Guide6"
        spy={true}
        smooth={true}
        onMouseEnter={changeColor}
        onMouseLeave={returnColor}
        style={{ color: "white", marginTop: "1vw" }}>
        다음
      </ScrollLink>
    </div>
  );
};

const Guide6 = () => {
  return (
    <div id="Guide6" className="middle" style={{ backgroundColor: "#16171B", paddingTop: "17%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
        }}>
        <h1
          className="NanumSquare"
          style={{ fontSize: "2.1vw", color: "white", marginBottom: "10px" }}>
          알고리즘 마스터, 나도 할 수 있을까?
        </h1>
        <h1
          className="NanumSquare"
          style={{ fontSize: "2.1vw", color: "white", marginBottom: "10px" }}>
          알콜(AlCol)에선 됩니다.
        </h1>
        <br />
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "50ch",
          }}>
          <Col span={5} style={{ display: "flex", flexDirection: "column" }}>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1vw", color: "white", marginBottom: "10px" }}>
              알고리즘
            </h1>
            <h1 className="NanumSquare" style={{ fontSize: "1vw", color: "white" }}>
              입문자도
            </h1>
          </Col>
          <div
            style={{ height: "4vw", width: "1px", backgroundColor: "white", margin: "15px" }}></div>
          <Col span={5} style={{ display: "flex", flexDirection: "column" }}>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1vw", color: "white", marginBottom: "10px" }}>
              가볍게
            </h1>
            <h1 className="NanumSquare" style={{ fontSize: "1vw", color: "white" }}>
              재미있게
            </h1>
          </Col>
          <div
            style={{ height: "4vw", width: "1px", backgroundColor: "white", margin: "15px" }}></div>
          <Col span={5} style={{ display: "flex", flexDirection: "column" }}>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1vw", color: "white", marginBottom: "10px" }}>
              경쟁하며
            </h1>
            <h1 className="NanumSquare" style={{ fontSize: "1vw", color: "white" }}>
              즐겨요
            </h1>
          </Col>
        </Row>
        <br />
        <Link to="/mode">
          <div className="goBattleBtn">
            <p
              className="NanumSquare"
              style={{
                fontSize: "1.8vw",
                fontWeight: "bold",
                color: "#16171B",
                marginBottom: "10px",
                margin: "auto",
              }}>
              배틀 하러 가기
            </p>
          </div>
        </Link>
      </div>
      <ScrollLink
        className="NanumSquare"
        to="MainPage"
        spy={true}
        smooth={true}
        onMouseEnter={changeColor}
        onMouseLeave={returnColor}
        style={{ color: "white", marginTop: "1vw" }}>
        맨 위로
      </ScrollLink>
    </div>
  );
};

const GuidePage = () => {
  return (
    <div className="fullmiddle">
      <Guide1 />
      <div>
        <div style={{ width: "100vw", height: "30vw", backgroundColor: "#16171B" }}></div>
      </div>
      <Guide2 />
      <div>
        <div style={{ width: "100vw", height: "30vw", backgroundColor: "#16171B" }}></div>
      </div>
      <Guide3 />
      <div>
        <div style={{ width: "100vw", height: "30vw", backgroundColor: "#16171B" }}></div>
      </div>
      <Guide4 />
      <div>
        <div style={{ width: "100vw", height: "30vw", backgroundColor: "#16171B" }}></div>
      </div>
      <Guide5 />
      <div>
        <div style={{ width: "100vw", height: "30vw", backgroundColor: "#16171B" }}></div>
      </div>
      <Guide6 />
      <div>
        <div style={{ width: "100vw", height: "20vw", backgroundColor: "#16171B" }}></div>
      </div>
    </div>
  );
};

export default GuidePage;
