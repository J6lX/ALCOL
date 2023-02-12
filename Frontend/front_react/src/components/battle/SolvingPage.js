import { React, useState } from "react";
import { RecoilRoot, atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import axios from "axios";
import Logo from "../../assets/alcol_empty_black.png";
import Dots from "../../assets/dots.png";
import CountDownTimer from "./CountDownTimer";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { darcula } from "@uiw/codemirror-theme-darcula";
import "./SolvingPage.css";
import { Button} from "antd";

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

const CodingPlace = ({ problemNumber, language, submitcode, clickSurrender }) => {
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
    }
  };

  const surrend = () => {
    clickSurrender()
  }


  console.log("참인가요?", language[0] === "Java", language)

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
          id="IDE"
          value={code}
          width="69vw"
          height={`${solvingHeight}px`}
          extensions={language[0] === "Java"? [java({ jsx: true })] : [python({ jsx: true })]}
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
            <Button className="NanumSquare" style={{ margin: "5px" }} onClick={surrend}>
              항복
            </Button>
          </div>
        </div>
      </div>
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

const SolvingPage = ({ problemInfo, battleMode, battleLanguage, battleuserinfo, submit, clickSurrender }) => {
  
  const problemNumber = problemInfo.prob_no

  const surrend = () => {
    clickSurrender()
  }

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
                <CodingPlace problemNumber={problemNumber} language={battleLanguage} submitcode={submit} clickSurrender={surrend} />
              </div>
              <div style={{ width: "69vw", height: "auto" }}>
                <Console />
              </div>
            </div>
          </div>
        </div>
      </RecoilRoot>
    </div>
  );
};

export default SolvingPage;
