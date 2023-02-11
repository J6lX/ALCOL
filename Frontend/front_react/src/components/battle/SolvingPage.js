import { React, useState } from "react";
import { RecoilRoot, atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import axios from "axios";
import Logo from "../../assets/alcol_empty_black.png";
import Dots from "../../assets/dots.png";
import CountDownTimer from "./CountDownTimer";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
// import { oneDark } from "@codemirror/theme-one-dark";
import { darcula } from "@uiw/codemirror-theme-darcula";
import "./SolvingPage.css";
import { Button, message, Modal } from "antd";
// import { selectedLanguage } from "../../states/atoms";

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

const ResultMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "warning",
      content: "맥주 5000cc님이 코드를 제출했습니다. (테스트케이스 50개 중 46개 정답)",
      duration: 3,
      style: { marginTop: "5.5vh" },
    });
  };
  return (
    <>
      {contextHolder}
      <Button onClick={success}>제출 소식</Button>
    </>
  );
};

const BattleNav = ({userInfo, mode}) => {
  // const mode = useRecoilValue(selectedMode);
  let battlemode
  if (mode[0] === "speed") {
    battlemode = "스피드"
  } else if (mode[0] === "optimization") {
    battlemode = "최적화"
  }

  console.log("배틀 모드", mode)

  console.log("userInfosolving", userInfo)
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
        <ResultMessage className="MessageToast" />
      </div>
      <div style={{ width: "200px", height: "auto" }}>
        <CountDownTimer className="timer" />
      </div>
    </div>
  );
};

const Problem = (problemInfo) => {
  const problem = problemInfo.problemInfo
  return (
    <div style={{ border: "0.1px solid gray" }}>
      <div style={{ width: "29.6vw", height: "7vh", border: "0.1px solid gray" }}>
        <p
          className="NanumSquare"
          style={{ color: "white", fontSize: "2.5vh", fontWeight: "bold", padding: "2%" }}>
          {problem.prob_name}
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
          {problem.prob_content}
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
          {problem.prob_input_content}
        </p>
        <p
          className="NanumSquare"
          style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
          ex. {problem.prob_input_testcase}
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
          {problem.prob_output_content}
        </p>
        <p
          className="NanumSquare"
          style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
          ex. {problem.prob_output_testcase}
        </p>
      </div>
    </div>
  );
};

const CodingPlace = ({ problemNumber, language, submitcode }) => {
  const [solvingHeight, setHeight] = useRecoilState(solvingHeightState);
  const [isClick, setIsClick] = useRecoilState(isClickState);
  const setConsoleHeight = useSetRecoilState(consoleHeightState);
  const [code, setCode] = useState("");
  const setSubmitMessage = useSetRecoilState(submitMessageState);
  // const problem_number = 1;

  console.log("배틀 언어", language)

  const onChange = (newValue) => {
    console.log(newValue);

    setCode(newValue);
    // console.log(newValue);
    // console.log("code ", code);
  };

  document.addEventListener("mouseup", (e) => {
    setIsClick(false);
  });

  const upMouse = (event) => {
    setIsClick(false);
    console.log(isClick);
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
      console.log(event);
      console.log(event.clientY);
      console.log(y);
    }
  };

  const clickSubmit = () => {
    if (code.trim() === "") {
      setSubmitMessage("코드를 입력해주세요.");
    } else {
      let codedata = "";
      // 내일 물어보기: tab이 spacebar로 이루어져 있는 것 같은데 탭도 꼭 개행문자가 필요한지. 현재 가능하긴 함.
      for (let i=0; i<code.length; i++) {
        if (code[i] === "\n") {
          codedata += "\n"
          console.log("enter", code[i])
          for (let j=1; j<code.length-i-1; j+=2) {
            if (code[i+j] === " " && code[i+j+1] === " ") {
              codedata += "\t"
              console.log("tab", code[i+j])
            } else {
              i += j-1
              break
            }
          }
        } else {
          console.log(code[i])
          codedata += code[i]
        }
      }
      setTimeout(()=>{
        submitcode(codedata, problemNumber);}, 500);
      // console.log(codedata)
      // console.log(JSON.stringify({code: codedata}));
      // const solving_data = {
      //   messageType: "submit",
      //   problem_id: problemNumber,
      //   language: language,
      //   code: code,
      // };
      // 나중에 recoil이나 shared로 뺄 수 있으면 빼기.
      // const header = {
      //   headers: {
      //     access_token: "access_token",
      //     refresh_token: "refresh_token",
      //     user_id: "user_id",
      //   },
      // };

      // console.log(solving_data, header);
      // setSubmitMessage("뭔가 제출 했음");
      // axios
      //   .post(`http://i8b303.p.ssafy.io/submit/${problem_number}`, solving_data, header)
      //   .then((response) => {
      //     setSubmitMessage(response);
      //   })
      //   .catch((error) => {
      //     setSubmitMessage(error);
      //   });
    }
  };

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
        <CodeMirror
          value={code}
          width="69vw"
          height={`${solvingHeight}px`}
          extensions={[python({ jsx: true })]}
          onChange={onChange}
          theme={darcula}
        />
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
            <Button className="NanumSquare" style={{ margin: "5px" }} onClick={clickSubmit}>
              제출
            </Button>
            <Button className="NanumSquare" style={{ margin: "5px" }} onClick={showModal}>
              항복
            </Button>
          </div>
        </div>
      </div>
      <Modal title="항복" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p className="NanumSquare">정말로 항복하시겠습니까?</p>
      </Modal>
    </div>
  );
};

const Console = () => {
  const submitMessage = useRecoilValue(submitMessageState);
  // const solvingHeight = useRecoilValue(solvingHeightState);
  const consoleHeight = useRecoilValue(consoleHeightState);
  // window.onload();

  return (
    <div
      className="scrollDesign"
      style={{
        backgroundColor: "#16171b",
        height: `${consoleHeight}px`,
        overflowY: "scroll",
      }}>
      <p className="NanumSquare" style={{ color: "white", padding: "15px" }}>
        &gt;&gt; {submitMessage}
      </p>
    </div>
  );
};

const SolvingPage = ({ problemInfo, battleMode, battleLanguage, battleuserinfo, submit, goResultPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };
  const handleOk = () => {
    setIsModalOpen(false);
    goResultPage();
  };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };
  const problemNumber = problemInfo.prob_no

  return (
    <div id="allconsole">
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
                <CodingPlace problemNumber={problemNumber} language={battleLanguage} submitcode={submit} goResultPage={goResultPage} />
              </div>
              <div style={{ width: "69vw", height: "auto" }}>
                <Console />
              </div>
            </div>
          </div>
        </div>
        <Modal title="제출 결과" open={isModalOpen} onOk={handleOk}>
          <p>당신은 알고리즘의 신!</p>
          <p>모든 정답을 맞췄습니다!</p>
          <p>
            <small>테스트 케이스 50/50</small>
          </p>
        </Modal>
      </RecoilRoot>
    </div>
  );
};

export default SolvingPage;
