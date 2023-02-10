import { React, useState, useEffect } from "react";
import ReadyPage from "./ReadyPage";
import BanPage from "./BanPage";
import WaitOtherBanPage from "./WaitOtherBanPage";
import SelectedProblemPage from "./SelectedProblemPage";
import SolvingPage from "./SolvingPage";
import ResultPage from "./ResultPage";
import { useRecoilState } from "recoil";
import { selectedMode, selectedLanguage, matchingPlayerInfo } from "../../states/atoms";

let submitResult = "";

// const serverAddress = "localhost:3000";
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

  const messageType = "connect";
  const userId = idInfo[0].userId;
  const otherId = idInfo[0].otherId;
  const hostCheck = idInfo[0].hostCheck;
  const battleMode = battleModeInfo[0];
  console.log(messageType, userId, otherId, hostCheck, battleMode);

  socket = new WebSocket(websocketAddress);
  console.log("socket", socket);

  useEffect(() => {
    socket.onopen = () =>
      setTimeout(
        socket.send(
          JSON.stringify({
            messageType: messageType,
            userId: userId,
            otherId: otherId,
            hostCheck: hostCheck,
            battleMode: battleMode,
          })
        ),
        2000
      );
  }, [userId, otherId, hostCheck, battleMode]);

  useEffect(() => {
    return () => {
      console.log("배틀을 나가서 소켓 연결 끊김");
      socket.onclose();
    };
  }, []);

  socket.onmessage = (servermessage) => {
    console.log(servermessage);
    const data = JSON.parse(servermessage.data);
    if (data.messageType === "connect_success") {
      console.log("연결 완료!");
      console.log(data);
      socket.send(
        JSON.stringify({
          messageType: "getProblem",
          userId: userId,
          otherId: otherId,
        })
      );
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
    } else if (data.messageType === "sendProblem") {
      console.log(data.problems);
      const problems = data.problems;
      setProblems(problems);
      setTimeout(() => {
        setIsConnected(true);
        setIsReady(true);
      }, 3000);
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
    socket.send(JSON.stringify({ method: "ban", data: data }));
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

  return (
    <div>
      <div>
        {!isConnected && <ReadyPage />}
        {isConnected && isReady && <BanPage props={problems} changeBanProblem={changeBanProblem} />}
        {isConnected && isBanWait && <WaitOtherBanPage />}
        {isConnected && isSelected && (
          <SelectedProblemPage problemNumber={problemNumber} problems={problems} />
        )}
        {isConnected && isSolving && battleMode === "speed" && (
          <SolvingPage goResultPage={goResultPage} />
        )}
        {isConnected && isSolving && battleMode === "optimization" && (
          <SolvingPage goResultPage={goResultPage} />
        )}
        {isSolved && <ResultPage />}
      </div>
    </div>
  );
};

export default ContinuousBattlePage;
