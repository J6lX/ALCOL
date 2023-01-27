import React from "react";
import { Button, Space, Row, Col } from "antd";
import speedIcon from "../../assets/speed_mode_icon.png";
import performanceIcon from "../../assets/performance_mode_icon.png";
import banIcon from "../../assets/X.png";
import rankingsIcon from "../../assets/rankings_black.png";
import rankingIcon from "../../assets/ranking_black.png";
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
      <div className="usernameBox" style={{ left: "0%", top: "0%", justifyContent: "right" }}>
        <h1
          className="NanumSquare"
          style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#14161A", marginRight: "20px" }}>
          당신
        </h1>
      </div>
      <div className="usernameBox" style={{ right: "0%", bottom: "0%", justifyContent: "left" }}>
        <h1
          className="NanumSquare"
          style={{ fontSize: "1.8vw", fontWeight: "bold", color: "#14161A", marginLeft: "20px" }}>
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
        <h1
          className="NanumSquare"
          style={{ fontSize: "2.1vw", color: "white", marginBottom: "10px" }}>
          상대방과 실시간으로 알고리즘 실력을 겨루세요!
        </h1>
        <h1
          className="NanumSquare right"
          style={{ fontSize: "1vw", color: "white", marginBottom: "10px", paddingRight: "16vw" }}>
          같이하면 재미가 두 배
        </h1>
      </div>
    </div>
  );
};

const Guide4 = () => {
  return (
    <div className="middle" style={{ height: "1200px", backgroundColor: "#14161A", padding: "7%" }}>
      <div className="grayBackground">
        <Col span={1}></Col>
        <Col
          span={5}
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
          }}>
          <div className="rankIconBox">
            <img style={{ width: "70%", height: "70%" }} src={rankingsIcon} alt="rankings" />
          </div>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1.7vw", color: "white", marginBottom: "10px" }}>
              게임 플레이를 통해
            </h1>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1.7vw", color: "white", marginBottom: "10px" }}>
              랭커에 도전하세요!
            </h1>
            <br />
            <h1
              className="NanumSquare"
              style={{ fontSize: "1vw", color: "white", marginBottom: "10px" }}>
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
          <div className="rankIconBox">
            <img style={{ width: "70%", height: "70%" }} src={rankingIcon} alt="ranking" />
          </div>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1.7vw", color: "white", marginBottom: "10px" }}>
              상대방과의 결투로
            </h1>
            <h1
              className="NanumSquare"
              style={{ fontSize: "1.7vw", color: "white", marginBottom: "10px" }}>
              높은 티어에 도전하세요!
            </h1>
            <br />
            <h1
              className="NanumSquare"
              style={{ fontSize: "1vw", color: "white", marginBottom: "10px" }}>
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
    </div>
  );
};

const Guide5 = () => {
  return (
    <div className="middle" style={{ height: "1200px", backgroundColor: "#14161A", padding: "7%" }}>
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
                  color: "#14161A",
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
                  color: "#14161A",
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
                  color: "#14161A",
                  marginTop: "10px",
                }}>
                따라잡히기까지 15점
              </h1>
            </Col>
          </div>
        </Col>
        <Col span={1}></Col>
        <Col
          span={12}
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
    </div>
  );
};

const Guide6 = () => {
  return (
    <div className="middle" style={{ height: "1200px", backgroundColor: "#14161A", padding: "7%" }}>
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
              style={{ fontSize: "2.1ch", color: "white", marginBottom: "10px" }}>
              알고리즘
            </h1>
            <h1
              className="NanumSquare"
              style={{ fontSize: "2.1ch", color: "white", marginBottom: "10px" }}>
              입문자도
            </h1>
          </Col>
          <div
            style={{ height: "8ch", width: "2px", backgroundColor: "white", margin: "15px" }}></div>
          <Col span={5} style={{ display: "flex", flexDirection: "column" }}>
            <h1
              className="NanumSquare"
              style={{ fontSize: "2.1ch", color: "white", marginBottom: "10px" }}>
              가볍게
            </h1>
            <h1
              className="NanumSquare"
              style={{ fontSize: "2.1ch", color: "white", marginBottom: "10px" }}>
              재미있게
            </h1>
          </Col>
          <div
            style={{ height: "8ch", width: "2px", backgroundColor: "white", margin: "15px" }}></div>
          <Col span={5} style={{ display: "flex", flexDirection: "column" }}>
            <h1
              className="NanumSquare"
              style={{ fontSize: "2.1ch", color: "white", marginBottom: "10px" }}>
              경쟁하며
            </h1>
            <h1
              className="NanumSquare"
              style={{ fontSize: "2.1ch", color: "white", marginBottom: "10px" }}>
              즐겨요
            </h1>
          </Col>
        </Row>
        <br />
        <div className="goBattleBtn">
          <p
            className="NanumSquare"
            style={{
              fontSize: "3.5ch",
              fontWeight: "bold",
              color: "#14161A",
              marginBottom: "10px",
              margin: "auto",
            }}>
            배틀 하러 가기
          </p>
        </div>
      </div>
    </div>
  );
};

const GuidePage = () => {
  return (
    <div className="fullmiddle">
      <Guide1 />
      <div>
        <div style={{ width: "100vw", height: "20ch", backgroundColor: "#14161A" }}></div>
      </div>
      <Guide2 />
      <div>
        <div style={{ width: "100vw", height: "20ch", backgroundColor: "#14161A" }}></div>
      </div>
      <Guide3 />
      <div>
        <div style={{ width: "100vw", height: "20ch", backgroundColor: "#14161A" }}></div>
      </div>
      <Guide4 />
      <div>
        <div style={{ width: "100vw", height: "20ch", backgroundColor: "#14161A" }}></div>
      </div>
      <Guide5 />
      <div>
        <div style={{ width: "100vw", height: "20ch", backgroundColor: "#14161A" }}></div>
      </div>
      <Guide6 />
      <div>
        <div style={{ width: "100vw", height: "20ch", backgroundColor: "#14161A" }}></div>
      </div>
    </div>
  );
};

export default GuidePage;
