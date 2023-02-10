import React from "react";
import { Row, Col, Badge } from "antd";
import versus from "../../assets/versus.png";
// import $ from "jquery";
import "./SelectedProblemPage.css";
import { useRecoilValue } from "recoil";
import { selectedMode, selectedLanguage, battleProblemInfo } from "../../states/atoms";

function Top() {
  return (
    <div className="middle_selected" style={{ paddingTop: "10%" }}>
      <div className="ban_title">문제 유형이 선택되었습니다.</div>
      <div className="ban_info">곧 입장합니다! 배틀을 준비하세요!</div>
    </div>
  );
}

function SelectedProblem({ problemInfo, userInfo }) {
  const mode = useRecoilValue(selectedMode);
  const language = useRecoilValue(selectedLanguage);
  // let clsName = "../../assets/ALCOL tiers/tier_" + problem.problem_tier + "_0.png";
  const category = problemInfo.problem_category;
  const makeBadge = (category) => {
    const result = [];

    for (let i = 0; i < problemInfo.problem_category.length; i++) {
      result.push(
        <Badge
          key={i}
          count={problemInfo.problem_category[i]}
          color="#faad14"
          style={{ margin: "10px" }}
        />
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
            justifyContent: "left",
            backgroundColor: "yellow",
            height: "50px",
          }}>
          <p style={{ color: "black", fontSize: "3vh" }}>{userInfo.user.nick}</p>
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
          <img src={versus} alt="versus" style={{ width: "60px" }} />
        </Col>
        <Col
          span={9}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
            backgroundColor: "yellow",
            height: "50px",
          }}>
          <p style={{ color: "black", fontSize: "3vh" }}>{userInfo.other.nick}</p>
        </Col>
      </Row>
      <br />
      <div
        className="middle_selected"
        style={{
          width: "600px",
          height: "300px",
          border: "3px solid white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}>
        <h1
          className="NanumSquare"
          style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>
          배틀을 시작합니다!!
        </h1>
        <small className="NanumSquare" style={{ color: "white", marginBottom: "3%" }}>
          아래의 배틀 정보를 확인하세요.
        </small>
        <div
          style={{
            display: "flex",
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
        <div className="middle_selected">
          <div className="middle_selected" style={{ flexDirection: "row", marginBottom: "1%" }}>
            <p
              className="NanumSquare"
              style={{ color: "white", fontSize: "16px", marginBottom: "1%", marginLeft: "3%" }}>
              문제 {problemInfo.problem_no}. {problemInfo.problem_title}
            </p>
            <img
              src={require("../../assets/ALCOL tiers/tier_" + problemInfo.problem_tier + "_0.png")}
              alt="tier"
              style={{ width: "40px" }}
            />
          </div>
          <div>{makeBadge(category)}</div>
          <Col style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p className="NanumSquare" style={{ color: "white", fontSize: "14px" }}>
              제한시간
            </p>
            <p className="NanumSquare" style={{ color: "white", fontSize: "14px" }}>
              2시간(120분)
            </p>
          </Col>
        </div>
      </div>
    </div>
  );
}

const SelectedProblemPage = (battleuserinfo) => {
  const problem = useRecoilValue(battleProblemInfo);

  return (
    <div
      id="problem_category"
      className="fullmiddle_selected backgroundimg"
      style={{ boxShadow: "0px 0px 10px 10px rgba(255, 255, 255 0.6)" }}>
      <Top />
      <br />
      <SelectedProblem problem={problem} userInfo={battleProblemInfo} />
    </div>
  );
};

export default SelectedProblemPage;
