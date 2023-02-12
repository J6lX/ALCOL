import React from "react";
import { Row, Col, Badge } from "antd";
import versus from "../../assets/versus.png";
// import $ from "jquery";
import "./SelectedProblemPage.css";
import { useRecoilValue } from "recoil";
import { selectedMode, selectedLanguage } from "../../states/atoms";

function Top() {
  return (
    <div className="middle_selected" style={{ paddingTop: "10%" }}>
      <div className="ban_title">문제 유형이 선택되었습니다.</div>
      <div className="ban_info">곧 입장합니다! 배틀을 준비하세요!</div>
    </div>
  );
}

function SelectedProblem({ problemInfo, problem_category, userInfo }) {
  console.log("userInfo 왜 이러냐", userInfo)
  const mode = useRecoilValue(selectedMode);
  const language = useRecoilValue(selectedLanguage);
  // let clsName = "../../assets/ALCOL tiers/tier_" + problem.problem_tier + "_0.png";
  const category = problem_category;
  console.log("티어 정보가 어떻게 되어있니", problemInfo)
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
  let LV = problemInfo.prob_tier[problemInfo.prob_tier.length-1];
  console.log(tier, LV)

  const tierAddress = `../../assets/ALCOL tiers/tier_${tier}_${LV}.png`;
  
  const makeBadge = (category) => {
    const result = [];

    for (let i = 0; i < problem_category.length; i++) {
      result.push(
        <Badge
          key={i}
          count={problem_category[i]}
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
              문제 {problemInfo.prob_no}. {problemInfo.prob_name}
            </p>
            <img
              src={tierAddress}
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
              {problemInfo.prob_time_limit}시간({problemInfo.prob_time_limit * 60}분)
            </p>
          </Col>
        </div>
      </div>
    </div>
  );
}

const SelectedProblemPage = ({problems, problemInfo, battleMode, battleLanguage, battleuserinfo}) => {
  const problem_category = problems[problemInfo.prob_no]
  console.log("선택된 문제 정보", problemInfo)
  return (
    <div
      id="problem_category"
      className="fullmiddle_selected backgroundimg"
      style={{ boxShadow: "0px 0px 10px 10px rgba(255, 255, 255 0.6)" }}>
      <Top />
      <br />
      <SelectedProblem problemInfo={problemInfo} problem_category={problem_category} userInfo={battleuserinfo} />
    </div>
  );
};

export default SelectedProblemPage;
