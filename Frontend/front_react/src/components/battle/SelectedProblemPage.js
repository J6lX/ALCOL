import React from "react";
import { Row, Col, Badge } from "antd";
import video from "../../assets/count_down.mp4";
import versus from "../../assets/versus.png";
// import $ from "jquery";
import "./SelectedProblemPage.css";
import { useRecoilValue } from "recoil";
import { selectedMode, selectedLanguage } from "../../states/atoms";

function Top() {
  return (
    <div
      className="middle_selected"
      style={{ paddingTop: "10%", marginTop: "3%", marginBottom: "3%" }}>
      <div className="NanumSquare ban_title">문제 유형이 선택되었습니다.</div>
    </div>
  );
}

function SelectedProblem({ problemInfo, problem_category, userInfo }) {
  const mode = useRecoilValue(selectedMode);
  const language = useRecoilValue(selectedLanguage);
  const category = problem_category;
  let tier;
  if (problemInfo.prob_tier[0] === "B") {
    tier = "bronze";
  } else if (problemInfo.prob_tier[0] === "S") {
    tier = "silver";
  } else if (problemInfo.prob_tier[0] === "G") {
    tier = "gold";
  } else if (problemInfo.prob_tier[0] === "P") {
    tier = "platinum";
  } else if (problemInfo.prob_tier[0] === "D") {
    tier = "diamond";
  } else if (problemInfo.prob_tier[0] === "A") {
    tier = "alcol";
  }
  let LV = problemInfo.prob_tier[problemInfo.prob_tier.length - 1];

  const tierAddress = require("../../assets/ALCOL_tiers/tier_" + tier + "_" + LV + ".png");

  const makeBadge = (category) => {
    const result = [];

    for (let i = 0; i < problem_category.length; i++) {
      result.push(
        <Badge key={i} count={problem_category[i]} color="#faad14" style={{ margin: "10px" }} />
      );
    }
    return result;
  };
  return (
    <div className="middle_selected">
      <Row
        className="middle_selected"
        style={{ flexDirection: "row", width: "600px", height: "50px" }}>
        <Col
          span={9}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
            height: "50px",
          }}>
          <p className="NanumSquare" style={{ color: "white", fontSize: "3vh" }}>
            {userInfo.user.nick}
          </p>
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
          <img src={versus} alt="versus" style={{ width: "60px" }} />
        </Col>
        <Col
          span={9}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
            height: "50px",
          }}>
          <p className="NanumSquare" style={{ color: "white", fontSize: "3vh" }}>
            {userInfo.other.nick}
          </p>
        </Col>
      </Row>
      <br />
      <div
        className="middle_select"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "600px",
          height: "320px",
          border: "3px solid white",
          boxShadow: "0px 0px 10px 10px rgba(255, 255, 255 0.6)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}>
        <h1
          className="NanumSquare"
          style={{ color: "white", fontSize: "24px", fontWeight: "bold", marginTop: "30px" }}>
          배틀을 시작합니다!!
        </h1>
        <small className="NanumSquare" style={{ color: "white", marginBottom: "3%" }}>
          아래의 배틀 정보를 확인하세요.
        </small>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "400px",
            marginBottom: "10px",
          }}>
          <p className="NanumSquare" style={{ color: "white", marginBottom: "3%" }}>
            배틀 모드: {mode}
          </p>
          <p className="NanumSquare" style={{ color: "white", marginBottom: "3%" }}>
            배틀 언어: {language}
          </p>
        </div>
        <div className="middle_select">
          <div
            className="middle_select"
            style={{ display: "flex", justifyContent: "center", marginBottom: "1%" }}>
            <p
              className="NanumSquare"
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontSize: "16px",
                marginBottom: "1%",
                marginLeft: "3%",
              }}>
              문제 {problemInfo.prob_no}. {problemInfo.prob_name}
            </p>
            <img src={tierAddress} alt="tier" style={{ width: "40px" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>{makeBadge(category)}</div>
          <Col style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p className="NanumSquare" style={{ color: "white", fontSize: "14px" }}>
              제한시간
            </p>
            <p className="NanumSquare" style={{ color: "white", fontSize: "14px" }}>
              1 시간(60 분)
            </p>
          </Col>
        </div>
      </div>
    </div>
  );
}

const SelectedProblemPage = ({
  problems,
  problemInfo,
  battleMode,
  battleLanguage,
  battleuserinfo,
}) => {
  const problem_category = problems[0][problemInfo.prob_no];
  return (
    <div
      id="problem_category"
      className="fullmiddle_selected"
      style={{ backgroundColor: "black", height: "100vh" }}>
      <video
        src={video}
        autoPlay
        muted
        className="bgvideo backgroundimg"
        style={{ zIndex: "1" }}></video>
      <div className="middlemiddle">
        <Top />
        <br />
        <SelectedProblem
          problemInfo={problemInfo}
          problem_category={problem_category}
          userInfo={battleuserinfo}
        />
      </div>
    </div>
  );
};

export default SelectedProblemPage;
