import { React, useState, useEffect } from "react";
// import { RecoilRoot, atom, useRecoilState } from "recoil";

import Logo from "../../assets/alcol_empty_black.png";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
// import { oneDark } from "@codemirror/theme-one-dark";
import { darcula } from "@uiw/codemirror-theme-darcula";
import "./PracticeSolvingPage.css";
import { Button, Modal, Select } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PracticeProblemState } from "../../states/ProblemBank";
import { useRecoilState } from "recoil";

// 배틀 화면 네비게이션 바
const BattleNav = () => {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  return (
    <div className="BattleNav">
      <img src={Logo} alt="alcol_logo_black" style={{ height: "5vh", marginLeft: "20px" }} />
      <div style={{ display: "flex", marginRight: "10vw" }}>
        <p
          className="NanumSquare"
          style={{ color: "black", fontSize: "2.5vh", marginRight: "3vw" }}>
          문제 풀이
        </p>
      </div>
      <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh", marginRight: "20px" }}>
        {hours} : {minutes}
      </p>
    </div>
  );
};

// 문제 표시 영역
const Problem = () => {
  // 파라미터로 문제 번호 가져오기
  const problemId = useParams().problemno;
  // PracticeProblemState에는 현재 조회(풀이)중인 연습문제 저장
  const [problemData, setProblemData] = useRecoilState(PracticeProblemState);

  // 문제 번호로 요청해서 문제 정보를 받기
  useEffect(() => {
    axios
      .get(`http://i8b303.p.ssafy.io:8000/problem-service/getProblemDetail/${problemId}`)
      .then((response) => {
        console.log(response.data);
        // 응답받은 데이터 정제
        const originProblemData = {
          // 문제 번호
          problemNo: response.data.prob_no,
          // 문제 이름
          problemName: response.data.prob_name,
          // 문제 설명(body)
          problemContent: response.data.prob_content,
          // 입력 데이터에 대한 설명
          problemInputContent: response.data.prob_input_content,
          // 입력 테스트 케이스
          problemInputTC: response.data.prob_input_testcase,
          // 문제 난이도(티어)
          problemTier: response.data.prob_tier,
          // 출력 데이터에 대한 설명
          problemOutputContent: response.data.prob_output_content,
          // 출력 테스트 케이스
          problemOutputTC: response.data.problem_output_testcase,
          // 메모리 제한
          problemMemoryLimit: response.data.problem_memory_liimt,
        };
        // 정제한 데이터를 recoil에 저장
        setProblemData(originProblemData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [problemId, setProblemData]);

  // 문제 표시 영역 렌더링
  return (
    <div style={{ border: "0.1px solid gray" }}>
      <div style={{ width: "29.6vw", height: "7vh", border: "0.1px solid gray" }}>
        <p
          className="NanumSquare"
          style={{ color: "white", fontSize: "2.5vh", fontWeight: "bold", padding: "2%" }}>
          {problemData.problemName}
        </p>
      </div>
      <div
        className="scrollDesign"
        style={{
          width: "29.6vw",
          height: "84.7vh",
          overflowY: "scroll",
          backgroundColor: "#1D1E22",
        }}>
        <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
          문제 내용
        </p>
        <hr style={{ height: "1px", background: "gray" }} />
        <p
          className="NanumSquare"
          style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
          {problemData.problemContent}
        </p>
        <br />
        <hr style={{ height: "1px", background: "gray" }} />
        <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
          입력
        </p>
        <hr style={{ height: "1px", background: "gray" }} />
        <p
          className="NanumSquare"
          style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
          {problemData.problemInputContent}
        </p>
        <br />
        <hr style={{ height: "1px", background: "gray" }} />
        <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
          출력
        </p>
        <hr style={{ color: "gray" }} />
        <p
          className="NanumSquare"
          style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
          {problemData.problemOutputContent}
        </p>
      </div>
    </div>
  );
};

// 코딩 영역(IDE)
const CodingPlace = () => {
  // let allheight = window.innerHeight
  // let height = allheight * 0.46
  // console.log(height)
  let [code, setCode] = useState("");
  // let [solvingHeight, setHeight] = useState(height);
  // let [isClick, setIsClick] = useState(false);

  const onChange = (newValue) => {
    setCode(newValue);
    console.log("code ", code);
  };

  // const upMouse = (event) => {
  //   setIsClick(false)
  // }

  // const downMouse = (event) => {
  //   setIsClick(true)
  // }

  // const moveHeight = (event) => {
  //   if (isClick === true) {
  //     console.log(event)
  //     setHeight(solvingHeight-1)
  //   }
  //   // console.log(solvingHeight);
  // };

  // 제출 이벤트
  const clickSubmit = () => {
    console.log("submit ", code);
  };

  // 제출 확인 모달 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // lang에 할당된 값을 선택 상자를 기준으로 동적으로(파이썬/자바) 변동시키면 된다.
  const lang = "python";

  // 선택 상자 변화 반영
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  // 코딩 영역 페이지 렌더링
  return (
    <div>
      <div style={{ width: "70vw", height: "7vh", border: "0.1px solid gray", textAlign: "right" }}>
        {/* <p
          className="NanumSquare"
          style={{ color: "white", fontSize: "2vh", height: "100%", padding: "2%" }}>
          코딩할 언어
        </p> */}
        <Select
          defaultValue="python"
          onChange={handleChange}
          options={[
            {
              value: "python",
              label: "Python",
            },
            {
              value: "java",
              label: "Java",
            },
          ]}></Select>
      </div>
      <div
        id="console"
        style={{
          width: "69.5vw",
          height: "46vh",
          verticalAlign: "top",
        }}>
        {lang === "python" && (
          <CodeMirror
            value={code}
            width="70vw"
            height="46vh"
            extensions={[python({ jsx: true })]}
            onChange={onChange}
            theme={darcula}
          />
        )}
        {lang === "java" && (
          <CodeMirror
            value={code}
            width="70vw"
            height="46vh"
            extensions={[java({ jsx: true })]}
            onChange={onChange}
            theme={darcula}
          />
        )}
      </div>
      {/* onMouseDown={downMouse} onMouseUp={upMouse} onMouseMove={moveHeight}   */}
      <div style={{ width: "70vw", height: "0.7vh", background: "gray" }}></div>
      <div
        style={{
          width: "70vw",
          height: "5.3vh",
          border: "0.1px solid gray",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}>
          <p
            className="NanumSquare"
            style={{ color: "white", marginLeft: "10px", fontSize: "2.1vh" }}>
            결과창
          </p>
          <div>
            <Button className="NanumSquare" style={{ margin: "5px" }} onClick={clickSubmit}>
              제출
            </Button>
            <Button className="NanumSquare" style={{ margin: "5px" }} onClick={showModal}>
              나가기
            </Button>
          </div>
        </div>
      </div>
      <Modal title="나가기" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p className="NanumSquare">정말로 나가시겠습니까?</p>
      </Modal>
    </div>
  );
};

// 콘솔 영역(상태창)
const Console = () => {
  return (
    <div style={{ backgroundColor: "#1D1E22" }}>
      <div></div>
    </div>
  );
};

// 전체 페이지 렌더링
const PracticeSolvingPage = () => {
  return (
    <div id="allconsole">
      {/* <RecoilRoot>
        <BattleNav />
        <Problem />
        <CodingPlace />
        <ButtonsLayer />
        <Console />
      </RecoilRoot> */}
      <div>
        <BattleNav />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            border: "0.1px solid gray",
          }}>
          <div style={{ width: "30vw", height: "92vh", border: "0.1px solid gray" }}>
            <Problem />
          </div>
          <div>
            <div style={{ width: "70vw", height: "59vh", border: "0.1px solid gray" }}>
              <CodingPlace />
            </div>
            <div style={{ width: "70vw", height: "33vh", border: "0.1px solid gray" }}>
              <Console />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSolvingPage;
