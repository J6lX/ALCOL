import { React, useState } from "react";
import { RecoilRoot, atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import axios from "axios";
import $ from "jquery";
import Logo from "../../assets/alcol_empty_black.png";
import Dots from "../../assets/dots.png";
import CountDownTimer from "./CountDownTimer";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { darcula } from "@uiw/codemirror-theme-darcula";
import "./SolvingPage.css";
import { Button, Modal } from "antd";
import { userCode, isSubmitSpin } from "../../states/atoms";
// import { useTable } from "react-table";
import "animate.css";

let allheight = window.innerHeight;

const isClickState = atom({
  key: "isClickState",
  default: false,
});

const solvingHeightState = atom({
  key: "solvingHeightState",
  default: allheight * 0.46,
});

const consoleHeightState = atom({
  key: "consoleHeightState",
  default: allheight * 0.35,
});

const submitMessageState = atom({
  key: "submitMessageState",
  default: "",
});

const BattleNav = ({ userInfo, mode }) => {
  // const mode = useRecoilValue(selectedMode);
  let battlemode;
  if (mode === "speed") {
    battlemode = "스피드";
  } else if (mode === "optimization") {
    battlemode = "최적화";
  }

  return (
    <div className="BattleNav">
      <img src={Logo} alt="alcol_logo_black" style={{ height: "5vh", marginLeft: "20px" }} />
      <div style={{ display: "flex", marginRight: "10vw" }}>
        <p
          className="NanumSquare"
          style={{ color: "black", fontSize: "2.5vh", marginRight: "3vw" }}>
          {battlemode}
        </p>
        <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh" }}>
          {userInfo.other.nick}
        </p>
        <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh" }}>
          Vs.
        </p>
        <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh" }}>
          {userInfo.user.nick}
        </p>
      </div>
      <div style={{ width: "200px", height: "auto" }}>
        <CountDownTimer className="timer" />
      </div>
    </div>
  );
};

const ExampleTable = ({ inputData, outputData }) => {
  console.log(inputData, outputData);

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

const Problem = ({ problemInfo }) => {
  return (
    <div style={{ border: "0.1px solid gray" }}>
      <div style={{ width: "29.6vw", height: "7vh", border: "0.1px solid gray" }}>
        <p
          className="NanumSquare"
          style={{ color: "white", fontSize: "2.5vh", fontWeight: "bold", padding: "2%" }}>
          {problemInfo.prob_name}
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
          {problemInfo.prob_content}
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
          {problemInfo.prob_input_content}
        </p>
        <hr style={{ height: "1px", background: "gray" }} />
        <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
          출력
        </p>
        <hr style={{ color: "gray" }} />
        <p
          className="NanumSquare"
          style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
          {problemInfo.prob_output_content}
        </p>
        <hr style={{ color: "gray" }} />
        <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
          입출력 예시
        </p>
        <hr style={{ color: "gray" }} />
        <ExampleTable
          inputData={problemInfo.prob_input_testcase}
          outputData={problemInfo.prob_output_testcase}
        />
        <hr style={{ color: "gray" }} />
      </div>
    </div>
  );
};

const CodingPlace = ({ problemNumber, language, submitcode, clickSurrender, codeEmit }) => {
  const [solvingHeight, setHeight] = useRecoilState(solvingHeightState);
  const [isClick, setIsClick] = useRecoilState(isClickState);
  const setConsoleHeight = useSetRecoilState(consoleHeightState);
  const [code, setCode] = useRecoilState(userCode);
  const setSubmitMessage = useSetRecoilState(submitMessageState);
  const [loading, setLoading] = useRecoilState(isSubmitSpin);
  // const problem_number = 1;

  const onChange = (newValue) => {
    setLoading(false);
    setCode(newValue);
    codeEmit(newValue);
  };

  document.addEventListener("mouseup", (e) => {
    setIsClick(false);
  });

  const upMouse = (event) => {
    setIsClick(false);
  };

  const downMouse = (event) => {
    setIsClick(true);
  };

  const moveMouse = (event) => {
    if (isClick === true) {
      let y = event.clientY - allheight * 0.13;
      setConsoleHeight(y);
      if (solvingHeight < y && solvingHeight < allheight * 0.6) {
        setHeight(solvingHeight + 3);
      } else if (solvingHeight > y && solvingHeight > allheight * 0.2) {
        setHeight(solvingHeight - 3);
      }
    }
  };

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const showSubmitModal = () => {
    setIsSubmitModalOpen(true);
  };
  const submitHandleOk = () => {
    setLoading(true);
    clickSubmit();
    setIsSubmitModalOpen(false);
  };
  const submitHandleCancel = () => {
    setIsSubmitModalOpen(false);
  };

  const clickSubmit = () => {
    if (code.trim() === "") {
      setSubmitMessage("코드를 입력해주세요.");
    } else {
      let codedata = "";
      for (let i = 0; i < code.length; i++) {
        if (code[i] === "\n") {
          codedata += "\n";
          for (let j = 1; j < code.length - i - 1; j += 2) {
            if (code[i + j] === " " && code[i + j + 1] === " ") {
              codedata += "\t";
            } else {
              i += j - 1;
              break;
            }
          }
        } else {
          codedata += code[i];
        }
      }
      setTimeout(() => {
        submitcode(codedata, problemNumber);
      }, 500);
    }
  };

  const surrend = () => {
    clickSurrender();
  };

  return (
    <div onMouseUp={upMouse} onMouseMove={moveMouse}>
      <div style={{ width: "69vw", height: "7vh", border: "0.1px solid gray", textAlign: "right" }}>
        <p
          className="NanumSquare"
          style={{ color: "white", fontSize: "2vh", height: "100%", padding: "2%" }}>
          코딩할 언어: {language}
        </p>
      </div>
      <div
        id="console"
        style={{
          width: "69vw",
          height: `${solvingHeight}px`,
          verticalAlign: "top",
        }}>
        {language === "Java" && (
          <CodeMirror
            id="IDE"
            value={code}
            width="69vw"
            height={`${solvingHeight}px`}
            extensions={[java({ jsx: true })]}
            onChange={onChange}
            theme={darcula}
          />
        )}
        {language === "Python3" && (
          <CodeMirror
            id="IDE"
            value={code}
            width="69vw"
            height={`${solvingHeight}px`}
            extensions={[python({ jsx: true })]}
            onChange={onChange}
            theme={darcula}
          />
        )}
        {language === "C++" && (
          <CodeMirror
            id="IDE"
            value={code}
            width="69vw"
            height={`${solvingHeight}px`}
            extensions={[cpp({ jsx: true })]}
            onChange={onChange}
            theme={darcula}
          />
        )}
      </div>
      <div
        role="button"
        onMouseDown={downMouse}
        onMouseMove={moveMouse}
        onMouseUp={upMouse}
        style={{ position: "relative", width: "69vw", height: "1vh", background: "gray" }}>
        <img
          onMouseDown={downMouse}
          onMouseMove={moveMouse}
          onMouseUp={upMouse}
          src={Dots}
          alt="dots"
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "(-50%, -50%)",
            height: "5px",
          }}
        />
      </div>
      <div
        style={{
          width: "69vw",
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
            <Button
              loading={loading}
              className="NanumSquare"
              style={{ margin: "5px" }}
              onClick={showSubmitModal}>
              제출
            </Button>
            <Button className="NanumSquare" style={{ margin: "5px" }} onClick={surrend}>
              항복
            </Button>
          </div>
        </div>
      </div>
      <Modal
        title="제출하시겠습니까?"
        open={isSubmitModalOpen}
        onOk={submitHandleOk}
        okText="제출"
        onCancel={submitHandleCancel}
        cancelText="취소">
        <p>코드를 제출하면 채점이 시작됩니다.</p>
        <p>채점 결과가 나오기까지 시간이 조금 걸릴 수 있습니다.</p>
        <small>제출하지 않으려면 취소를 누르세요!</small>
      </Modal>
    </div>
  );
};

const Console = ({ submitMessage }) => {
  // const submitMessage = useRecoilValue(submitMessageState);
  // const solvingHeight = useRecoilValue(solvingHeightState);
  const consoleHeight = useRecoilValue(consoleHeightState);
  // window.onload();
  // const resultList = useRecoilValue(resultListResultInfo);
  const makeSubmitMessage = () => {
    const result = [];
    for (let i = 0; i < submitMessage.length; i++) {
      if (submitMessage[i].nick === "me") {
        if (submitMessage[i].result === "accepted") {
          result.push(
            <p key={i} className="NanumSquare" style={{ color: "white" }}>
              &nbsp;&gt;&gt; 제출 결과: 테스트케이스 전부 정답!
            </p>
          );
        } else if (submitMessage[i].result === "error") {
          result.push(
            <p key={i} className="NanumSquare" style={{ color: "white" }}>
              &nbsp;&gt;&gt; 제출 결과: Error! {submitMessage[i].error}
            </p>
          );
        } else {
          result.push(
            <p key={i} className="NanumSquare" style={{ color: "white" }}>
              &nbsp;&gt;&gt; 제출 결과: 테스트케이스 {submitMessage[i].result}
            </p>
          );
        }
      }
    }
    return result;
  };
  return (
    <div
      className="scrollDesign"
      style={{
        backgroundColor: "#16171b",
        height: `${consoleHeight}px`,
        overflowY: "scroll",
      }}>
      {makeSubmitMessage()}
    </div>
  );
};

const SolvingPage = ({
  problemInfo,
  battleMode,
  battleLanguage,
  battleuserinfo,
  submitMessage,
  submit,
  clickSurrender,
  codeEmit,
}) => {
  const problemNumber = problemInfo.prob_no;

  const surrend = () => {
    clickSurrender();
  };

  const codeUpdate = (code) => {
    codeEmit(code);
  };

  const info = (data) => {
    Modal.info(data);
  };

  $(function () {
    $("#IDE").on("paste", function (event) {
      event.preventDefault();
      const data = {
        title: "복사나 붙여넣기 불가!",
        content: (
          <div>
            <p>배틀의 공평한 진행을 위해서</p>
            <p>복사나 붙여넣기는 불가능합니다!</p>
            <p>코드를 직접 타이핑해주세요.</p>
          </div>
        ),
        okText: "확인",
        onOk() {},
      };
      info(data);
      return false;
    });
  });

  $(function () {
    $("#IDE").on("copy", function (event) {
      event.preventDefault();
      const data = {
        title: "복사 붙여넣기 불가!",
        content: (
          <div>
            <p>배틀의 공평한 진행을 위해서</p>
            <p>복사나 붙여넣기는 불가능합니다!</p>
            <p>코드를 직접 타이핑해주세요.</p>
          </div>
        ),
        okText: "확인",
        onOk() {},
      };
      info(data);
      return false;
    });
  });

  return (
    <div id="allconsole" className="animate__animated animate__fadeIn">
      <RecoilRoot>
        <div>
          <BattleNav userInfo={battleuserinfo} mode={battleMode} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              border: "0.1px solid gray",
            }}>
            <div style={{ width: "30vw", height: "92vh", border: "0.1px solid gray" }}>
              <Problem problemInfo={problemInfo} />
            </div>
            <div>
              <div style={{ width: "69vw", height: "auto", border: "0.1px solid gray" }}>
                <CodingPlace
                  problemNumber={problemNumber}
                  language={battleLanguage}
                  submitcode={submit}
                  clickSurrender={surrend}
                  codeEmit={codeUpdate}
                />
              </div>
              <div style={{ width: "69vw", height: "auto" }}>
                <Console submitMessage={submitMessage} />
              </div>
            </div>
          </div>
        </div>
      </RecoilRoot>
    </div>
  );
};

export default SolvingPage;
