import { React, useState, useEffect } from "react";
// import axios from "axios";
import ReadyPage from "./ReadyPage";
import BanPage from "./BanPage";
import WaitOtherBanPage from "./WaitOtherBanPage";
import SelectedProblemPage from "./SelectedProblemPage";
import SolvingPage from "./SolvingPage";
import ResultPage from "./ResultPage";
import { useRecoilState } from "recoil";
import { selectedMode, selectedLanguage, matchingPlayerInfo } from "../../states/atoms";

let submitResult = "";

const serverAddress = "i8b303.p.ssafy.io:9002";
const websocketAddress = "ws://" + serverAddress + "/websocket";
let socket = null;

const ContinuousBattlePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBanWait, setIsBanWait] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [problemNumber, setProblemNumber] = useState("-1");
  const [problems, setProblems] = useState([]);
  const idInfo = useRecoilState(matchingPlayerInfo);
  const battleModeInfo = useRecoilState(selectedMode);
  const languageMode = useRecoilState(selectedLanguage);
  console.log(battleModeInfo, languageMode);

  useEffect(() => {
    setProblems([
      {
        problem_no: 1001,
        problem_category: ["구현", "그래프 이론", "그래프 탐색"],
      },
      {
        problem_no: 1002,
        problem_category: ["수학", "브르투포스 알고리즘"],
      },
      {
        problem_no: 1003,
        problem_category: ["다이나믹 프로그래밍", "비트 마스킹", "최대 유량"],
      },
    ]);
  }, []);
  const messageType = "connect";
  const userId = idInfo.userId;
  const otherId = idInfo.otherId;
  const battleMode = battleModeInfo;
  console.log(battleModeInfo[0]);

  socket = new WebSocket(websocketAddress);
  console.log("socket", socket);

  socket.onopen = () =>
    setTimeout(
      socket.send(
        JSON.stringify({
          messageType: messageType,
          userId: userId,
          otherId: otherId,
          battleMode: battleMode,
        })
      ),
      2000
    );

  socket.onmessage = (servermessage) => {
    const data = JSON.parse(servermessage);
    if (data.messageType === "connect_success") {
      console.log("연결 완료!");
      console.log(data);

      // axios
      //   .get("http://i8b303.p.ssafy.io/problemList", header)
      //   .then((response) => {
      //     setProblems(response.data.problems);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      setTimeout(() => {
        setIsConnected(true);
        setIsReady(true);
      }, 3000);
    } else if (data.messageType === "ban_success") {
      console.log("문제 선택 완료!");
      setTimeout(() => {
        setIsReady(false);
        setIsBanWait(true);
      }, 5000);
    } else if (data.messageType === "select_success") {
      setTimeout(() => {
        setIsBanWait(false);
        setIsSelected(true);
        setTimeout(() => {
          setIsSelected(false);
          setIsSolving(true);
        }, 15000);
      }, 5000);
    } else if (data.messageType === "submit_success") {
      submitResult = data.submitResult;
      console.log(submitResult);
      if (submitResult === "success") {
        setIsSolved(true);
      }
    } else if (data.messageType === "close") {
      socket.onclose();
    } else {
      console.log("뭐가 오긴 왔는데...");
      console.log(data);
    }
  };

  socket.onclose = (message) => {
    console.log("closed!", message);
  };
  socket.onerror = (message) => {
    console.log("error", message);
  };

  const changeBanProblem = (data) => {
    setProblemNumber(data);
    // socket.send(JSON.stringify({ method: "ban", data: data }));
    setIsReady(false);
    setIsBanWait(true);
    setTimeout(() => {
      setIsBanWait(false);
      setIsSelected(true);
      setTimeout(() => {
        setIsSelected(false);
        setIsSolving(true);
      }, 10000);
    }, 10000);
  };

  const goResultPage = () => {
    setIsSolving(false);
    setIsSolved(true);
    // socket.onclose();
  };

  //확인용 함수들
  const changeConnectTrue = () => {
    setTimeout(() => {
      setIsConnected(true);
      setIsReady(true);
    }, 5000);
  };
  // const changeSelectedTrue = () => {
  //   setTimeout(() => {
  //     setIsSelected(true);
  //     setIsReady(false);
  //   }, 5000);
  // };
  // const changeSolvedTrue = () => {
  //   setTimeout(() => {
  //     setIsSolved(true);
  //     setIsSelected(false);
  //   }, 5000);
  // };
  return (
    <div>
      <div>
        <button onClick={changeConnectTrue}>connect</button>
        {/* <button onClick={changeSelectedTrue}>banselect</button>
        <button>submit_resultfail</button>
        <button onClick={changeSolvedTrue}>submit_resultsuccess</button> */}
        {!isConnected && <ReadyPage />}
        {isConnected && isReady && <BanPage props={problems} changeBanProblem={changeBanProblem} />}
        {isConnected && isBanWait && <WaitOtherBanPage />}
        {isConnected && isSelected && (
          <SelectedProblemPage problemNumber={problemNumber} problems={problems} />
        )}
        {isConnected && isSolving && <SolvingPage goResultPage={goResultPage} />}
        {isSolved && <ResultPage />}
      </div>
    </div>
  );
};

export default ContinuousBattlePage;
