import { React, useState, useEffect } from "react";
// import { RecoilRoot, atom, useRecoilState } from "recoil";

import Logo from "../../assets/alcol_empty_black.png";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
// import { oneDark } from "@codemirror/theme-one-dark";
import { darcula } from "@uiw/codemirror-theme-darcula";
import "./PracticeSolvingPage.css";
import { Button, Modal, Select } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PracticeProblemState } from "../../states/ProblemBank";
import { useRecoilState, useRecoilValue } from "recoil";
import { AccessTokenInfo, LoginState, RefreshTokenInfo } from "../../states/LoginState";

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

// 언어명을 채점 서버에서 요구하는 형식에 맞게 수정해 주는 함수
function DefineLanguage(language) {
  // python은 Python3으로 수정
  if (language === "python") {
    return "Python3";
  }
  // java는 Java로 수정
  else if (language === "java") {
    return "Java";
    // cpp는 C++로 수정
  } else if (language === "cpp") {
    return "C++";
  }
}

const ExampleTable = ({ inputData, outputData }) => {
  // console.log(inputData, outputData);

  // const inputList = inputData.split("\$\$").map((data) => {
  //   return (
  //     <p key={data} className="NanumSquare">
  //       {data}
  //     </p>
  //   );
  // });
  // const outputList = outputData.split("\$\$").map((data) => {
  //   return (
  //     <p key={data} className="NanumSquare">
  //       {data}
  //     </p>
  //   );
  // });

  // console.log(inputList);
  // console.log(outputList);

  // const InputTC = () => {
  //   const result = [];
  //   for (let i = 0; i < inputData.length; i++) {
  //     result.push(<div key={i}>{inputData[i]} </div>);
  //   }
  //   return result;
  // };

  // const OutputTC = () => {
  //   const result = [];
  //   for (let i = 0; i < outputData.length; i++) {
  //     result.push(<div key={i}>{outputData[i]} </div>);
  //   }
  //   return result;
  // };

  return (
    <div>
      <table border={1} style={{ margin: "15px" }}>
        <thead>
          <tr>
            <th className="NanumSquare" style={{ color: "white" }}>
              input
            </th>
            <th className="NanumSquare" style={{ color: "white" }}>
              output
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="NanumSquare">{inputData}</td>
            <td className="NanumSquare">{outputData}</td>
          </tr>
        </tbody>
      </table>
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
        console.log(response);
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
          problemInputTC: response.data.prob_input_testcase.split("$$"),
          // 문제 난이도(티어)
          problemTier: response.data.prob_tier,
          // 메모리 제한
          problemMemoryLimit: response.data.prob_memory_limit,
          // 출력 데이터에 대한 설명
          problemOutputContent: response.data.prob_output_content,
          // 출력 테스트 케이스
          problemOutputTC: response.data.prob_output_testcase.split("$$"),
          // 메모리 제한
        };
        // 정제한 데이터를 recoil에 저장
        setProblemData(originProblemData);
        console.log(originProblemData);
        window.scrollTo(0, 0);
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
          style={{
            color: "white",
            lineHeight: "2",
            padding: "5px",
            fontWeight: "lighter",
          }}>
          {problemData.problemInputContent}
          <br />
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
          <br />
        </p>
        <hr style={{ color: "gray" }} />
        <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
          입출력 예시
        </p>
        <hr style={{ color: "gray" }} />
        <br />
        <ExampleTable
          inputData={problemData.problemInputTC}
          outputData={problemData.problemOutputTC}
        />
        <br />
      </div>
    </div>
  );
};

// 코딩 영역(IDE) 페이지 렌더링
const CodingPlace = () => {
  // 현재 접속한 사용자 정보
  const accessToken = useRecoilValue(AccessTokenInfo);
  const refreshToken = useRecoilValue(RefreshTokenInfo);
  const userId = useRecoilValue(LoginState);

  // 문제 번호 정보
  const problemId = useParams().problemno;

  // let allheight = window.innerHeight
  // let height = allheight * 0.46
  // console.log(height)
  let [code, setCode] = useState("");
  // let [solvingHeight, setHeight] = useState(height);
  // let [isClick, setIsClick] = useState(false);

  const onChange = (newValue) => {
    setCode(newValue);
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
    // code : 사용자가 IDE에 입력한 코드
    const formData = {
      problem_id: problemId,
      language: DefineLanguage(lang),
      code: code,
    };
    axios
      .post(`http://i8b303.p.ssafy.io:8000/problem-service/practiceSubmit`, formData, {
        headers: {
          access_token: accessToken,
          refresh_token: refreshToken,
          user_id: userId,
        },
      })
      .then((response) => {
        const submitResult = response.data;
        console.log(submitResult);

        // 풀이 성공 시 모달 창 띄우기
        if (response.data.bodyData.result === "success") {
          gameVictory();
        } else if (response.data.bodyData.result === "fail") {
          alert(
            `틀렸습니다... 테스트케이스 ${response.data.bodyData.success_testcase_cnt / response.data.bodyData.all_testcase_cnt
            }`
          );
        }
      })
      .catch((error) => {
        if (error.response.data.customCode === "103") {
          alert("컴파일 오류가 발생했습니다.");
          console.log(error.response.data.description);
        } else if (error.response.data.customCode === "104") {
          alert("빈 코드입니다.");
          console.log(error.response.data.description);
        } else if (error.response.data.customCode === "102") {
          alert("제출 결과를 불러올 수 없습니다.");
          console.log(error.response.data.description);
        }
        if (error.response.data.customCode === "101") {
          alert("제출 아이디를 가져올 수 없습니다.");
          console.log(error.response.data.description);
        }
      });
  };

  // 나가기 확인 모달 창 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  // 나가기 모달에서 '예' 눌렀을 때
  const handleOk = () => {
    setIsModalOpen(false);
    // 연습문제 서버로 리다이렉트
    window.location.href = "/practice";
  };
  // 나가기 모달에서 '아니오' 눌렀을 때
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 승리(정답) 모달 창 관리
  // 나가기 확인 모달 창 관리
  const [isGameEnd, setIsGameEnd] = useState(false);

  const gameVictory = () => {
    setIsGameEnd(true);
  };
  // 승리(정답) 모달에서 '예' 눌렀을 때
  const leaveOk = () => {
    setIsGameEnd(false);
    window.location.href = "/practice";
  };
  // 승리(정답) 모달에서 '취소' 눌렀을 때
  const leaveCancel = () => {
    setIsGameEnd(false);
    window.location.href = "/practice";
  };

  // lang에 할당된 값을 선택 상자를 기준으로 동적으로(파이썬/자바) 변동시키면 된다.
  const [lang, setLang] = useState("python");

  // 선택 상자 변화 반영
  const handleChange = (value) => {
    setLang(value);
  };

  // 코딩 영역 페이지 렌더링
  return (
    <div>
      <div
        style={{
          width: "70vw",
          height: "7vh",
          border: "0.1px solid gray",
          textAlign: "right",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          paddingRight: "2%",
        }}>
        <div>
          <p
            className="NanumSquare"
            style={{ color: "white", fontSize: "2vh", height: "100%", paddingRight: "5px" }}>
            코딩할 언어
          </p>
        </div>
        <div>
          <Select
            defaultValue="python"
            onChange={handleChange}
            style={{
              width: 100,
              justifyContent: "start",
            }}
            options={[
              {
                value: "python",
                label: "Python3",
              },
              {
                value: "java",
                label: "Java",
              },
              {
                value: "cpp",
                label: "C++",
              },
            ]}
          />
        </div>
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
        {lang === "cpp" && (
          <CodeMirror
            value={code}
            width="70vw"
            height="46vh"
            extensions={[cpp({ jsx: true })]}
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
      <Modal title="정답!" open={isGameEnd} onOk={leaveOk} onCancel={leaveCancel}>
        <p className="NanumSquare">정답입니다!</p>
        <p className="NanumSquare">확인 버튼을 누르면 게임이 종료됩니다.</p>
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

      {/* useEffect(() {window.scrollTo(0, 0)}) */}
      <div style={{ paddingTop: "12px" }}>
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

